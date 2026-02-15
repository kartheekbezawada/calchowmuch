import { describe, expect, it } from 'vitest';
import { calculateSimpleInterest } from '../../../public/assets/js/core/time-value-utils.js';

describe('Simple Interest Calculator - SI-TEST-U-1: yearly basis', () => {
  it('calculates simple interest using yearly rate and years', () => {
    const result = calculateSimpleInterest({
      principal: 10000,
      rate: 6,
      timePeriod: 3,
      timeUnit: 'years',
      interestBasis: 'per-year',
    });

    expect(result).not.toBeNull();
    expect(result.totalInterest).toBeCloseTo(1800, 8);
    expect(result.endingAmount).toBeCloseTo(11800, 8);
    expect(result.years).toBeCloseTo(3, 8);
  });
});

describe('Simple Interest Calculator - SI-TEST-U-2: month handling', () => {
  it('converts months to years for yearly basis', () => {
    const result = calculateSimpleInterest({
      principal: 5000,
      rate: 12,
      timePeriod: 18,
      timeUnit: 'months',
      interestBasis: 'per-year',
    });

    expect(result).not.toBeNull();
    expect(result.totalInterest).toBeCloseTo(900, 8);
    expect(result.endingAmount).toBeCloseTo(5900, 8);
    expect(result.years).toBeCloseTo(1.5, 8);
  });

  it('uses month count directly for monthly basis', () => {
    const result = calculateSimpleInterest({
      principal: 2000,
      rate: 1,
      timePeriod: 6,
      timeUnit: 'months',
      interestBasis: 'per-month',
    });

    expect(result).not.toBeNull();
    expect(result.totalInterest).toBeCloseTo(120, 8);
    expect(result.endingAmount).toBeCloseTo(2120, 8);
    expect(result.months).toBeCloseTo(6, 8);
  });
});

describe('Simple Interest Calculator - SI-TEST-U-3: validation', () => {
  it('returns null for negative inputs', () => {
    expect(
      calculateSimpleInterest({
        principal: -1,
        rate: 5,
        timePeriod: 1,
      })
    ).toBeNull();
  });

  it('returns null for non-numeric inputs', () => {
    expect(
      calculateSimpleInterest({
        principal: 'abc',
        rate: 5,
        timePeriod: 1,
      })
    ).toBeNull();
  });
});
