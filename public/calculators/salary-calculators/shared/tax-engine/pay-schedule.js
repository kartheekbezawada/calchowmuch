/**
 * Pay-date schedule engine (tax-engine spec §5).
 *
 * Generates upcoming paydays and the money landing on each one. Rows carry
 * `{ index, date, movedOffWeekend, gross, deductions, net, isBonusPeriod }` — dates alone are not
 * enough, because the question users actually ask is "when do I get paid, and how much?".
 *
 * Pure: no DOM, no clock reads except an explicit `from` you pass in.
 */

import { PERIODS_PER_YEAR } from './pay-frequency.js';

const STEP_DAYS = { weekly: 7, biweekly: 14, fourWeekly: 28 };

export const WEEKEND_RULES = Object.freeze({
  previous: 'previous',
  next: 'next',
  none: 'none',
});

/**
 * Move a weekend payday to an adjacent weekday.
 *
 * Returns a NEW date and never mutates the input. That matters more than it looks: the caller
 * must keep stepping the schedule from the *unadjusted* base date. Adjusting in place makes each
 * shift compound, and the schedule drifts further out with every period.
 */
export function adjustForWeekend(date, rule = WEEKEND_RULES.previous) {
  const day = date.getDay(); // 0 Sun … 6 Sat
  const isWeekend = day === 0 || day === 6;

  if (!isWeekend || rule === WEEKEND_RULES.none) {
    return { date: new Date(date), moved: false };
  }

  const out = new Date(date);
  if (rule === WEEKEND_RULES.previous) {
    out.setDate(out.getDate() - (day === 6 ? 1 : 2)); // Sat -> Fri, Sun -> Fri
  } else {
    out.setDate(out.getDate() + (day === 6 ? 2 : 1)); // Sat -> Mon, Sun -> Mon
  }
  return { date: out, moved: true };
}

/**
 * Add whole months, clamping to the last valid day (spec §5 monthly rule).
 *
 * `new Date(2026, 0, 31)` + 1 month overflows into 3 March, which would silently invent a payday.
 * A 31st-of-the-month payroll pays on 28/29 February instead.
 */
export function addMonthsClamped(date, months) {
  const targetDay = date.getDate();
  const out = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDayOfTargetMonth = new Date(out.getFullYear(), out.getMonth() + 1, 0).getDate();
  out.setDate(Math.min(targetDay, lastDayOfTargetMonth));
  out.setHours(12, 0, 0, 0);
  return out;
}

/** Unadjusted base date for period `i` of the schedule. */
function baseDateFor(start, frequency, i) {
  if (frequency === 'monthly') return addMonthsClamped(start, i);

  const step = STEP_DAYS[frequency];
  if (!step) throw new RangeError(`pay-schedule: unsupported frequency "${frequency}"`);

  const out = new Date(start);
  out.setDate(out.getDate() + step * i);
  out.setHours(12, 0, 0, 0);
  return out;
}

/**
 * @param {object} options
 * @param {Date|string} options.firstPayDate
 * @param {string} options.frequency  weekly | biweekly | fourWeekly | monthly
 * @param {number} options.annualGross
 * @param {number} options.annualNet
 * @param {Array<{id:string,label:string,annualAmount:number}>} [options.deductions]
 * @param {number} [options.periods=12]  how many paydays to generate
 * @param {string} [options.weekendRule]
 * @param {number|null} [options.bonusMonthIndex]  0-11, or null for no bonus
 * @param {number} [options.bonusGross=0]
 * @param {number} [options.bonusNet=0]
 */
export function generatePaySchedule({
  firstPayDate,
  frequency,
  annualGross,
  annualNet,
  deductions = [],
  periods = 12,
  weekendRule = WEEKEND_RULES.previous,
  bonusMonthIndex = null,
  bonusGross = 0,
  bonusNet = 0,
}) {
  const periodsPerYear = PERIODS_PER_YEAR[frequency];
  if (!periodsPerYear) {
    throw new RangeError(`pay-schedule: unsupported frequency "${frequency}"`);
  }

  const start = firstPayDate instanceof Date ? new Date(firstPayDate) : new Date(firstPayDate);
  if (Number.isNaN(start.getTime())) {
    throw new RangeError('pay-schedule: `firstPayDate` is not a valid date');
  }
  start.setHours(12, 0, 0, 0);

  // The bonus is NOT smeared across every period. It lands on one payday, which is what a real
  // payslip looks like and what most competing calculators get wrong.
  const perPeriodGross = annualGross / periodsPerYear;
  const perPeriodNet = annualNet / periodsPerYear;
  const perPeriodDeductions = deductions.map((d) => ({
    id: d.id,
    label: d.label,
    amount: d.annualAmount / periodsPerYear,
  }));

  const rows = [];
  let bonusApplied = false;

  for (let i = 0; i < periods; i += 1) {
    const { date, moved } = adjustForWeekend(baseDateFor(start, frequency, i), weekendRule);

    // Match on the ADJUSTED date: a payday shifted from Sun 1 Mar back to Fri 27 Feb genuinely
    // pays in February, and that is the month the user will see on their statement.
    const isBonusPeriod =
      bonusMonthIndex !== null && !bonusApplied && date.getMonth() === bonusMonthIndex;
    if (isBonusPeriod) bonusApplied = true;

    rows.push({
      index: i + 1,
      date,
      movedOffWeekend: moved,
      isBonusPeriod,
      gross: perPeriodGross + (isBonusPeriod ? bonusGross : 0),
      net: perPeriodNet + (isBonusPeriod ? bonusNet : 0),
      deductions: perPeriodDeductions.map((d) => ({ ...d })),
    });
  }

  return {
    frequency,
    periodsPerYear,
    weekendRule,
    firstPayDate: rows[0]?.date ?? start,
    rows,
    totals: {
      gross: annualGross + bonusGross,
      net: annualNet + bonusNet,
      deductions: deductions.map((d) => ({ ...d })),
    },
  };
}
