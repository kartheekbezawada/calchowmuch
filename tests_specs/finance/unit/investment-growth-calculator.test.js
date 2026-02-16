import { describe, it, expect } from 'vitest';
import { calculateInvestmentGrowth } from '../../../public/assets/js/core/time-value-utils.js';

describe('Investment Growth Calculator - IG-TEST-U-1: basic growth', () => {
  it('should calculate future value with monthly compounding', () => {
    const result = calculateInvestmentGrowth({
      initialInvestment: 10000,
      expectedReturn: 7,
      timePeriod: 10,
      compounding: 'monthly',
    });

    expect(result).not.toBeNull();
    const expected = 10000 * Math.pow(1 + 0.07 / 12, 12 * 10);
    expect(result.futureValue).toBeCloseTo(expected, 2);
    expect(result.totalGains).toBeCloseTo(expected - 10000, 2);
    expect(result.totalContributions).toBe(0);
    expect(result.initialInvestment).toBe(10000);
    expect(result.periodsPerYear).toBe(12);
    expect(result.inflationAdjustedFV).toBeNull();
  });

  it('should calculate future value with annual compounding', () => {
    const result = calculateInvestmentGrowth({
      initialInvestment: 5000,
      expectedReturn: 8,
      timePeriod: 5,
      compounding: 'annual',
    });

    expect(result).not.toBeNull();
    const expected = 5000 * Math.pow(1 + 0.08, 5);
    expect(result.futureValue).toBeCloseTo(expected, 2);
    expect(result.periodsPerYear).toBe(1);
  });

  it('should calculate future value with daily compounding', () => {
    const result = calculateInvestmentGrowth({
      initialInvestment: 1000,
      expectedReturn: 10,
      timePeriod: 1,
      compounding: 'daily',
    });

    expect(result).not.toBeNull();
    const expected = 1000 * Math.pow(1 + 0.10 / 365, 365);
    expect(result.futureValue).toBeCloseTo(expected, 2);
    expect(result.periodsPerYear).toBe(365);
  });
});

describe('Investment Growth Calculator - IG-TEST-U-2: with contributions', () => {
  it('should include monthly contributions in future value', () => {
    const result = calculateInvestmentGrowth({
      initialInvestment: 10000,
      expectedReturn: 7,
      timePeriod: 10,
      compounding: 'monthly',
      monthlyContribution: 200,
    });

    expect(result).not.toBeNull();
    const periodicRate = 0.07 / 12;
    const totalPeriods = 120;
    const initialGrowth = 10000 * Math.pow(1 + periodicRate, totalPeriods);
    const contribGrowth = 200 * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
    const expectedBalance = initialGrowth + contribGrowth;
    expect(result.futureValue).toBeCloseTo(expectedBalance, 2);
    expect(result.totalContributions).toBeCloseTo(200 * 120, 2);
    expect(result.totalGains).toBeCloseTo(expectedBalance - 10000 - 200 * 120, 2);
  });

  it('should handle zero contribution', () => {
    const result = calculateInvestmentGrowth({
      initialInvestment: 10000,
      expectedReturn: 7,
      timePeriod: 10,
      compounding: 'monthly',
      monthlyContribution: 0,
    });

    expect(result).not.toBeNull();
    expect(result.totalContributions).toBe(0);
  });
});

describe('Investment Growth Calculator - IG-TEST-U-3: inflation adjustment', () => {
  it('should calculate inflation-adjusted future value', () => {
    const result = calculateInvestmentGrowth({
      initialInvestment: 10000,
      expectedReturn: 7,
      timePeriod: 10,
      compounding: 'monthly',
      inflationRate: 3,
    });

    expect(result).not.toBeNull();
    expect(result.inflationAdjustedFV).not.toBeNull();
    const nominalFV = result.futureValue;
    const expectedAdjusted = nominalFV / Math.pow(1 + 0.03, 10);
    expect(result.inflationAdjustedFV).toBeCloseTo(expectedAdjusted, 2);
    expect(result.inflationAdjustedFV).toBeLessThan(result.futureValue);
  });

  it('should return null inflation-adjusted value when inflation is zero', () => {
    const result = calculateInvestmentGrowth({
      initialInvestment: 10000,
      expectedReturn: 7,
      timePeriod: 10,
      compounding: 'monthly',
      inflationRate: 0,
    });

    expect(result).not.toBeNull();
    expect(result.inflationAdjustedFV).toBeNull();
  });
});

describe('Investment Growth Calculator - IG-TEST-U-4: period type months', () => {
  it('should handle months as period type', () => {
    const result = calculateInvestmentGrowth({
      initialInvestment: 10000,
      expectedReturn: 6,
      timePeriod: 24,
      periodType: 'months',
      compounding: 'monthly',
    });

    expect(result).not.toBeNull();
    const expected = 10000 * Math.pow(1 + 0.06 / 12, 24);
    expect(result.futureValue).toBeCloseTo(expected, 2);
    expect(result.years).toBeCloseTo(2, 4);
  });
});

describe('Investment Growth Calculator - IG-TEST-U-5: edge cases', () => {
  it('should return initial investment when return is zero', () => {
    const result = calculateInvestmentGrowth({
      initialInvestment: 10000,
      expectedReturn: 0,
      timePeriod: 10,
      compounding: 'monthly',
    });

    expect(result).not.toBeNull();
    expect(result.futureValue).toBeCloseTo(10000, 2);
    expect(result.totalGains).toBeCloseTo(0, 2);
  });

  it('should return initial plus contributions when return is zero with contributions', () => {
    const result = calculateInvestmentGrowth({
      initialInvestment: 1000,
      expectedReturn: 0,
      timePeriod: 1,
      compounding: 'monthly',
      monthlyContribution: 100,
    });

    expect(result).not.toBeNull();
    expect(result.futureValue).toBeCloseTo(1000 + 100 * 12, 2);
    expect(result.totalGains).toBeCloseTo(0, 2);
  });

  it('should return initial investment when time period is zero', () => {
    const result = calculateInvestmentGrowth({
      initialInvestment: 10000,
      expectedReturn: 7,
      timePeriod: 0,
      compounding: 'monthly',
    });

    expect(result).not.toBeNull();
    expect(result.futureValue).toBeCloseTo(10000, 2);
  });

  it('should return null for negative initial investment', () => {
    const result = calculateInvestmentGrowth({
      initialInvestment: -1000,
      expectedReturn: 7,
      timePeriod: 10,
    });

    expect(result).toBeNull();
  });

  it('should return null for negative return rate', () => {
    const result = calculateInvestmentGrowth({
      initialInvestment: 1000,
      expectedReturn: -5,
      timePeriod: 10,
    });

    expect(result).toBeNull();
  });

  it('should return null for negative inflation rate', () => {
    const result = calculateInvestmentGrowth({
      initialInvestment: 1000,
      expectedReturn: 7,
      timePeriod: 10,
      inflationRate: -2,
    });

    expect(result).toBeNull();
  });

  it('should return null for invalid inputs', () => {
    const result = calculateInvestmentGrowth({
      initialInvestment: 'abc',
      expectedReturn: 7,
      timePeriod: 10,
    });

    expect(result).toBeNull();
  });
});
