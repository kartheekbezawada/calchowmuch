import { describe, it, expect } from 'vitest';
import { calculateEffectiveAnnualRate } from '../../../public/assets/js/core/time-value-utils.js';

describe('Effective Annual Rate Calculator - EAR-TEST-U-1: preset frequency', () => {
  it('should calculate EAR for monthly compounding', () => {
    const result = calculateEffectiveAnnualRate({
      nominalRate: 12,
      compounding: 'monthly',
    });

    expect(result).not.toBeNull();
    const expected = Math.pow(1 + 0.12 / 12, 12) - 1;
    expect(result.effectiveAnnualRate).toBeCloseTo(expected, 8);
    expect(result.periodsPerYear).toBe(12);
  });
});

describe('Effective Annual Rate Calculator - EAR-TEST-U-2: custom periods', () => {
  it('should calculate EAR with custom compounding periods', () => {
    const result = calculateEffectiveAnnualRate({
      nominalRate: 10,
      compounding: 'annual',
      customPeriods: 52,
    });

    expect(result).not.toBeNull();
    const expected = Math.pow(1 + 0.1 / 52, 52) - 1;
    expect(result.effectiveAnnualRate).toBeCloseTo(expected, 8);
    expect(result.periodsPerYear).toBe(52);
  });
});

describe('Effective Annual Rate Calculator - EAR-TEST-U-3: edge cases', () => {
  it('should return zero EAR for zero nominal rate', () => {
    const result = calculateEffectiveAnnualRate({
      nominalRate: 0,
      compounding: 'daily',
    });

    expect(result).not.toBeNull();
    expect(result.effectiveAnnualRate).toBeCloseTo(0, 8);
  });

  it('should return null for negative nominal rate', () => {
    const result = calculateEffectiveAnnualRate({
      nominalRate: -2,
      compounding: 'monthly',
    });

    expect(result).toBeNull();
  });

  it('should return null for invalid custom periods', () => {
    const result = calculateEffectiveAnnualRate({
      nominalRate: 8,
      compounding: 'monthly',
      customPeriods: 0,
    });

    expect(result).toBeNull();
  });
});
