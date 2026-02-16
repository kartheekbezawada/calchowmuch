import { describe, it, expect } from 'vitest';
import { calculateCompoundInterest } from '../../../public/assets/js/core/time-value-utils.js';

describe('Compound Interest Calculator - CI-TEST-U-1: basic compound interest', () => {
  it('should calculate compound interest with monthly compounding', () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      annualRate: 5,
      timePeriod: 10,
      compounding: 'monthly',
    });

    expect(result).not.toBeNull();
    const expected = 10000 * Math.pow(1 + 0.05 / 12, 12 * 10);
    expect(result.endingBalance).toBeCloseTo(expected, 2);
    expect(result.totalInterestEarned).toBeCloseTo(expected - 10000, 2);
    expect(result.totalContributions).toBe(0);
    expect(result.principal).toBe(10000);
    expect(result.periodsPerYear).toBe(12);
  });

  it('should calculate compound interest with annual compounding', () => {
    const result = calculateCompoundInterest({
      principal: 5000,
      annualRate: 8,
      timePeriod: 5,
      compounding: 'annual',
    });

    expect(result).not.toBeNull();
    const expected = 5000 * Math.pow(1 + 0.08, 5);
    expect(result.endingBalance).toBeCloseTo(expected, 2);
    expect(result.periodsPerYear).toBe(1);
  });

  it('should calculate compound interest with daily compounding', () => {
    const result = calculateCompoundInterest({
      principal: 1000,
      annualRate: 10,
      timePeriod: 1,
      compounding: 'daily',
    });

    expect(result).not.toBeNull();
    const expected = 1000 * Math.pow(1 + 0.10 / 365, 365);
    expect(result.endingBalance).toBeCloseTo(expected, 2);
    expect(result.periodsPerYear).toBe(365);
  });
});

describe('Compound Interest Calculator - CI-TEST-U-2: with contributions', () => {
  it('should include regular contributions in ending balance', () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      annualRate: 5,
      timePeriod: 10,
      compounding: 'monthly',
      contribution: 100,
    });

    expect(result).not.toBeNull();
    const principalGrowth = 10000 * Math.pow(1 + 0.05 / 12, 120);
    const contribGrowth = 100 * ((Math.pow(1 + 0.05 / 12, 120) - 1) / (0.05 / 12));
    const expectedBalance = principalGrowth + contribGrowth;
    expect(result.endingBalance).toBeCloseTo(expectedBalance, 2);
    expect(result.totalContributions).toBeCloseTo(100 * 120, 2);
    expect(result.totalInterestEarned).toBeCloseTo(expectedBalance - 10000 - 100 * 120, 2);
  });

  it('should handle zero contribution', () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      annualRate: 5,
      timePeriod: 10,
      compounding: 'monthly',
      contribution: 0,
    });

    expect(result).not.toBeNull();
    expect(result.totalContributions).toBe(0);
  });
});

describe('Compound Interest Calculator - CI-TEST-U-3: period type months', () => {
  it('should handle months as period type', () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      annualRate: 6,
      timePeriod: 24,
      periodType: 'months',
      compounding: 'monthly',
    });

    expect(result).not.toBeNull();
    const expected = 10000 * Math.pow(1 + 0.06 / 12, 24);
    expect(result.endingBalance).toBeCloseTo(expected, 2);
    expect(result.years).toBeCloseTo(2, 4);
  });
});

describe('Compound Interest Calculator - CI-TEST-U-4: edge cases', () => {
  it('should return principal when rate is zero', () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      annualRate: 0,
      timePeriod: 10,
      compounding: 'monthly',
    });

    expect(result).not.toBeNull();
    expect(result.endingBalance).toBeCloseTo(10000, 2);
    expect(result.totalInterestEarned).toBeCloseTo(0, 2);
  });

  it('should return principal plus contributions when rate is zero with contributions', () => {
    const result = calculateCompoundInterest({
      principal: 1000,
      annualRate: 0,
      timePeriod: 1,
      compounding: 'monthly',
      contribution: 100,
    });

    expect(result).not.toBeNull();
    expect(result.endingBalance).toBeCloseTo(1000 + 100 * 12, 2);
    expect(result.totalInterestEarned).toBeCloseTo(0, 2);
  });

  it('should return principal when time period is zero', () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      annualRate: 5,
      timePeriod: 0,
      compounding: 'monthly',
    });

    expect(result).not.toBeNull();
    expect(result.endingBalance).toBeCloseTo(10000, 2);
  });

  it('should return null for negative principal', () => {
    const result = calculateCompoundInterest({
      principal: -1000,
      annualRate: 5,
      timePeriod: 10,
    });

    expect(result).toBeNull();
  });

  it('should return null for negative rate', () => {
    const result = calculateCompoundInterest({
      principal: 1000,
      annualRate: -5,
      timePeriod: 10,
    });

    expect(result).toBeNull();
  });

  it('should return null for invalid inputs', () => {
    const result = calculateCompoundInterest({
      principal: 'abc',
      annualRate: 5,
      timePeriod: 10,
    });

    expect(result).toBeNull();
  });
});
