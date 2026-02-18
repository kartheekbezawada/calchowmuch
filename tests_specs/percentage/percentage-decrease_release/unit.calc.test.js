import { describe, expect, it } from 'vitest';
import { calculatePercentageDecrease } from '../../../public/assets/js/core/math.js';

describe('Percentage Decrease Calculator - PDEC-TEST-U-1: core formula', () => {
  it('standard decrease: 200 to 150 => 25%', () => {
    const result = calculatePercentageDecrease(200, 150);
    expect(result).not.toBeNull();
    expect(result.decreaseAmount).toBeCloseTo(50, 8);
    expect(result.percentDecrease).toBeCloseTo(25, 8);
  });

  it('supports decimal values and exact halves', () => {
    const result = calculatePercentageDecrease(200, 175);
    expect(result).not.toBeNull();
    expect(result.decreaseAmount).toBeCloseTo(25, 8);
    expect(result.percentDecrease).toBeCloseTo(12.5, 8);
  });
});

describe('Percentage Decrease Calculator - PDEC-TEST-U-2: direction and edge cases', () => {
  it('returns negative percent when new value is larger (increase case)', () => {
    const result = calculatePercentageDecrease(100, 120);
    expect(result).not.toBeNull();
    expect(result.percentDecrease).toBeCloseTo(-20, 8);
  });

  it('returns null when original value is zero', () => {
    expect(calculatePercentageDecrease(0, 50)).toBeNull();
  });

  it('returns null for invalid numeric inputs', () => {
    expect(calculatePercentageDecrease(Number.NaN, 50)).toBeNull();
    expect(calculatePercentageDecrease(100, Number.NaN)).toBeNull();
  });

  it('supports large values deterministically', () => {
    const result = calculatePercentageDecrease(1000000, 750000);
    expect(result).not.toBeNull();
    expect(result.percentDecrease).toBeCloseTo(25, 8);
  });
});
