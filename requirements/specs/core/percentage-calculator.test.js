import { describe, it, expect } from 'vitest';
import { percentOf, percentageChange } from '../../../public/assets/js/core/math.js';

function whatPercent(part, total) {
  if (total === 0) {
    return null;
  }
  return (part / total) * 100;
}

describe('percentage calculator formulas', () => {
  it('PERC-TEST-U-1: percent change 100 to 150 = 50%', () => {
    expect(percentageChange(100, 150)).toBe(50);
  });

  it('PERC-TEST-U-1: percent of 25% of 200 = 50', () => {
    expect(percentOf(25, 200)).toBe(50);
  });

  it('PERC-TEST-U-1: increase by 20% (100 -> 120)', () => {
    const base = 100;
    const result = base + percentOf(20, base);
    expect(result).toBe(120);
  });

  it('PERC-TEST-U-1: decrease by 20% (100 -> 80)', () => {
    const base = 100;
    const result = base - percentOf(20, base);
    expect(result).toBe(80);
  });

  it('PERC-TEST-U-1: what percent (25 of 100 = 25%)', () => {
    expect(whatPercent(25, 100)).toBe(25);
  });
});

describe('percentage calculator edge cases', () => {
  it('PERC-TEST-U-2: handles division by zero', () => {
    expect(percentageChange(0, 50)).toBeNull();
    expect(whatPercent(25, 0)).toBeNull();
  });

  it('PERC-TEST-U-2: handles negative percentages and values', () => {
    expect(percentOf(-25, 200)).toBe(-50);
    expect(percentageChange(100, 75)).toBe(-25);
    expect(whatPercent(-25, 100)).toBe(-25);
  });

  it('PERC-TEST-U-2: handles very large numbers', () => {
    const big = 999999999999999;
    expect(percentOf(25, big)).toBeCloseTo(big * 0.25);
  });

  it('PERC-TEST-U-2: handles very small decimal numbers', () => {
    expect(percentageChange(0.01, 0.011)).toBeCloseTo(10);
    expect(percentOf(0.5, 0.02)).toBeCloseTo(0.0001);
  });

  it('PERC-TEST-U-2: handles boundary percentage values', () => {
    expect(percentOf(0, 500)).toBe(0);
    expect(percentOf(100, 500)).toBe(500);
    expect(percentOf(-100, 500)).toBe(-500);
  });
});
