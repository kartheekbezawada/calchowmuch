import { describe, it, expect } from 'vitest';

import {
  WEEKEND_RULES,
  addMonthsClamped,
  adjustForWeekend,
  generatePaySchedule,
} from '../../../public/calculators/salary-calculators/shared/tax-engine/pay-schedule.js';
import { calculateGrossOnly } from '../../../public/calculators/salary-calculators/shared/tax-engine/gross-engine.js';

const at = (y, m, d) => new Date(y, m - 1, d, 12, 0, 0, 0);
const iso = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const money = (n) => Math.round(n * 100) / 100;

describe('adjustForWeekend', () => {
  it('leaves weekdays alone', () => {
    const wed = at(2026, 8, 26);
    expect(adjustForWeekend(wed, WEEKEND_RULES.previous).moved).toBe(false);
  });

  it('moves Saturday back one day and Sunday back two under `previous`', () => {
    expect(iso(adjustForWeekend(at(2026, 8, 29), WEEKEND_RULES.previous).date)).toBe('2026-08-28');
    expect(iso(adjustForWeekend(at(2026, 8, 30), WEEKEND_RULES.previous).date)).toBe('2026-08-28');
  });

  it('moves Saturday forward two days and Sunday forward one under `next`', () => {
    expect(iso(adjustForWeekend(at(2026, 8, 29), WEEKEND_RULES.next).date)).toBe('2026-08-31');
    expect(iso(adjustForWeekend(at(2026, 8, 30), WEEKEND_RULES.next).date)).toBe('2026-08-31');
  });

  it('never lands on a weekend after adjusting', () => {
    for (const rule of [WEEKEND_RULES.previous, WEEKEND_RULES.next]) {
      for (let day = 1; day <= 31; day += 1) {
        const { date } = adjustForWeekend(at(2026, 8, day), rule);
        expect([0, 6]).not.toContain(date.getDay());
      }
    }
  });

  it('leaves weekends untouched under `none`', () => {
    const sat = at(2026, 8, 29);
    expect(iso(adjustForWeekend(sat, WEEKEND_RULES.none).date)).toBe('2026-08-29');
  });

  it('does not mutate the input date', () => {
    const sat = at(2026, 8, 29);
    adjustForWeekend(sat, WEEKEND_RULES.previous);
    expect(iso(sat)).toBe('2026-08-29');
  });
});

describe('addMonthsClamped', () => {
  it('clamps a 31st to the last valid day of a shorter month', () => {
    // Naive date maths overflows 31 Jan + 1 month into 3 March, inventing a payday.
    expect(iso(addMonthsClamped(at(2026, 1, 31), 1))).toBe('2026-02-28');
    expect(iso(addMonthsClamped(at(2026, 1, 31), 3))).toBe('2026-04-30');
  });

  it('uses 29 February in a leap year', () => {
    expect(iso(addMonthsClamped(at(2024, 1, 31), 1))).toBe('2024-02-29');
  });

  it('keeps the day when the target month is long enough', () => {
    expect(iso(addMonthsClamped(at(2026, 1, 15), 1))).toBe('2026-02-15');
  });

  it('rolls the year over', () => {
    expect(iso(addMonthsClamped(at(2026, 11, 20), 3))).toBe('2027-02-20');
  });
});

