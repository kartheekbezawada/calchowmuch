/**
 * UK take-home pay engine.
 *
 * Pure. Tax data is injected, never fetched here — that keeps the engine unit-testable in Node
 * without a browser or a network, and satisfies the spec §17 requirement that the UI layer
 * contain zero tax logic (the inverse also has to hold: no DOM in the engine).
 *
 * Order of operations matters and is not arbitrary:
 *   1. Pension first, because the relief method decides what Income Tax and NI are charged on.
 *   2. Personal Allowance next, tapered against income AFTER pension relief.
 *   3. Income Tax on what remains.
 *   4. NI on its own base with its own thresholds — independent of steps 2 and 3.
 *   5. Student loan on gross, independent of everything above.
 */

import {
  calculateProgressiveTax,
  calculateTaperedAllowance,
  calculateThresholdTax,
} from './progressive-tax.js';

/**
 * @typedef {object} UkSalaryInput
 * @property {number} grossAnnual
 * @property {string} [region] england | wales | northern-ireland | scotland
 * @property {number} [bonus]
 * @property {number} [pensionPercent] Employee contribution as a percentage of the basis
 * @property {string} [pensionReliefMethod] Key into pension.json `reliefMethods`
 * @property {string} [pensionBasis] full-gross-pay | qualifying-earnings
 * @property {string|null} [studentLoanPlan] Key into student-loans.json `plans`
 * @property {boolean} [hasPostgraduateLoan] Applies alongside any undergraduate plan
 */

/**
 * @typedef {object} UkTaxData
 * @property {object} incomeTax
 * @property {object} nationalInsurance
 * @property {object} studentLoans
 * @property {object} pension
 */

function resolveRegion(incomeTax, region) {
  const key = region || 'england';
  const entry = incomeTax.regions?.[key];
  if (!entry) {
    throw new RangeError(`uk-engine: unknown region "${key}"`);
  }
  const bandSet = incomeTax.bandSets?.[entry.bandSet];
  if (!bandSet) {
    throw new RangeError(`uk-engine: region "${key}" references unknown bandSet "${entry.bandSet}"`);
  }
  return { name: entry.name, bandSetKey: entry.bandSet, bands: bandSet.bands };
}

/**
 * Pension contributions.
 *
 * The relief method is the whole game here. Salary sacrifice is worth materially more than a
 * net-pay arrangement at the same percentage because it also reduces NIable earnings, and relief
 * at source costs the employee only 80% of the nominal contribution out of net pay. Treating all
 * three as "a percentage off gross" produces a wrong take-home figure in two of the three cases.
 */
function calculatePension(grossForPension, input, pensionData) {
  const percent = Number(input.pensionPercent) || 0;
  const methodKey = input.pensionReliefMethod
    || Object.entries(pensionData.reliefMethods).find(([, m]) => m.isDefault)?.[0];
  const method = pensionData.reliefMethods[methodKey];

  if (!method) {
    throw new RangeError(`uk-engine: unknown pension relief method "${methodKey}"`);
  }

  const basis = input.pensionBasis || pensionData.contributionBasis.default;
  let contributionBase = grossForPension;
  if (basis === 'qualifying-earnings') {
    const { lower, upper } = pensionData.autoEnrolment.qualifyingEarnings;
    contributionBase = Math.max(0, Math.min(grossForPension, upper) - lower);
  }

  const contribution = contributionBase * (percent / 100);

  return {
    percent,
    basis,
    reliefMethod: methodKey,
    reliefMethodName: method.name,
    contributionBase,
    contribution,
    reducesTaxableIncome: Boolean(method.reducesTaxableIncome),
    reducesNiableEarnings: Boolean(method.reducesNiableEarnings),
    // Relief at source is paid out of net pay, and the scheme reclaims basic-rate relief, so the
    // hit to take-home is only 80% of the nominal contribution.
    takeHomeCost: method.basicRateReliefReclaimedByScheme
      ? contribution * (1 - method.basicRateReliefReclaimedByScheme)
      : contribution,
  };
}

