import { describe, expect, it } from 'vitest';
import {
  buildAgeViewModel,
  getNextBirthdayModel,
} from '../../../public/calculators/time-and-date/age-calculator/engine.js';

describe('Age Calculator - view model', () => {
  it('builds the hero age answer and total counts', () => {
    const result = buildAgeViewModel({
      birthDate: new Date(1990, 5, 15),
      asOfDate: new Date(2025, 8, 1),
    });

    expect(result).not.toBeNull();
    expect(result?.headline).toBe('35 years, 2 months, 17 days');
    expect(result?.bornWeekday).toBe('Friday');
    expect(result?.totals.months).toBe(422);
    expect(result?.totals.days).toBeGreaterThan(12000);
    expect(result?.nextBirthday?.headline).toContain('In ');
  });

  it('treats the anniversary date as birthday today', () => {
    const result = buildAgeViewModel({
      birthDate: new Date(2000, 0, 1),
      asOfDate: new Date(2001, 0, 1),
    });

    expect(result).not.toBeNull();
    expect(result?.headline).toBe('1 year, 0 months, 0 days');
    expect(result?.totals.months).toBe(12);
    expect(result?.totals.days).toBe(366);
    expect(result?.totals.weeks).toBeCloseTo(366 / 7, 5);
    expect(result?.nextBirthday?.headline).toBe('Birthday today');
    expect(result?.copySummary).toContain('As of Jan 1, 2001, exact age is 1 year, 0 months, 0 days.');
  });

  it('uses February 28 for next-birthday guidance on leap-day birthdays', () => {
    const result = buildAgeViewModel({
      birthDate: new Date(2000, 1, 29),
      asOfDate: new Date(2001, 1, 28),
    });

    expect(result).not.toBeNull();
    expect(result?.headline).toBe('1 year, 0 months, 0 days');
    expect(result?.nextBirthday?.headline).toBe('Birthday today');
    expect(result?.nextBirthday?.dateLabel).toBe('Feb 28, 2001');
  });

  it('returns null when the as-of date is before the birth date', () => {
    expect(
      buildAgeViewModel({
        birthDate: new Date(2025, 8, 1),
        asOfDate: new Date(2025, 7, 1),
      })
    ).toBeNull();
  });
});

describe('Age Calculator - next birthday helper', () => {
  it('calculates the next birthday countdown for standard birthdays', () => {
    const nextBirthday = getNextBirthdayModel(new Date(1990, 5, 15), new Date(2026, 2, 17), 35);

    expect(nextBirthday).not.toBeNull();
    expect(nextBirthday?.headline).toBe('In 90 days');
    expect(nextBirthday?.weekday).toBe('Monday');
    expect(nextBirthday?.detail).toContain('Turns 36 on Monday, Jun 15, 2026');
  });
});
