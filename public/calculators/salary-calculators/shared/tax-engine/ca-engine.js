/**
 * Canada take-home pay engine.
 *
 * Pure. Tax data is injected, never fetched here — same discipline as `uk-engine.js` and
 * `us-engine.js` (spec §17: the UI layer must contain zero tax logic, and the inverse must also
 * hold — no DOM, no fetch, inside the engine).
 *
 * Layered: Federal income tax → CPP (+CPP2) → EI → Provincial/territorial income tax (+ Ontario
 * surtax/health premium where applicable). Quebec swaps two of those four lines for its own
 * config (QPP instead of CPP, a reduced-rate EI + separate QPIP instead of standard EI) and adds
 * a federal abatement — see the `isQuebec` branch below.
 *
 * **The single most important mechanical difference from the UK/US engines**: Canada's Basic
 * Personal Amount (federal AND provincial) is a NON-REFUNDABLE TAX CREDIT, not a deduction from
 * taxable income. The UK Personal Allowance and the US standard deduction both reduce the income
 * that gets taxed *before* bands are applied. Canada's BPA instead reduces the tax bill directly
 * — by (tapered BPA amount × the jurisdiction's lowest marginal rate) — computed *after* the full
 * bracket tax has already been charged on un-reduced taxable income. Modelling it the UK/US way
 * (as a pre-bracket deduction) would tax nothing at all in the lowest band, rather than crediting
 * back only that band's rate on the BPA amount — a materially different, wrong number whenever
 * the BPA's credit rate differs from a higher bracket's rate, which it always does above the
 * lowest bracket. `calculateTaperedAllowance` is still the correct primitive for the *taper
 * shape* (an income-tested phase-out) — only what happens to the tapered amount afterwards
 * differs: UK subtracts it from income, Canada multiplies it by a rate and subtracts that from
 * tax owing.
 */

import { calculateProgressiveTax, calculateTaperedAllowance } from './progressive-tax.js';

/**
 * @typedef {object} CaSalaryInput
 * @property {number} grossAnnual
 * @property {string} [province] Two-letter code, e.g. 'AB', 'QC'
 * @property {number} [bonus]
 */

/**
 * @typedef {object} CaTaxData
 * @property {object} federal  federal-income-tax.json
 * @property {object} cpp      cpp.json (base CPP, non-Quebec)
 * @property {object} ei       ei.json (general EI rate, non-Quebec)
 * @property {object} province the loaded provinces/{code}.json for the selected province
 */

/**
 * BPA is a non-refundable credit, not a deduction: taper the allowance against income, then
 * credit back allowance × the jurisdiction's lowest marginal rate.
 */
function calculateBpaCredit(income, bpaConfig, bands) {
  const taper = bpaConfig.taper
    ? {
        thresholdIncome: bpaConfig.taper.thresholdIncome,
        reducedByPerPoundOver: bpaConfig.taper.reducedByDollarOver,
        floor: bpaConfig.taper.floor,
      }
    : null;
  const allowance = calculateTaperedAllowance(income, { amount: bpaConfig.amount, taper });
  const creditRate = bands[0].rate;

  return {
    amount: bpaConfig.amount,
    taperedAmount: allowance.allowance,
    isTapered: allowance.isTapered,
    creditRate,
    credit: allowance.allowance * creditRate,
  };
}

/**
 * CPP/QPP shape: a base contribution between an exemption floor and a ceiling (YMPE/MPE), plus
 * an optional second tier (CPP2/QPP2) between that ceiling and a higher one (YAMPE/AMPE). Both
 * tiers are employee-only rates — the employer share is irrelevant to a take-home calculator.
 */
