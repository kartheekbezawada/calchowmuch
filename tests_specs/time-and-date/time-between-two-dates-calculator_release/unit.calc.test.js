import { describe, expect, it } from 'vitest';
import {
  buildPresetRange,
  calculateDateDiffViewModel,
} from '../../../public/calculators/time-and-date/time-between-two-dates-calculator/engine.js';

describe('Time Between Two Dates - date mode', () => {
  it('calculates calendar and elapsed totals for date-only ranges', () => {
    const result = calculateDateDiffViewModel({
      start: new Date(2026, 0, 1),
      end: new Date(2026, 1, 1),
      mode: 'date',
      includeEndDate: false,
    });

    expect(result).not.toBeNull();
    expect(result?.headline).toBe('1 month');
    expect(result?.elapsed.totalDays).toBe(31);
    expect(result?.calendar.totalMonths).toBe(1);
    expect(result?.counts.businessDays).toBeGreaterThan(20);
  });

  it('includes the end date in planning counts when requested', () => {
    const result = calculateDateDiffViewModel({
      start: new Date(2026, 0, 5),
      end: new Date(2026, 0, 5),
      mode: 'date',
      includeEndDate: true,
    });

    expect(result).not.toBeNull();
    expect(result?.elapsed.totalDays).toBe(1);
    expect(result?.counts.inclusiveDayCount).toBe(1);
    expect(result?.counts.businessDays).toBe(1);
  });
});

describe('Time Between Two Dates - date & time mode', () => {
  it('calculates elapsed hours and minutes', () => {
    const result = calculateDateDiffViewModel({
      start: new Date(2026, 0, 1, 8, 0),
      end: new Date(2026, 0, 2, 9, 30),
      mode: 'datetime',
      includeEndDate: false,
    });

    expect(result).not.toBeNull();
    expect(result?.headline).toBe('1 day, 1 hour, 30 minutes');
    expect(result?.elapsed.totalMinutes).toBe(1530);
    expect(result?.elapsed.totalHours).toBeCloseTo(25.5, 5);
    expect(result?.calendar.days).toBe(1);
    expect(result?.calendar.hours).toBe(1);
    expect(result?.calendar.minutes).toBe(30);
  });
});

describe('Time Between Two Dates - reverse ranges and summaries', () => {
  it('supports reversed ranges without returning null', () => {
    const result = calculateDateDiffViewModel({
      start: new Date(2026, 0, 10),
      end: new Date(2026, 0, 1),
      mode: 'date',
      includeEndDate: false,
    });

    expect(result).not.toBeNull();
    expect(result?.directionLabel).toBe('Past interval');
    expect(result?.elapsed.totalDays).toBe(9);
    expect(result?.copySummary).toContain('From Jan 10, 2026 to Jan 1, 2026');
  });
});

describe('Time Between Two Dates - presets and validation', () => {
  it('builds the this-month preset with inclusive counting', () => {
    const preset = buildPresetRange('this-month', new Date(2026, 2, 16, 9, 30));

    expect(preset).not.toBeNull();
    expect(preset?.includeEndDate).toBe(true);
    expect(preset?.start.getDate()).toBe(1);
    expect(preset?.end.getDate()).toBe(31);
  });

  it('returns null for invalid dates', () => {
    const invalid = new Date('invalid');
    expect(
      calculateDateDiffViewModel({
        start: invalid,
        end: invalid,
        mode: 'date',
        includeEndDate: false,
      })
    ).toBeNull();
  });
});
