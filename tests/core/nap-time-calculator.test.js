import { describe, it, expect } from 'vitest';
import {
  calculateWakeTime,
  parseTimeString,
  getNapType,
  DEFAULT_NAP_TYPE,
} from '../../public/assets/js/core/nap-utils.js';

describe('Nap Time Calculator - NAP-TEST-U-1: nap type defaults', () => {
  it('should fall back to the default nap type', () => {
    const fallback = getNapType(DEFAULT_NAP_TYPE);
    expect(getNapType('unknown')).toEqual(fallback);
  });
});

describe('Nap Time Calculator - NAP-TEST-U-2: time parsing', () => {
  it('should parse valid time strings', () => {
    expect(parseTimeString('07:30')).toEqual({ hours: 7, minutes: 30 });
  });

  it('should reject invalid time strings', () => {
    expect(parseTimeString('')).toBeNull();
    expect(parseTimeString('25:00')).toBeNull();
    expect(parseTimeString('12:99')).toBeNull();
  });
});

describe('Nap Time Calculator - NAP-TEST-U-3: wake time calculation', () => {
  it('should calculate wake time without rollover', () => {
    const wakeTime = calculateWakeTime({ hours: 13, minutes: 0 }, 20, 0);
    expect(wakeTime).toEqual({ hours: 13, minutes: 20 });
  });

  it('should handle midnight rollover correctly', () => {
    const wakeTime = calculateWakeTime({ hours: 23, minutes: 50 }, 30, 5);
    expect(wakeTime).toEqual({ hours: 0, minutes: 25 });
  });
});
