import { describe, it, expect } from 'vitest';
import {
  calculateWakeUpRecommendations,
  roundToNextQuarterHour,
  SLEEP_CYCLES,
  CYCLE_MINUTES,
  FALL_ASLEEP_MINUTES,
} from '../../public/assets/js/core/sleep-utils.js';

describe('Wake-Up Time Calculator - WAKEUP-TEST-U-1: Calculation Logic', () => {
  it('should calculate wake times for fall-asleep mode (11:30 PM)', () => {
    const sleepTime = new Date(2026, 0, 2, 23, 30);
    const recommendations = calculateWakeUpRecommendations({ mode: 'sleep', date: sleepTime });

    expect(recommendations.map((rec) => rec.cycles)).toEqual(SLEEP_CYCLES);
    recommendations.forEach((rec) => {
      const diffMinutes = (rec.wakeTime.getTime() - sleepTime.getTime()) / 60000;
      expect(diffMinutes).toBe(rec.cycles * CYCLE_MINUTES);
    });
  });

  it('should calculate wake times for go-to-bed mode (11:30 PM + 15 minutes)', () => {
    const bedTime = new Date(2026, 0, 2, 23, 30);
    const recommendations = calculateWakeUpRecommendations({
      mode: 'bed',
      date: bedTime,
      latencyMinutes: FALL_ASLEEP_MINUTES,
    });

    expect(recommendations.map((rec) => rec.cycles)).toEqual(SLEEP_CYCLES);
    recommendations.forEach((rec) => {
      const diffMinutes = (rec.wakeTime.getTime() - bedTime.getTime()) / 60000;
      expect(diffMinutes).toBe(rec.cycles * CYCLE_MINUTES + FALL_ASLEEP_MINUTES);
    });
  });

  it('should support custom latency values', () => {
    const bedTime = new Date(2026, 0, 2, 23, 30);
    const recommendations = calculateWakeUpRecommendations({
      mode: 'bed',
      date: bedTime,
      latencyMinutes: 30,
    });

    recommendations.forEach((rec) => {
      const diffMinutes = (rec.wakeTime.getTime() - bedTime.getTime()) / 60000;
      expect(diffMinutes).toBe(rec.cycles * CYCLE_MINUTES + 30);
    });
  });

  it('should return empty recommendations for invalid dates', () => {
    const invalid = new Date('invalid');
    expect(calculateWakeUpRecommendations({ mode: 'sleep', date: invalid })).toEqual([]);
  });
});

describe('Wake-Up Time Calculator - WAKEUP-TEST-U-2: Defaults and Rounding', () => {
  it('should round to the next 15-minute increment', () => {
    const date = new Date(2026, 0, 2, 10, 7);
    const rounded = roundToNextQuarterHour(date);
    expect(rounded.getMinutes()).toBe(15);
  });

  it('should keep exact quarter-hour times unchanged', () => {
    const date = new Date(2026, 0, 2, 10, 30);
    const rounded = roundToNextQuarterHour(date);
    expect(rounded.getMinutes()).toBe(30);
  });
});
