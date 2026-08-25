/**
 * US take-home pay engine (tax-engine spec §8).
 *
 * Layered exactly as the spec requires — Federal → FICA → State income tax → State payroll taxes
 * — each a separate step rather than one blended calculation, so a layer can be corrected or
 * added without touching the others.
 *
 * **No local/municipal income tax (B2 decision, spec §8.8).** The pipeline deliberately keeps a
 * slot for it so it can be added later without restructuring, and `localTaxExcluded` is returned
 * on every result so the UI can disclose the gap rather than presenting the figure as exact.
 *
 * Pure: tax data is injected, nothing is fetched here and nothing touches the DOM.
 */

import { calculateProgressiveTax } from './progressive-tax.js';

/** Wage-capped flat contribution — Social Security, SDI and PFML all share this shape. */
function cappedContribution(wages, rate, wageBase) {
  const capped = wageBase === null || wageBase === undefined ? wages : Math.min(wages, wageBase);
  return Math.max(0, capped) * rate;
}

function calculateFica(wages, fica) {
  const socialSecurity = cappedContribution(wages, fica.socialSecurity.rate, fica.socialSecurity.wageBase);
  const medicare = cappedContribution(wages, fica.medicare.rate, fica.medicare.wageBase);

  // Withholding uses a flat 200,000 threshold regardless of filing status. The taxpayer's final
  // liability threshold differs by status and is reconciled on the return, not at withholding.
  const extra = fica.additionalMedicare;
  const additionalMedicare = Math.max(0, wages - extra.withholdingThreshold) * extra.rate;

  const breakdown = [
    { id: 'socialSecurity', name: 'Social Security', amount: socialSecurity },
    { id: 'medicare', name: 'Medicare', amount: medicare },
  ];
  if (additionalMedicare > 0) {
    breakdown.push({ id: 'additionalMedicare', name: 'Additional Medicare', amount: additionalMedicare });
  }

  return {
    total: socialSecurity + medicare + additionalMedicare,
    socialSecurity,
    medicare,
    additionalMedicare,
    breakdown,
  };
}

function calculateStateIncomeTax(wages, stateData, filingStatusKey) {
  if (!stateData || stateData.taxStructure === 'none') {
    return { total: 0, breakdown: [], marginalRate: 0, taxableIncome: 0, structure: 'none', usedFilingStatus: null };
  }

  // Most state files carry `single` only. Falling back to it is a documented simplification, not
  // an accident — it is surfaced through `assumptions` on the result.
  const status = stateData.filingStatuses[filingStatusKey] || stateData.filingStatuses.single;
  if (!status) {
    return {
      total: 0, breakdown: [], marginalRate: 0, taxableIncome: 0,
      structure: stateData.taxStructure, usedFilingStatus: null,
    };
  }

  const deductionApplied = (status.standardDeduction || 0) + (status.personalExemption || 0);
  const taxableIncome = Math.max(0, wages - deductionApplied);
  const result = calculateProgressiveTax(taxableIncome, status.bands);

  return {
    total: result.total,
    breakdown: result.breakdown,
    marginalRate: result.marginalRate,
    taxableIncome,
    deductionApplied,
    structure: stateData.taxStructure,
    usedFilingStatus: stateData.filingStatuses[filingStatusKey] ? filingStatusKey : 'single',
  };
}

function calculateStatePayrollTaxes(wages, stateCode, payrollData) {
  const entry = payrollData && payrollData.states ? payrollData.states[stateCode] : null;
  if (!entry) {
    const unmodelled = payrollData && payrollData.notModelled
      ? payrollData.notModelled.jurisdictions.includes(stateCode)
      : false;
    return { total: 0, entries: [], hasUnmodelledProgram: unmodelled };
  }

  const entries = entry.contributions.map((c) => ({
    id: c.id,
    name: c.label,
    rate: c.rate,
    amount: cappedContribution(wages, c.rate, c.wageBase),
  }));

  return {
    total: entries.reduce((sum, e) => sum + e.amount, 0),
    entries,
    hasUnmodelledProgram: false,
  };
}