function calculateStudentLoans(gross, input, studentLoanData) {
  const entries = [];

  const planKey = input.studentLoanPlan;
  if (planKey && planKey !== 'none') {
    const plan = studentLoanData.plans[planKey];
    if (!plan) {
      throw new RangeError(`uk-engine: unknown student loan plan "${planKey}"`);
    }
    const { total, applicableIncome } = calculateThresholdTax(gross, plan.annualThreshold, plan.rate);
    entries.push({ id: planKey, name: plan.name, threshold: plan.annualThreshold, rate: plan.rate, applicableIncome, amount: total });
  }

  // A borrower can hold both an undergraduate plan and a postgraduate loan; both are deducted.
  if (input.hasPostgraduateLoan && planKey !== 'postgraduate') {
    const pg = studentLoanData.plans.postgraduate;
    const { total, applicableIncome } = calculateThresholdTax(gross, pg.annualThreshold, pg.rate);
    entries.push({ id: 'postgraduate', name: pg.name, threshold: pg.annualThreshold, rate: pg.rate, applicableIncome, amount: total });
  }

  return { entries, total: entries.reduce((sum, e) => sum + e.amount, 0) };
}

/**
 * @param {UkSalaryInput} input
 * @param {UkTaxData} taxData
 */
export function calculateUkTakeHome(input, taxData) {
  const { incomeTax, nationalInsurance, studentLoans, pension } = taxData;

  const base = Math.max(0, Number(input.grossAnnual) || 0);
  const bonus = Math.max(0, Number(input.bonus) || 0);
  const gross = base + bonus;

  const region = resolveRegion(incomeTax, input.region);
  const pensionResult = calculatePension(gross, input, pension);

  // --- Income Tax -------------------------------------------------------------------------
  const incomeForAllowance = pensionResult.reducesTaxableIncome
    ? gross - pensionResult.contribution
    : gross;

  const allowance = calculateTaperedAllowance(incomeForAllowance, incomeTax.personalAllowance);
  const taxableIncome = Math.max(0, incomeForAllowance - allowance.allowance);
  const tax = calculateProgressiveTax(taxableIncome, region.bands);

  // --- National Insurance -----------------------------------------------------------------
  // Charged on its own base with its own thresholds. Only salary sacrifice reduces it.
  const niableEarnings = pensionResult.reducesNiableEarnings
    ? gross - pensionResult.contribution
    : gross;
  const ni = calculateProgressiveTax(niableEarnings, nationalInsurance.class1Employee.bands);

  // --- Student loans ----------------------------------------------------------------------
  const loans = calculateStudentLoans(gross, input, studentLoans);

  // --- Net --------------------------------------------------------------------------------
  const totalDeductions = tax.total + ni.total + loans.total + pensionResult.takeHomeCost;
  const netAnnual = gross - totalDeductions;

  return {
    country: 'UK',
    currency: 'GBP',
    taxYear: incomeTax.taxYear,
    region: { key: input.region || 'england', name: region.name, bandSet: region.bandSetKey },

    gross,
    baseSalary: base,
    bonus,

    personalAllowance: allowance,
    taxableIncome,

    incomeTax: { total: tax.total, breakdown: tax.breakdown, marginalRate: tax.marginalRate },
    nationalInsurance: { total: ni.total, breakdown: ni.breakdown },
    studentLoans: loans,
    pension: pensionResult,

    totalDeductions,
    netAnnual,

    // Effective rate counts every deduction against gross. Marginal rate is the Income Tax band
    // on the next pound. They are deliberately reported as separate fields and must be labelled
    // separately in the UI — see spec §12.
    effectiveRate: gross > 0 ? totalDeductions / gross : 0,
    marginalRate: tax.marginalRate,

    // Surfaced so the UI can warn rather than silently showing a distorted marginal rate.
    isInAllowanceTaper: allowance.isTapered && allowance.allowance > 0,
  };
}

/**
 * Bonus impact, done properly: take-home with the bonus minus take-home without it.
 *
 * Not `bonus * marginalRate` — that ignores the bonus pushing income into a higher band, and it
 * ignores the Personal Allowance taper entirely, which is exactly where the naive method is most
 * wrong (spec §33).
 */
export function calculateUkBonusImpact(input, taxData) {
  const withBonus = calculateUkTakeHome(input, taxData);
  const withoutBonus = calculateUkTakeHome({ ...input, bonus: 0 }, taxData);
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
