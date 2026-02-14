import { describe, it, expect } from 'vitest';
import {
  calculateSegmentMinutes,
  calculateTotalWithBreak,
  calculateWeeklyTotals,
  formatDecimalHours,
  formatHHMM,
  parseTimeString,
} from '../../public/assets/js/core/work-hours-utils.js';

describe('Work Hours Calculator - WORK-TEST-U-1: time parsing', () => {
  it('should parse valid time strings', () => {
    expect(parseTimeString('09:30')).toEqual({ hours: 9, minutes: 30 });
  });

  it('should reject invalid time strings', () => {
    expect(parseTimeString('')).toBeNull();
    expect(parseTimeString('24:00')).toBeNull();
    expect(parseTimeString('12:99')).toBeNull();
  });
});

describe('Work Hours Calculator - WORK-TEST-U-2: segment calculations', () => {
  it('should calculate segment minutes for normal shifts', () => {
    const minutes = calculateSegmentMinutes({ hours: 9, minutes: 0 }, { hours: 17, minutes: 30 }, false);
    expect(minutes).toBe(510);
  });

  it('should require next-day flag for overnight shifts', () => {
    const minutes = calculateSegmentMinutes({ hours: 22, minutes: 0 }, { hours: 6, minutes: 0 }, false);
    expect(minutes).toBeNull();
  });

  it('should handle overnight shifts when ends-next-day is checked', () => {
    const minutes = calculateSegmentMinutes({ hours: 22, minutes: 0 }, { hours: 6, minutes: 0 }, true);
    expect(minutes).toBe(480);
  });
});

describe('Work Hours Calculator - WORK-TEST-U-3: break deduction and totals', () => {
  it('should subtract break minutes from total', () => {
    const totals = calculateTotalWithBreak(
      [{ start: { hours: 9, minutes: 0 }, end: { hours: 17, minutes: 0 }, endsNextDay: false }],
      30
    );
    expect(totals?.totalMinutes).toBe(450);
  });

  it('should format HH:MM and decimal hours', () => {
    expect(formatHHMM(450)).toBe('7:30');
    expect(formatDecimalHours(450)).toBe('7.50');
  });
});

describe('Work Hours Calculator - WORK-TEST-U-4: weekly totals', () => {
  it('should calculate weekly totals and breaks', () => {
    const totals = calculateWeeklyTotals([
      {
        start: { hours: 9, minutes: 0 },
        end: { hours: 17, minutes: 0 },
        endsNextDay: false,
        breakMinutes: 30,
      },
      {
        start: { hours: 10, minutes: 0 },
        end: { hours: 14, minutes: 0 },
        endsNextDay: false,
        breakMinutes: 0,
      },
    ]);
    expect(totals?.totalMinutes).toBe(690);
    expect(totals?.totalBreakMinutes).toBe(30);
    expect(totals?.dailyMinutes).toEqual([450, 240]);
  });

  it('should reject breaks longer than worked minutes', () => {
    const totals = calculateWeeklyTotals([
      {
        start: { hours: 9, minutes: 0 },
        end: { hours: 9, minutes: 10 },
        endsNextDay: false,
        breakMinutes: 30,
      },
    ]);
    expect(totals).toBeNull();
  });
});
