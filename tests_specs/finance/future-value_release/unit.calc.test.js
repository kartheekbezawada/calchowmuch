import { describe, it, expect } from 'vitest';
import { calculateFutureValue } from '../../../public/assets/js/core/time-value-utils.js';

describe('Future Value Calculator - FV-TEST-U-1: annual compounding', () => {
  it('should calculate future value with annual compounding', () => {
    const result = calculateFutureValue({
      presentValue: 10000,
      interestRate: 5,
      timePeriod: 3,
      periodType: 'years',
      compounding: 'annual',
      regularContribution: 0,
    });

    expect(result).not.toBeNull();
    const expected = 10000 * Math.pow(1 + 0.05, 3);
    expect(result.futureValue).toBeCloseTo(expected, 6);
    expect(result.totalContributions).toBeCloseTo(0, 6);
    expect(result.totalPeriods).toBeCloseTo(3, 6);
  });
});

describe('Future Value Calculator - FV-TEST-U-2: monthly with contributions', () => {
  it('should calculate future value with monthly contributions', () => {
    const result = calculateFutureValue({
      presentValue: 5000,
      interestRate: 6,
      timePeriod: 24,
      periodType: 'months',
      compounding: 'monthly',
      regularContribution: 100,
    });

    expect(result).not.toBeNull();
    const periodicRate = 0.06 / 12;
    const n = 24;
    const expected =
      5000 * Math.pow(1 + periodicRate, n) +
      100 * ((Math.pow(1 + periodicRate, n) - 1) / periodicRate);
    expect(result.futureValue).toBeCloseTo(expected, 6);
    expect(result.totalContributions).toBeCloseTo(2400, 6);
    expect(result.totalPeriods).toBeCloseTo(24, 6);
  });
});

describe('Future Value Calculator - FV-TEST-U-3: edge cases', () => {
  it('should handle zero rate with contributions', () => {
    const result = calculateFutureValue({
      presentValue: 1200,
      interestRate: 0,
      timePeriod: 5,
      periodType: 'years',
      compounding: 'annual',
      regularContribution: 50,
    });

    expect(result).not.toBeNull();
    expect(result.futureValue).toBeCloseTo(1450, 6);
    expect(result.totalContributions).toBeCloseTo(250, 6);
    expect(result.totalGrowth).toBeCloseTo(0, 6);
  });

  it('should return null for negative inputs', () => {
    const result = calculateFutureValue({
      presentValue: 1000,
      interestRate: -1,
      timePeriod: 2,
      periodType: 'years',
      compounding: 'annual',
      regularContribution: 0,
    });

    expect(result).toBeNull();
  });
});
