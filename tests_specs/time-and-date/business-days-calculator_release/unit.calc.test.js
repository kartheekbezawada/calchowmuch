import { describe, expect, it } from 'vitest';
import {
  buildBusinessDaysViewModel,
  countBusinessDaysBetween,
  shiftBusinessDays,
} from '../../../public/calculators/time-and-date/business-days-calculator/engine.js';

describe('business-days-calculator count mode', () => {
  it('counts a standard Monday to Friday span inclusively', () => {
    const result = countBusinessDaysBetween(new Date(2026, 3, 6), new Date(2026, 3, 10), {
      workweek: [1, 2, 3, 4, 5],
      holidayPreset: 'none',
    });

    expect(result?.businessDays).toBe(5);
    expect(result?.totalDays).toBe(5);
    expect(result?.nonBusinessDays).toBe(0);
  });

  it('skips US observed holidays when they land on a weekday', () => {
    const result = countBusinessDaysBetween(new Date(2026, 6, 2), new Date(2026, 6, 6), {
      workweek: [1, 2, 3, 4, 5],
      holidayPreset: 'us',
    });

    expect(result?.businessDays).toBe(2);
    expect(result?.holidayHits).toBe(1);
  });

  it('supports custom workweeks', () => {
    const result = countBusinessDaysBetween(new Date(2026, 3, 10), new Date(2026, 3, 14), {
      workweek: [0, 1, 2, 3, 4],
      holidayPreset: 'none',
    });

    expect(result?.businessDays).toBe(3);
  });
});

describe('business-days-calculator shift mode', () => {
  it('moves forward by business days across a weekend', () => {
    const result = shiftBusinessDays(new Date(2026, 3, 10), 3, {
      workweek: [1, 2, 3, 4, 5],
      holidayPreset: 'none',
    });

    expect(result?.end.getDay()).toBe(3);
    expect(result?.calendarDays).toBe(5);
  });

  it('moves backward by business days across a UK observed holiday', () => {
    const result = shiftBusinessDays(new Date(2026, 11, 29), -2, {
      workweek: [1, 2, 3, 4, 5],
      holidayPreset: 'uk',
    });

    expect(result?.end.getDate()).toBe(23);
  });
});

describe('business-days-calculator view model', () => {
  it('builds the count-mode summary and cards', () => {
    const result = buildBusinessDaysViewModel({
      mode: 'between',
      startDate: new Date(2026, 3, 6),
      endDate: new Date(2026, 3, 17),
      workweek: [1, 2, 3, 4, 5],
      holidayPreset: 'none',
    });

    expect(result?.headline).toContain('business days');
    expect(result?.cards).toHaveLength(3);
    expect(result?.copySummary).toContain('Business Days Calculator');
  });
});
