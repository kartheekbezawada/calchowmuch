import { describe, expect, it } from 'vitest';
import {
  calculateBirthdayWeekdays,
  calculateDaysUntil,
  getWeekdayName,
} from '../../../public/assets/js/core/date-diff-utils.js';
import {
  buildBirthdaySummary,
  buildBirthdayViewModel,
  buildRecurrenceStrip,
  extractWeekendHighlights,
  getNextBirthdaySnapshot,
} from '../../../public/calculators/time-and-date/birthday-day-of-week/engine.js';

describe('Birthday Day-of-Week Calculator core weekday logic', () => {
  it('should calculate birth weekday and target-year weekday', () => {
    const birthDate = new Date(2000, 0, 1);
    const result = calculateBirthdayWeekdays(birthDate, 2025);
    expect(result?.birthWeekday).toBe('Saturday');
    expect(result?.targetWeekday).toBe(getWeekdayName(new Date(2025, 0, 1)));
  });

  it('should treat Feb 29 as Feb 28 in non-leap target years', () => {
    const birthDate = new Date(2000, 1, 29);
    const result = calculateBirthdayWeekdays(birthDate, 2021);
    expect(result).not.toBeNull();
    expect(result?.targetDate.getDate()).toBe(28);
    expect(result?.targetWeekday).toBe(getWeekdayName(new Date(2021, 1, 28)));
  });

  it('should return null for invalid target years', () => {
    const birthDate = new Date(2000, 0, 1);
    expect(calculateBirthdayWeekdays(birthDate, 2025.5)).toBeNull();
  });

  it('should return null for invalid dates', () => {
    const invalid = new Date('invalid');
    expect(calculateBirthdayWeekdays(invalid, 2025)).toBeNull();
  });
});

describe('Birthday Day-of-Week route engine', () => {
  it('calculates the next birthday when the date is still ahead this year', () => {
    const birthDate = new Date(1990, 5, 15);
    const referenceDate = new Date(2026, 2, 13);
    const nextBirthday = getNextBirthdaySnapshot(birthDate, referenceDate);

    expect(nextBirthday).toEqual({
      date: new Date(2026, 5, 15),
      year: 2026,
      weekday: getWeekdayName(new Date(2026, 5, 15)),
      daysRemaining: calculateDaysUntil(new Date(2026, 5, 15), referenceDate),
      ageTurning: 36,
      usesLeapDayFallback: false,
    });
  });

  it('calculates the next birthday in the following year when this year has passed', () => {
    const birthDate = new Date(1990, 5, 15);
    const referenceDate = new Date(2026, 5, 16);
    const nextBirthday = getNextBirthdaySnapshot(birthDate, referenceDate);

    expect(nextBirthday?.year).toBe(2027);
    expect(nextBirthday?.ageTurning).toBe(37);
    expect(nextBirthday?.daysRemaining).toBe(calculateDaysUntil(new Date(2027, 5, 15), referenceDate));
  });

  it('builds a 12-year recurrence strip with the expected year range', () => {
    const recurrence = buildRecurrenceStrip(new Date(1990, 5, 15), 2026, 12, new Date(2026, 2, 13));

    expect(recurrence).toHaveLength(12);
    expect(recurrence[0]?.year).toBe(2026);
    expect(recurrence[11]?.year).toBe(2037);
    expect(recurrence[0]?.ageTurning).toBe(36);
  });

  it('extracts the next Friday, Saturday, and Sunday highlights from a recurrence list', () => {
    const highlights = extractWeekendHighlights([
      {
        year: 2026,
        date: new Date(2026, 0, 3),
        weekday: 'Saturday',
        daysUntil: 5,
        ageTurning: 26,
      },
      {
        year: 2026,
        date: new Date(2026, 0, 4),
        weekday: 'Sunday',
        daysUntil: 6,
        ageTurning: 26,
      },
      {
        year: 2027,
        date: new Date(2027, 0, 8),
        weekday: 'Friday',
        daysUntil: 375,
        ageTurning: 27,
      },
      {
        year: 2028,
        date: new Date(2028, 0, 1),
        weekday: 'Saturday',
        daysUntil: 730,
        ageTurning: 28,
      },
    ]);

    expect(highlights).toHaveLength(3);
    expect(highlights[0]).toMatchObject({ weekday: 'Friday', entry: { year: 2027 } });
    expect(highlights[1]).toMatchObject({ weekday: 'Saturday', entry: { year: 2026 } });
    expect(highlights[2]).toMatchObject({ weekday: 'Sunday', entry: { year: 2026 } });
  });

  it('builds a planning summary with weekday and next-birthday details', () => {
    const summary = buildBirthdaySummary({
      birthDate: new Date(1990, 5, 15),
      birthWeekday: 'Friday',
      targetYear: 2025,
      targetWeekday: 'Sunday',
      nextBirthday: {
        date: new Date(2026, 5, 15),
        weekday: 'Monday',
        daysRemaining: 94,
        ageTurning: 36,
      },
      weekendHighlights: [{ weekday: 'Saturday', entry: { date: new Date(2028, 5, 15) } }],
    });

    expect(summary).toContain('June 15, 1990 was a Friday.');
    expect(summary).toContain('In 2025, your birthday falls on Sunday.');
    expect(summary).toContain('94 days away');
    expect(summary).toContain('Saturday');
  });

  it('builds a full birthday view model with summary and planning modules', () => {
    const viewModel = buildBirthdayViewModel(new Date(1990, 5, 15), 2025, new Date(2026, 2, 13));

    expect(viewModel?.birthWeekday).toBe('Friday');
    expect(viewModel?.targetWeekday).toBe('Sunday');
    expect(viewModel?.recurrence).toHaveLength(12);
    expect(viewModel?.weekendHighlights).toHaveLength(3);
    expect(viewModel?.summary).toContain('Your next birthday is');
  });
});
