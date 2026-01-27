import { describe, it, expect } from 'vitest';
import {
  buildWeekCycle,
  buildWeekRangeLabel,
  calculateNightOvertime,
  formatDecimalHours,
  formatHHMM,
  formatDateShort,
  getNightOverlapMinutes,
  getSegmentMinutes,
  splitDailyOvertime,
  splitDailyWeeklyOvertime,
  splitWeeklyOvertime,
} from '../../public/assets/js/core/overtime-utils.js';

describe('Overtime Hours Calculator - OVERTIME-TEST-U-1: basic shifts', () => {
  it('should compute same-day shift with break', () => {
    const segment = getSegmentMinutes({ hours: 9, minutes: 0 }, { hours: 17, minutes: 0 }, false, 0);
    const totalMinutes = (segment?.minutes ?? 0) - 30;
    expect(formatHHMM(totalMinutes)).toBe('7:30');
    expect(formatDecimalHours(totalMinutes)).toBe('7.50');
  });

  it('should handle night shift rollover', () => {
    const segment = getSegmentMinutes({ hours: 22, minutes: 0 }, { hours: 6, minutes: 0 }, true, 0);
    expect(formatHHMM(segment?.minutes ?? 0)).toBe('8:00');
  });
});

describe('Overtime Hours Calculator - OVERTIME-TEST-U-2: overtime rules', () => {
  it('should calculate weekly overtime', () => {
    const weekly = splitWeeklyOvertime(44 * 60, 40 * 60);
    expect(formatHHMM(weekly.overtime)).toBe('4:00');
  });

  it('should calculate daily overtime', () => {
    const daily = splitDailyOvertime(10.5 * 60, 8 * 60);
    expect(formatHHMM(daily.overtime)).toBe('2:30');
  });

  it('should use max overtime for daily + weekly', () => {
    const split = splitDailyWeeklyOvertime(300, 200, 1000);
    expect(split.overtime).toBe(300);
    expect(split.regular).toBe(700);
  });
});

describe('Overtime Hours Calculator - OVERTIME-TEST-U-3: weekly cycle labels', () => {
  it('should build 7 day labels from Sunday start', () => {
    const startDate = new Date(2026, 1, 1);
    const cycle = buildWeekCycle(startDate, 0);
    expect(cycle).toHaveLength(7);
    expect(cycle[0].dayName).toBe('Sun');
    expect(formatDateShort(cycle[0].date)).toBe('Feb 1, 2026');
    expect(cycle[6].dayName).toBe('Sat');
    expect(formatDateShort(cycle[6].date)).toBe('Feb 7, 2026');
    expect(buildWeekRangeLabel(startDate, 0)).toBe('Sun Feb 1, 2026 → Sat Feb 7, 2026');
  });
});

describe('Overtime Hours Calculator - OVERTIME-TEST-U-4: night classification', () => {
  it('should compute night overlap and clamp night overtime', () => {
    const overlap = getNightOverlapMinutes(21 * 60, 23 * 60, 22 * 60, 6 * 60, true);
    expect(overlap).toBe(60);
    const nightOvertime = calculateNightOvertime(120, 60, 480);
    expect(nightOvertime).toBeLessThanOrEqual(60);
    expect(nightOvertime).toBeLessThanOrEqual(120);
  });
});
