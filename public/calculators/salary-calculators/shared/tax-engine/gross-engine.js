/**
 * Gross-only engine — the existing pay-period conversion path, kept as its own mode.
 *
 * This exists so the page's current behaviour survives the take-home rewrite unchanged. It
 * returns the SAME result shape as the UK engine (`gross`, `netAnnual`, `totalDeductions`,
 * `effectiveRate`, breakdown arrays) with the tax fields zeroed, so the UI can render one mode
 * without branching on which engine produced the numbers.
 */

import { fromAnnual, toAnnual } from './pay-frequency.js';

/**
 * @param {object} input
 * @param {number} input.amount
 * @param {string} input.frequency  hourly|daily|weekly|biweekly|fourWeekly|monthly|annual
 * @param {object} [input.schedule]  { hoursPerWeek, weeksPerYear, daysPerWeek }
 * @param {number} [input.bonus]
 */
export function calculateGrossOnly(input) {
  const schedule = input.schedule || {};
  const base = Math.max(0, toAnnual(input.amount, input.frequency, schedule));
  const bonus = Math.max(0, Number(input.bonus) || 0);
  const gross = base + bonus;

  return {
    country: null,
    mode: 'gross',
    currency: input.currency || 'GBP',
    gross,
    baseSalary: base,
    bonus,

    // No tax is applied, so net === gross. Reported explicitly rather than omitted, so the UI
    // never has to ask "which engine made this?" before deciding what to render.
    netAnnual: gross,
    totalDeductions: 0,
    effectiveRate: 0,
    marginalRate: 0,

    personalAllowance: null,
    taxableIncome: 0,
    incomeTax: { total: 0, breakdown: [], marginalRate: 0 },
    nationalInsurance: { total: 0, breakdown: [] },
    studentLoans: { entries: [], total: 0 },
    pension: null,
    isInAllowanceTaper: false,

    periods: fromAnnual(gross, schedule),
  };
}
