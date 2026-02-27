import { describe, expect, it } from 'vitest';
import { calculateSlopeDistance } from '../../../public/assets/js/core/algebra.js';

describe('math/slope-distance unit', () => {
  it('computes slope, distance, and midpoint for diagonal line', () => {
    const result = calculateSlopeDistance(1, 2, 4, 8);
    expect(result.slope).toBeCloseTo(2, 8);
    expect(result.distance).toBeCloseTo(Math.sqrt(45), 8);
    expect(result.midpoint.x).toBeCloseTo(2.5, 8);
    expect(result.midpoint.y).toBeCloseTo(5, 8);
  });

  it('returns undefined slope for vertical line', () => {
    const result = calculateSlopeDistance(3, 1, 3, 10);
    expect(result.slope).toBeNull();
    expect(result.distance).toBeCloseTo(9, 8);
  });

  it('returns zero slope for horizontal line', () => {
    const result = calculateSlopeDistance(-2, 5, 6, 5);
    expect(result.slope).toBe(0);
    expect(result.distance).toBeCloseTo(8, 8);
    expect(result.midpoint.x).toBeCloseTo(2, 8);
    expect(result.midpoint.y).toBeCloseTo(5, 8);
  });
});
