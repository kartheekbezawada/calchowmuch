import { describe, expect, it } from 'vitest';
import { calculatePercentageDifference } from '../../../public/assets/js/core/math.js';

describe('Percentage Difference Calculator - PDIFF-TEST-U-1: symmetric calculation', () => {
  it('calculates percent difference using average baseline', () => {
    const result = calculatePercentageDifference(80, 100);

    expect(result).not.toBeNull();
    expect(result.absoluteDifference).toBeCloseTo(20, 8);
    expect(result.averageBaseline).toBeCloseTo(90, 8);
    expect(result.percentDifference).toBeCloseTo(22.2222222, 6);
  });

  it('is symmetric when swapping A and B', () => {
    const ab = calculatePercentageDifference(80, 100);
    const ba = calculatePercentageDifference(100, 80);

    expect(ab).not.toBeNull();
    expect(ba).not.toBeNull();
    expect(ab.percentDifference).toBeCloseTo(ba.percentDifference, 10);
  });
});

describe('Percentage Difference Calculator - PDIFF-TEST-U-2: negative values', () => {
  it('supports negatives using absolute baseline values', () => {
    const result = calculatePercentageDifference(-10, 20);

    expect(result).not.toBeNull();
    expect(result.absoluteDifference).toBeCloseTo(30, 8);
    expect(result.averageBaseline).toBeCloseTo(15, 8);
    expect(result.percentDifference).toBeCloseTo(200, 8);
  });
});

describe('Percentage Difference Calculator - PDIFF-TEST-U-3: validation', () => {
  it('returns null when both values are 0 (divide-by-zero baseline)', () => {
    expect(calculatePercentageDifference(0, 0)).toBeNull();
  });

  it('returns null for invalid numeric inputs', () => {
    expect(calculatePercentageDifference(Number.NaN, 10)).toBeNull();
    expect(calculatePercentageDifference(10, Number.NaN)).toBeNull();
    expect(calculatePercentageDifference('abc', 10)).toBeNull();
  });
});
