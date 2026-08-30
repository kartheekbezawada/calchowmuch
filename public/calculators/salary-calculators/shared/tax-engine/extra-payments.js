/**
 * Extra-payments resolver (common layer — tax-engine spec §63–§65).
 *
 * Turns the "Optional Extra Payments" UI state into an annual figure the country engines can add
 * on top of base salary as ordinary taxable income. Country-agnostic and pure: no DOM, no fetch.
 *
 * An extra payment is one of `overtime | bonus | commission | other`. Overtime supports three
 * calculation methods (§64); the others are a plain amount. Every extra payment carries a
 * frequency basis (§65) so an entry like "£400 monthly overtime" annualises to £4,800.
 */

/** Payments-per-year for a frequency basis. 4-weekly is 13 (spec §47), never a month adjusted. */
export const BASIS_PERIODS = Object.freeze({
  oneOff: 1,
  annual: 1,
  monthly: 12,
  fourWeekly: 13,
  biweekly: 26,
  weekly: 52,
});

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/** Gross salary expressed at a period basis — used by the overtime "percent of gross" method. */
export function grossAtBasis(grossAnnual, basis) {
  const periods = BASIS_PERIODS[basis];
  return periods ? grossAnnual / periods : grossAnnual;
}

/**
 * The amount of a single extra payment *before* its frequency is applied.
 *
 * @param {object} extra
 * @param {'overtime'|'bonus'|'commission'|'other'} extra.type
 * @param {'fixed'|'hourly'|'percent'} [extra.method]   overtime only
 * @param {number} [extra.amount]                       fixed / bonus / commission / other
 * @param {number} [extra.hourlyRate]                   overtime method 'hourly'
 * @param {number} [extra.hours]                        overtime method 'hourly'
 * @param {number} [extra.percent]                      overtime method 'percent'
 * @param {string} [extra.percentBasis]                 overtime method 'percent' — key of BASIS_PERIODS
 * @param {object} ctx  { grossAnnual }
 */
export function resolveExtraPaymentAmount(extra, ctx = {}) {
  const grossAnnual = num(ctx.grossAnnual);

  if (extra.type === 'overtime') {
    const method = extra.method || 'fixed';
    if (method === 'hourly') return num(extra.hourlyRate) * num(extra.hours);
    if (method === 'percent') {
      return grossAtBasis(grossAnnual, extra.percentBasis || 'monthly') * (num(extra.percent) / 100);
    }
    return num(extra.amount); // 'fixed'
  }

  // bonus / commission / other — a plain amount at its frequency
  return num(extra.amount);
}

/** Annualise a per-period amount using its frequency basis. */
export function annualiseExtraPayment(perPeriodAmount, frequency) {
  const periods = BASIS_PERIODS[frequency] ?? 1;
  return Math.max(0, perPeriodAmount) * periods;
}

/**
 * Resolve a list of extra payments into their annual total and a per-item breakdown.
 *
 * @param {object[]} extras
 * @param {object} ctx  { grossAnnual }
 * @returns {{ items: Array<{type,method,perPeriod,frequency,annualAmount}>, totalAnnual: number }}
 */
export function resolveExtraPayments(extras, ctx = {}) {
  const items = (Array.isArray(extras) ? extras : []).map((extra) => {
    const perPeriod = resolveExtraPaymentAmount(extra, ctx);
    const frequency = extra.frequency || 'annual';
    return {
      type: extra.type,
      method: extra.method || null,
      perPeriod,
      frequency,
      annualAmount: annualiseExtraPayment(perPeriod, frequency),
    };
  });

  return {
    items,
    totalAnnual: items.reduce((sum, item) => sum + item.annualAmount, 0),
  };
}
