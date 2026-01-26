import { describe, it, expect } from 'vitest';
import {
  calculateCalendarDiff,
  calculateTimeBetweenDates,
} from '../../public/assets/js/core/date-diff-utils.js';

describe('Time Between Two Dates - Dates only mode', () => {
  it('should calculate day and week totals correctly', () => {
    const start = new Date(2026, 0, 1);
    const end = new Date(2026, 0, 31);
    const result = calculateTimeBetweenDates({ start, end, includeTime: false });

    expect(result.totalDays).toBe(30);
    expect(result.totalWeeks).toBeCloseTo(30 / 7, 5);
    expect(result.totalMonths).toBe(0);
  });

  it('should calculate calendar months and years correctly', () => {
    const start = new Date(2026, 0, 1);
    const end = new Date(2026, 1, 1);
    const result = calculateTimeBetweenDates({ start, end, includeTime: false });

    expect(result.totalMonths).toBe(1);
    expect(result.years).toBe(0);
    expect(result.months).toBe(1);
  });
});

describe('Time Between Two Dates - Date & time mode', () => {
  it('should calculate hours and minutes correctly', () => {
    const start = new Date(2026, 0, 1, 8, 0);
    const end = new Date(2026, 0, 2, 9, 30);
    const result = calculateTimeBetweenDates({ start, end, includeTime: true });

    expect(result.totalMinutes).toBe(1530);
    expect(result.totalHours).toBeCloseTo(25.5, 4);
    expect(result.totalDays).toBeCloseTo(25.5 / 24, 6);
  });

  it('should account for partial months based on time', () => {
    const start = new Date(2026, 0, 15, 12, 0);
    const end = new Date(2026, 1, 15, 11, 0);
    const calendar = calculateCalendarDiff(start, end);

    expect(calendar.totalMonths).toBe(0);
  });
});

describe('Time Between Two Dates - Validation', () => {
  it('should return null for invalid dates', () => {
    const invalid = new Date('invalid');
    expect(calculateTimeBetweenDates({ start: invalid, end: invalid, includeTime: false })).toBeNull();
  });
});
