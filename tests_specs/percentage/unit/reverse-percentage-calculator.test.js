import { describe, expect, it } from 'vitest';

import { calculateReversePercentage } from '../../../public/assets/js/core/math.js';

describe('calculateReversePercentage', () => {
  it('standard: 60 is 20% of 300', () => {
    const result = calculateReversePercentage(20, 60);
    expect(result.percentage).toBe(20);
    expect(result.finalValue).toBe(60);
    expect(result.original).toBe(300);
  });

  it('100%: original equals final value', () => {
    const result = calculateReversePercentage(100, 250);
    expect(result.original).toBe(250);
  });

  it('50%: original is double the final value', () => {
    const result = calculateReversePercentage(50, 75);
    expect(result.original).toBe(150);
  });

  it('percentage > 100%: original is less than final value', () => {
    const result = calculateReversePercentage(200, 80);
    expect(result.original).toBe(40);
  });

  it('decimal percentage: 12.5% of original', () => {
    const result = calculateReversePercentage(12.5, 25);
    expect(result.original).toBe(200);
  });

  it('small percentage: 1% of original', () => {
    const result = calculateReversePercentage(1, 5);
    expect(result.original).toBe(500);
  });

  it('final value is 0: original is 0', () => {
    const result = calculateReversePercentage(25, 0);
    expect(result.original).toBe(0);
  });

  it('negative final value: negative original', () => {
    const result = calculateReversePercentage(20, -60);
    expect(result.original).toBe(-300);
  });

  it('negative percentage: negative original', () => {
    const result = calculateReversePercentage(-20, 60);
    expect(result.original).toBe(-300);
  });

  it('large values: 10% of 1000000', () => {
    const result = calculateReversePercentage(10, 1000000);
    expect(result.original).toBe(10000000);
  });

  it('percentage is 0: returns null (division by zero)', () => {
    const result = calculateReversePercentage(0, 60);
    expect(result).toBeNull();
  });

  it('both zero: returns null', () => {
    const result = calculateReversePercentage(0, 0);
    expect(result).toBeNull();
  });

  it('string inputs that parse to numbers', () => {
    const result = calculateReversePercentage('20', '60');
    expect(result.percentage).toBe(20);
    expect(result.finalValue).toBe(60);
    expect(result.original).toBe(300);
  });

  it('invalid input: non-numeric percentage → null', () => {
    expect(calculateReversePercentage('abc', 60)).toBeNull();
  });

  it('invalid input: non-numeric final value → null', () => {
    expect(calculateReversePercentage(20, 'xyz')).toBeNull();
  });

  it('invalid input: NaN → null', () => {
    expect(calculateReversePercentage(NaN, 60)).toBeNull();
  });

  it('invalid input: undefined → null', () => {
    expect(calculateReversePercentage(undefined, 60)).toBeNull();
  });

  it('invalid input: Infinity → null', () => {
    expect(calculateReversePercentage(Infinity, 60)).toBeNull();
  });
});