function calculatePensionPlanContribution(earnings, plan) {
  const base = Math.max(0, Math.min(earnings, plan.base.ceiling) - plan.base.exemption) * plan.base.rate;
  const secondTier = plan.secondTier
    ? Math.max(0, Math.min(earnings, plan.secondTier.ceiling) - plan.secondTier.floor) * plan.secondTier.rate
    : 0;

  return {
    base,
    secondTier,
    total: base + secondTier,
    breakdown: [
      { id: 'base', name: plan.base.label ?? 'Base contribution', rate: plan.base.rate, amount: base },
      ...(plan.secondTier
        ? [
            {
              id: 'secondTier',
              name: plan.secondTier.label ?? 'Second additional contribution',
              rate: plan.secondTier.rate,
              amount: secondTier,
            },
          ]
        : []),
    ],
  };
}

/** EI/QPIP shape: a flat rate up to a Maximum Insurable Earnings ceiling, $0 marginal above it. */
function calculateFlatCappedPremium(earnings, config) {
  const amount = Math.max(0, Math.min(earnings, config.maxInsurableEarnings)) * config.rate;
  return { amount, maxInsurableEarnings: config.maxInsurableEarnings, rate: config.rate };
}

function calculateFederalTax(taxableIncome, federal) {
  const bandTax = calculateProgressiveTax(taxableIncome, federal.bands);
  const bpa = calculateBpaCredit(taxableIncome, federal.basicPersonalAmount, federal.bands);
  const total = Math.max(0, bandTax.total - bpa.credit);

  return {
    taxableIncome,
    grossTax: bandTax.total,
    breakdown: bandTax.breakdown,
    marginalRate: bandTax.marginalRate,
    bpa,
    total,
  };
}

/**
 * Ontario-style two-tier surtax: an additional percentage charged on top of provincial tax owing
 * (after the provincial BPA credit, before the health premium), in escalating tiers. This is a
 * tax-on-a-tax, not a bracket on income — deliberately kept as its own step rather than folded
 * into the provincial band schedule, the same reasoning `calculateThresholdTax` is kept separate
 * from `calculateProgressiveTax` for UK student loans (spec §11.3).
 */
function calculateSurtax(provincialTaxAfterBpa, surtaxConfig) {
  if (!surtaxConfig) return { total: 0, tiers: [] };

  let total = 0;
  const tiers = [];
  for (const tier of surtaxConfig.tiers) {
    const amountAbove = Math.max(0, provincialTaxAfterBpa - tier.threshold);
    const tierAmount = amountAbove * tier.rate;
    total += tierAmount;
    tiers.push({ threshold: tier.threshold, rate: tier.rate, amountAbove, amount: tierAmount });
  }

  return { total, tiers };
}

/**
 * Ontario Health Premium: an income-tested step function (flat dollar amounts within income
 * bands, not a marginal-rate bracket schedule), maxing out at a fixed annual amount. Modelled as
 * an explicit step table rather than a formula so a province with a different-shaped premium
 * (none currently, but the shape should not assume Ontario's specific curve) is not forced into
 * the same code path — `province.healthPremium` is simply absent for every other jurisdiction.
 */
function calculateHealthPremium(taxableIncome, config) {
  if (!config) return { total: 0 };

  for (const step of config.steps) {
    const upTo = step.upTo === null ? Infinity : step.upTo;
    if (taxableIncome <= upTo) {
      const base = step.base ?? 0;
      const rate = step.rate ?? 0;
      const from = step.from ?? 0;
      const cap = step.cap ?? Infinity;
      const amount = Math.min(cap, base + Math.max(0, taxableIncome - from) * rate);
      return { total: amount };
    }
  }

  return { total: 0 };
}

function calculateProvincialTax(taxableIncome, province) {
  const bandTax = calculateProgressiveTax(taxableIncome, province.bands);
  const bpa = calculateBpaCredit(taxableIncome, province.basicPersonalAmount, province.bands);
  const afterBpa = Math.max(0, bandTax.total - bpa.credit);
  const surtax = calculateSurtax(afterBpa, province.surtax);
  const healthPremium = calculateHealthPremium(taxableIncome, province.healthPremium);
  const total = afterBpa + surtax.total + healthPremium.total;

  return {
    taxableIncome,
    grossTax: bandTax.total,
    breakdown: bandTax.breakdown,
    marginalRate: bandTax.marginalRate,
    bpa,
    afterBpa,
    surtax,
    healthPremium,
    total,
  };
}