describe('generatePaySchedule', () => {
  const base = {
    firstPayDate: at(2026, 9, 4), // a Friday
    annualGross: 60000,
    annualNet: 45357.4,
    deductions: [
      { id: 'tax', label: 'Income tax', annualAmount: 11432 },
      { id: 'ni', label: 'NI', annualAmount: 3210.6 },
    ],
  };

  it('generates the requested number of rows', () => {
    expect(generatePaySchedule({ ...base, frequency: 'monthly' }).rows).toHaveLength(12);
    expect(generatePaySchedule({ ...base, frequency: 'weekly', periods: 4 }).rows).toHaveLength(4);
  });

  it('divides pay by the correct period count, 4-weekly being 13 not 12', () => {
    const fourWeekly = generatePaySchedule({ ...base, frequency: 'fourWeekly' });
    expect(fourWeekly.periodsPerYear).toBe(13);
    expect(money(fourWeekly.rows[0].gross)).toBe(money(60000 / 13));
  });

  it('steps biweekly by exactly 14 days', () => {
    const rows = generatePaySchedule({ ...base, frequency: 'biweekly' }).rows;
    const gap = (rows[1].date - rows[0].date) / 86400000;
    expect(gap).toBe(14);
  });

  it('does NOT let weekend adjustment compound across periods', () => {
    // The trap this guards: if the adjusted date feeds the next period's base, each shift stacks
    // and the schedule drifts further out every month. Proven by generating the same schedule
    // with and without adjustment and comparing period-by-period — the shift must stay within a
    // single weekend (<= 2 days) at EVERY index, not just early ones.
    //
    // Anchored on Sat 29 Aug 2026 so weekends recur, and deliberately spanning Feb 2027, where
    // month-end clamping moves the base to the 28th before any weekend rule applies. Comparing
    // against a literal "day 29" would wrongly flag that as drift.
    const params = { ...base, firstPayDate: at(2026, 8, 29), frequency: 'monthly' };
    const unadjusted = generatePaySchedule({ ...params, weekendRule: WEEKEND_RULES.none }).rows;
    const adjusted = generatePaySchedule({ ...params, weekendRule: WEEKEND_RULES.previous }).rows;

    adjusted.forEach((row, i) => {
      const shiftDays = Math.round((row.date - unadjusted[i].date) / 86400000);
      expect(Math.abs(shiftDays)).toBeLessThanOrEqual(2);
      // `previous` may only move backwards.
      expect(shiftDays).toBeLessThanOrEqual(0);
      expect(row.movedOffWeekend).toBe(shiftDays !== 0);
    });

    // Unadjusted anchors keep their day-of-month, except where the month is too short.
    expect(unadjusted.map((r) => r.date.getDate())).toEqual([29, 29, 29, 29, 29, 29, 28, 29, 29, 29, 29, 29]);
  });

  it('puts the bonus on exactly one payday, not smeared across all of them', () => {
    const schedule = generatePaySchedule({
      ...base,
      frequency: 'monthly',
      bonusMonthIndex: 11, // December
      bonusGross: 10000,
      bonusNet: 5800,
    });
    const bonusRows = schedule.rows.filter((r) => r.isBonusPeriod);
    expect(bonusRows).toHaveLength(1);
    expect(bonusRows[0].date.getMonth()).toBe(11);
    expect(money(bonusRows[0].gross)).toBe(money(60000 / 12 + 10000));

    const normal = schedule.rows.find((r) => !r.isBonusPeriod);
    expect(money(normal.gross)).toBe(money(60000 / 12));
  });

  it('adds the bonus to the annual totals', () => {
    const schedule = generatePaySchedule({
      ...base,
      frequency: 'monthly',
      bonusMonthIndex: 11,
      bonusGross: 10000,
      bonusNet: 5800,
    });
    expect(schedule.totals.gross).toBe(70000);
    expect(money(schedule.totals.net)).toBe(money(45357.4 + 5800));
  });

  it('reconciles: per-period net times periods equals annual net', () => {
    const schedule = generatePaySchedule({ ...base, frequency: 'fourWeekly' });
    const summed = schedule.rows[0].net * schedule.periodsPerYear;
    expect(money(summed)).toBe(money(45357.4));
  });

  it('carries per-period deductions through', () => {
    const row = generatePaySchedule({ ...base, frequency: 'monthly' }).rows[0];
    expect(row.deductions).toHaveLength(2);
    expect(money(row.deductions[0].amount)).toBe(money(11432 / 12));
  });

  it('throws on an unsupported frequency instead of guessing', () => {
    expect(() => generatePaySchedule({ ...base, frequency: 'fortnightly' })).toThrow(RangeError);
  });

  it('throws on an invalid first pay date', () => {
    expect(() => generatePaySchedule({ ...base, firstPayDate: 'not-a-date', frequency: 'monthly' })).toThrow(RangeError);
  });
});

describe('calculateGrossOnly', () => {
  it('applies no tax at all — net equals gross', () => {
    const result = calculateGrossOnly({ amount: 60000, frequency: 'annual' });
    expect(result.netAnnual).toBe(60000);
    expect(result.totalDeductions).toBe(0);
    expect(result.effectiveRate).toBe(0);
  });

  it('returns the same shape as the UK engine so the UI needs no branching', () => {
    const result = calculateGrossOnly({ amount: 60000, frequency: 'annual' });
    for (const key of [
      'gross', 'netAnnual', 'totalDeductions', 'effectiveRate', 'marginalRate',
      'incomeTax', 'nationalInsurance', 'studentLoans',
    ]) {
      expect(result).toHaveProperty(key);
    }
    expect(result.incomeTax.breakdown).toEqual([]);
    expect(result.studentLoans.entries).toEqual([]);
  });

  it('annualises hourly pay using the supplied schedule', () => {
    const result = calculateGrossOnly({
      amount: 20,
      frequency: 'hourly',
      schedule: { hoursPerWeek: 37.5, weeksPerYear: 52 },
    });
    expect(result.gross).toBe(39000);
  });

  it('includes a bonus in gross', () => {
    const result = calculateGrossOnly({ amount: 60000, frequency: 'annual', bonus: 10000 });
    expect(result.gross).toBe(70000);
    expect(result.netAnnual).toBe(70000);
  });

  it('clamps negative input to zero rather than producing negative pay', () => {
    expect(calculateGrossOnly({ amount: -5000, frequency: 'annual' }).gross).toBe(0);
  });
});
