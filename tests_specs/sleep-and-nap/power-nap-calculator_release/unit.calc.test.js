import { describe, expect, it } from 'vitest';
import { calculateWakeTime, parseTimeString } from '../../../public/assets/js/core/nap-utils.js';

describe('Power Nap Calculator - POWER-NAP-TEST-U-1: time parsing', () => {
  it('parses valid time strings', () => {
    expect(parseTimeString('13:45')).toEqual({ hours: 13, minutes: 45 });
    expect(parseTimeString('00:05')).toEqual({ hours: 0, minutes: 5 });
  });

  it('rejects invalid time strings', () => {
    expect(parseTimeString('')).toBeNull();
    expect(parseTimeString('25:00')).toBeNull();
    expect(parseTimeString('09:75')).toBeNull();
  });
});

describe('Power Nap Calculator - POWER-NAP-TEST-U-2: wake time math', () => {
  it('calculates all fixed nap durations from a valid start time', () => {
    const startTime = { hours: 13, minutes: 0 };

    expect(calculateWakeTime(startTime, 10, 0)).toEqual({ hours: 13, minutes: 10 });
    expect(calculateWakeTime(startTime, 20, 0)).toEqual({ hours: 13, minutes: 20 });
    expect(calculateWakeTime(startTime, 30, 0)).toEqual({ hours: 13, minutes: 30 });
    expect(calculateWakeTime(startTime, 60, 0)).toEqual({ hours: 14, minutes: 0 });
    expect(calculateWakeTime(startTime, 90, 0)).toEqual({ hours: 14, minutes: 30 });
  });

  it('handles rollover across midnight', () => {
    const startTime = { hours: 23, minutes: 30 };

    expect(calculateWakeTime(startTime, 20, 0)).toEqual({ hours: 23, minutes: 50 });
    expect(calculateWakeTime(startTime, 90, 0)).toEqual({ hours: 1, minutes: 0 });
  });
});
