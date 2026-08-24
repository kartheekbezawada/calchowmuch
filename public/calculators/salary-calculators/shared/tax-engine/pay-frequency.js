/**
 * Pay-frequency normalisation.
 *
 * Everything is normalised to an annual figure and converted back out from there. Chaining
 * conversions (monthly -> annual -> weekly -> hourly) accumulates error and, worse, invites the
 * 4-weekly mistake below.
 */

/**
 * Periods per year. `fourWeekly` is 13, and 4-weekly pay must be calculated as `annual / 13`.
 *
 * Tax-engine spec §47 calls this exact error out by name: computing 4-weekly as
 * `monthly * 12 / 13` is wrong. It is arithmetically close, which is what makes it dangerous —
 * it produces a plausible number that never quite reconciles against a real payslip, and it
 * misrepresents how the money actually arrives (13 payments of annual/13, not 12 monthly
 * payments redistributed).
 */
export const PERIODS_PER_YEAR = Object.freeze({
  annual: 1,
  monthly: 12,
  fourWeekly: 13,
  biweekly: 26,
  weekly: 52,
});

export const FREQUENCY_LABELS = Object.freeze({
  annual: 'Annual',
  monthly: 'Monthly',
  fourWeekly: '4-weekly',
  biweekly: 'Bi-weekly',
  weekly: 'Weekly',
  daily: 'Daily',
  hourly: 'Hourly',
});

export const DEFAULT_SCHEDULE = Object.freeze({
  hoursPerWeek: 40,
  weeksPerYear: 52,
  daysPerWeek: 5,
});

function resolveSchedule(schedule = {}) {
  const hoursPerWeek = positiveOr(schedule.hoursPerWeek, DEFAULT_SCHEDULE.hoursPerWeek);
  const weeksPerYear = positiveOr(schedule.weeksPerYear, DEFAULT_SCHEDULE.weeksPerYear);
  const daysPerWeek = positiveOr(schedule.daysPerWeek, DEFAULT_SCHEDULE.daysPerWeek);
  return { hoursPerWeek, weeksPerYear, daysPerWeek };
}

function positiveOr(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * Convert an amount at a given frequency into an annual figure.
 *
 * `daily` and `hourly` depend on the user's schedule, which is why they are not in
 * PERIODS_PER_YEAR — there is no fixed number of working hours in a year.
 */
export function toAnnual(amount, frequency, schedule) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return 0;

  const { hoursPerWeek, weeksPerYear, daysPerWeek } = resolveSchedule(schedule);

  if (frequency === 'hourly') return value * hoursPerWeek * weeksPerYear;
  if (frequency === 'daily') return value * daysPerWeek * weeksPerYear;

  const periods = PERIODS_PER_YEAR[frequency];
  if (!periods) {
    throw new RangeError(`toAnnual: unknown frequency "${frequency}"`);
  }
  return value * periods;
}

/** Convert an annual figure into every pay period at once. */
export function fromAnnual(annual, schedule) {
  const value = Number.isFinite(annual) ? annual : 0;
  const { hoursPerWeek, weeksPerYear, daysPerWeek } = resolveSchedule(schedule);

  return {
    annual: value,
    monthly: value / PERIODS_PER_YEAR.monthly,
    fourWeekly: value / PERIODS_PER_YEAR.fourWeekly,
    biweekly: value / PERIODS_PER_YEAR.biweekly,
    weekly: value / PERIODS_PER_YEAR.weekly,
    daily: value / weeksPerYear / daysPerWeek,
    hourly: value / weeksPerYear / hoursPerWeek,
  };
}

/** Periods per year for a frequency, including schedule-dependent ones. */
export function periodsPerYear(frequency, schedule) {
  const { hoursPerWeek, weeksPerYear, daysPerWeek } = resolveSchedule(schedule);
  if (frequency === 'hourly') return weeksPerYear * hoursPerWeek;
  if (frequency === 'daily') return weeksPerYear * daysPerWeek;
  return PERIODS_PER_YEAR[frequency] ?? 0;
}
