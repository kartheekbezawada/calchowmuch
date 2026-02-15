import { describe, expect, it } from 'vitest';
import { calculatePercentToFractionDecimal } from '../../../public/assets/js/core/math.js';

describe('Percent to Fraction/Decimal - PTFD-TEST-U-1: core conversion', () => {
  it('converts 12.5% to 0.125 and 1/8', () => {
    const result = calculatePercentToFractionDecimal('12.5%');
    expect(result).not.toBeNull();
    expect(result.decimal).toBeCloseTo(0.125, 12);
    expect(result.fraction).toBe('1/8');
  });

  it('converts integer percent values', () => {
    const result = calculatePercentToFractionDecimal('25');
    expect(result).not.toBeNull();
    expect(result.decimal).toBeCloseTo(0.25, 12);
    expect(result.fraction).toBe('1/4');
  });
});

describe('Percent to Fraction/Decimal - PTFD-TEST-U-2: edge cases', () => {
  it('supports negative percentages', () => {
    const result = calculatePercentToFractionDecimal('-12.5');
    expect(result).not.toBeNull();
    expect(result.decimal).toBeCloseTo(-0.125, 12);
    expect(result.fraction).toBe('-1/8');
  });

  it('returns null on invalid input', () => {
    expect(calculatePercentToFractionDecimal('')).toBeNull();
    expect(calculatePercentToFractionDecimal('abc')).toBeNull();
    expect(calculatePercentToFractionDecimal('%')).toBeNull();
  });
});
