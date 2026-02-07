import { describe, expect, it } from 'vitest';
import { percentageChange } from '../../public/assets/js/core/math.js';

describe('Percent Change Calculator - PCHG-TEST-U-1: increase/decrease/no-change', () => {
  it('returns positive percent for increase', () => {
    expect(percentageChange(50, 60)).toBeCloseTo(20, 8);
  });

  it('returns negative percent for decrease', () => {
    expect(percentageChange(100, 80)).toBeCloseTo(-20, 8);
  });

  it('returns zero when values are equal', () => {
    expect(percentageChange(100, 100)).toBeCloseTo(0, 8);
  });
});

describe('Percent Change Calculator - PCHG-TEST-U-2: validation and decimals', () => {
  it('returns null when original value is zero', () => {
    expect(percentageChange(0, 50)).toBeNull();
  });

  it('supports decimal and negative values', () => {
    expect(percentageChange(0.01, 0.011)).toBeCloseTo(10, 8);
    expect(percentageChange(-100, -80)).toBeCloseTo(-20, 8);
  });
});
