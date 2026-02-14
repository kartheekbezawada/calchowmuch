import { describe, expect, it } from 'vitest';

import { calculatePercentageDecrease } from '../../../public/assets/js/core/math.js';

describe('calculatePercentageDecrease', () => {
  it('standard decrease: 200 to 150 → 25% decrease', () => {
    const result = calculatePercentageDecrease(200, 150);
    expect(result.originalValue).toBe(200);
    expect(result.newValue).toBe(150);
    expect(result.decreaseAmount).toBe(50);
    expect(result.percentDecrease).toBe(25);
  });

  it('0% decrease: same value → 0%', () => {
    const result = calculatePercentageDecrease(100, 100);
    expect(result.decreaseAmount).toBe(0);
    expect(result.percentDecrease).toBe(0);
  });

  it('100% decrease: value drops to 0', () => {
    const result = calculatePercentageDecrease(50, 0);
    expect(result.decreaseAmount).toBe(50);
    expect(result.percentDecrease).toBe(100);
  });

  it('more than 100% decrease: new value is negative', () => {
    const result = calculatePercentageDecrease(100, -50);
    expect(result.decreaseAmount).toBe(150);
    expect(result.percentDecrease).toBe(150);
  });

  it('Y > X: negative result indicates increase', () => {
    const result = calculatePercentageDecrease(100, 120);
    expect(result.decreaseAmount).toBe(-20);
    expect(result.percentDecrease).toBe(-20);
  });

  it('decimal values: 200 to 175 → 12.5%', () => {
    const result = calculatePercentageDecrease(200, 175);
    expect(result.decreaseAmount).toBe(25);
    expect(result.percentDecrease).toBe(12.5);
  });

  it('small decimal values: 0.8 to 0.6 → 25%', () => {
    const result = calculatePercentageDecrease(0.8, 0.6);
    expect(result.decreaseAmount).toBeCloseTo(0.2);
    expect(result.percentDecrease).toBeCloseTo(25);
  });

  it('large values: 1000000 to 750000 → 25%', () => {
    const result = calculatePercentageDecrease(1000000, 750000);
    expect(result.decreaseAmount).toBe(250000);
    expect(result.percentDecrease).toBe(25);
  });

  it('X = 0: returns null (divide by zero)', () => {
    const result = calculatePercentageDecrease(0, 50);
    expect(result).toBeNull();
  });

  it('both zero: returns null', () => {
    const result = calculatePercentageDecrease(0, 0);
    expect(result).toBeNull();
  });

  it('negative original value: -100 to -150 → 50% decrease', () => {
    const result = calculatePercentageDecrease(-100, -150);
    expect(result.decreaseAmount).toBe(50);
    expect(result.percentDecrease).toBe(-50);
  });

  it('string inputs that parse to numbers', () => {
    const result = calculatePercentageDecrease('200', '150');
    expect(result.originalValue).toBe(200);
    expect(result.newValue).toBe(150);
    expect(result.percentDecrease).toBe(25);
  });

  it('invalid input: non-numeric original → null', () => {
    expect(calculatePercentageDecrease('abc', 100)).toBeNull();
  });

  it('invalid input: non-numeric new value → null', () => {
    expect(calculatePercentageDecrease(100, 'xyz')).toBeNull();
  });

  it('invalid input: NaN → null', () => {
    expect(calculatePercentageDecrease(NaN, 100)).toBeNull();
  });

  it('invalid input: undefined → null', () => {
    expect(calculatePercentageDecrease(undefined, 100)).toBeNull();
  });
});
