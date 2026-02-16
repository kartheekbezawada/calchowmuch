import { describe, expect, it } from 'vitest';
import { calculatePercentageOfNumber } from '../../../public/assets/js/core/math.js';

describe('Find Percentage of a Number - PON-TEST-U-1: core formula', () => {
  it('calculates 20% of 50 as 10', () => {
    const result = calculatePercentageOfNumber(20, 50);
    expect(result).not.toBeNull();
    expect(result.result).toBeCloseTo(10, 10);
  });

  it('supports decimal percentage and decimal base value', () => {
    const result = calculatePercentageOfNumber(12.5, 80.4);
    expect(result).not.toBeNull();
    expect(result.result).toBeCloseTo(10.05, 10);
  });
});

describe('Find Percentage of a Number - PON-TEST-U-2: edge cases', () => {
  it('supports zero and negatives', () => {
    expect(calculatePercentageOfNumber(0, 500)?.result).toBeCloseTo(0, 10);
    expect(calculatePercentageOfNumber(-10, 200)?.result).toBeCloseTo(-20, 10);
    expect(calculatePercentageOfNumber(10, -200)?.result).toBeCloseTo(-20, 10);
  });

  it('returns null for invalid inputs', () => {
    expect(calculatePercentageOfNumber('x', 100)).toBeNull();
    expect(calculatePercentageOfNumber(10, Number.NaN)).toBeNull();
  });
});