/**
 * @param {object} input
 * @param {number} input.grossAnnual
 * @param {string} [input.filingStatus] single | marriedFilingJointly | marriedFilingSeparately | headOfHousehold
 * @param {number} [input.bonus]
 * @param {number} [input.pretaxDeductions] 401(k), HSA etc. Reduces federal and state taxable
 *                                          income but NOT FICA (spec §8.9).
 * @param {object} taxData { federal, fica, state, payroll }
 */
export function calculateUsTakeHome(input, taxData) {
  const { federal, fica, state, payroll } = taxData;

  const base = Math.max(0, Number(input.grossAnnual) || 0);
  const bonus = Math.max(0, Number(input.bonus) || 0);
  const gross = base + bonus;

  const filingStatus = input.filingStatus || 'single';
  const federalStatus = federal.filingStatuses[filingStatus];
  if (!federalStatus) {
    throw new RangeError(`us-engine: unknown filing status "${filingStatus}"`);
  }

  const pretaxDeductions = Math.max(0, Number(input.pretaxDeductions) || 0);

  // --- Federal ------------------------------------------------------------------------------
  const federalTaxableIncome = Math.max(0, gross - pretaxDeductions - federalStatus.standardDeduction);
  const federalTax = calculateProgressiveTax(federalTaxableIncome, federalStatus.bands);

  // --- FICA ---------------------------------------------------------------------------------
  // Charged on GROSS wages. A 401(k) does not reduce FICA, which is exactly why this passes
  // `gross` rather than the federal taxable figure.
  const ficaResult = calculateFica(gross, fica);

  // --- State income tax ----------------------------------------------------------------------
  const stateTax = calculateStateIncomeTax(Math.max(0, gross - pretaxDeductions), state, filingStatus);

  // --- State payroll taxes (Bucket A) ---------------------------------------------------------
  const statePayrollTaxes = calculateStatePayrollTaxes(gross, state ? state.state : null, payroll);

  const totalDeductions =
    federalTax.total + ficaResult.total + stateTax.total + statePayrollTaxes.total + pretaxDeductions;
  const netAnnual = gross - totalDeductions;

  const assumptions = [];
  if (stateTax.usedFilingStatus && stateTax.usedFilingStatus !== filingStatus) {
    assumptions.push(
      `${state.name} brackets are modelled for single filers only, so that schedule was used.`
    );
  }
  if (statePayrollTaxes.hasUnmodelledProgram) {
    assumptions.push(
      `${state.name} operates an employee-side payroll contribution that is not yet modelled, so take-home may be slightly overstated.`
    );
  }

  return {
    country: 'US',
    currency: 'USD',
    taxYear: federal.taxYear,
    state: state ? { code: state.state, name: state.name, structure: state.taxStructure } : null,
    filingStatus,

    gross,
    baseSalary: base,
    bonus,
    pretaxDeductions,

    standardDeduction: federalStatus.standardDeduction,
    federalTaxableIncome,
    federalTax: {
      total: federalTax.total,
      breakdown: federalTax.breakdown,
      marginalRate: federalTax.marginalRate,
    },
    fica: ficaResult,
    stateTax,
    statePayrollTaxes,

    totalDeductions,
    netAnnual,
    effectiveRate: gross > 0 ? totalDeductions / gross : 0,

    // Federal marginal only. State marginal is reported separately so the two are never conflated
    // into a single number the user cannot reconcile (spec §12).
    marginalRate: federalTax.marginalRate,
    stateMarginalRate: stateTax.marginalRate,
    combinedMarginalRate: federalTax.marginalRate + stateTax.marginalRate,

    // B2: always true in V1. The UI must disclose this near the result, not in footer text.
    localTaxExcluded: true,
    assumptions,
  };
}

/** Bonus impact, done the same way as the UK engine: net-with minus net-without. */
export function calculateUsBonusImpact(input, taxData) {
  const withBonus = calculateUsTakeHome(input, taxData);
  const withoutBonus = calculateUsTakeHome({ ...input, bonus: 0 }, taxData);
  const netBonus = withBonus.netAnnual - withoutBonus.netAnnual;
  const grossBonus = withBonus.bonus;

  return {
    withBonus,
    withoutBonus,
    grossBonus,
    netBonus,
    deductedFromBonus: grossBonus - netBonus,
    effectiveBonusRate: grossBonus > 0 ? (grossBonus - netBonus) / grossBonus : 0,
  };
}