/**
 * @param {CaSalaryInput} input
 * @param {CaTaxData} taxData
 */
export function calculateCaTakeHome(input, taxData) {
  const { federal, cpp, ei, province } = taxData;
  if (!province) {
    throw new RangeError('ca-engine: a province/territory must be supplied');
  }

  const base = Math.max(0, Number(input.grossAnnual) || 0);
  const bonus = Math.max(0, Number(input.bonus) || 0);
  const gross = base + bonus;

  const isQuebec = province.province === 'QC';

  // --- Federal income tax ----------------------------------------------------------------
  const federalTax = calculateFederalTax(gross, federal);
  // Quebec residents receive a federal abatement, reducing federal tax owing to compensate for
  // Quebec collecting its own provincial tax directly (via Revenu Québec) rather than through
  // the standard federal-collection arrangement every other province uses.
  const abatement = isQuebec ? federalTax.total * (province.quebecAbatementRate ?? 0) : 0;
  const federalTaxPayable = Math.max(0, federalTax.total - abatement);

  // --- CPP/QPP + EI/QPIP -------------------------------------------------------------------
  // Quebec uses QPP instead of CPP, and a reduced-rate EI (on its own, lower Maximum Insurable
  // Earnings ceiling) plus a separate QPIP premium, because QPIP funds what EI would otherwise
  // fund federally. This is why Quebec is not modelled as "just another province" — two of the
  // four deduction lines read from a different config object entirely, not just a different
  // bracket table.
  const pensionPlan = calculatePensionPlanContribution(gross, isQuebec ? province.qpp : cpp);
  const eiConfig = isQuebec ? province.eiReduced : ei;
  const eiResult = calculateFlatCappedPremium(gross, eiConfig);
  const qpip = isQuebec ? calculateFlatCappedPremium(gross, province.qpip) : null;

  // --- Provincial/territorial income tax -----------------------------------------------------
  const provincialTax = calculateProvincialTax(gross, province);

  const totalDeductions =
    federalTaxPayable + pensionPlan.total + eiResult.amount + (qpip ? qpip.amount : 0) + provincialTax.total;
  const netAnnual = gross - totalDeductions;

  return {
    country: 'CA',
    currency: 'CAD',
    taxYear: federal.taxYear,
    province: { code: province.province, name: province.name },

    gross,
    baseSalary: base,
    bonus,

    federalTax: { ...federalTax, abatement, payable: federalTaxPayable },
    cpp: isQuebec ? null : pensionPlan,
    qpp: isQuebec ? pensionPlan : null,
    ei: eiResult,
    qpip,
    provincialTax,

    totalDeductions,
    netAnnual,
    effectiveRate: gross > 0 ? totalDeductions / gross : 0,

    // Federal and provincial marginal rates are reported separately, same convention as US's
    // marginalRate/stateMarginalRate/combinedMarginalRate split — never conflate the two into one
    // number a user cannot reconcile against their own bracket (spec §12).
    marginalRate: federalTax.marginalRate,
    provincialMarginalRate: provincialTax.marginalRate,
    combinedMarginalRate: federalTax.marginalRate + provincialTax.marginalRate,

    // Surfaced so the UI can disclose a taper is in effect, same convention as
    // uk-engine.js's `isInAllowanceTaper`.
    isInBpaTaper: federalTax.bpa.isTapered,
  };
}

/** Bonus impact, done the same way as the UK/US engines: net-with minus net-without. */
export function calculateCaBonusImpact(input, taxData) {
  const withBonus = calculateCaTakeHome(input, taxData);
  const withoutBonus = calculateCaTakeHome({ ...input, bonus: 0 }, taxData);
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
