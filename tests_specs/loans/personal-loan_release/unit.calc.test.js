import { describe, expect, it } from 'vitest';
import {
  calculatePersonalLoan,
  computeMonthlyPayment,
  getMaxExtraPaymentForFirstMonth,
  previewMonthlyRows,
  previewYearlyRows,
} from '../../../public/calculators/loan-calculators/personal-loan-calculator/engine.js';

describe('Personal Loan - formula and amortization contract', () => {
  it('computes monthly payment with positive interest', () => {
    const monthly = computeMonthlyPayment(25000, 10, 60);
    expect(monthly).toBeGreaterThan(500);
    expect(monthly).toBeLessThan(600);
  });

  it('handles zero-rate loans', () => {
    const monthly = computeMonthlyPayment(12000, 0, 24);
    expect(monthly).toBeCloseTo(500, 8);

    const result = calculatePersonalLoan({
      principal: 12000,
      annualRate: 0,
      months: 24,
      setupFee: 0,
      extraMonthly: 0,
    });

    expect(result.baseline.totalInterest).toBeCloseTo(0, 8);
    expect(result.baseline.months).toBe(24);
  });

  it('reduces payoff months and interest with extra monthly payment', () => {
    const result = calculatePersonalLoan({
      principal: 40000,
      annualRate: 11.2,
      months: 72,
      setupFee: 0,
      extraMonthly: 120,
    });

    expect(result.accelerated.months).toBeLessThan(result.baseline.months);
    expect(result.accelerated.totalInterest).toBeLessThan(result.baseline.totalInterest);
    expect(result.insight.monthsSaved).toBeGreaterThan(0);
    expect(result.insight.interestSaved).toBeGreaterThan(0);
  });

  it('adds setup fee only to total-cost metric', () => {
    const noFee = calculatePersonalLoan({
      principal: 18000,
      annualRate: 8,
      months: 48,
      setupFee: 0,
      extraMonthly: 0,
    });

    const withFee = calculatePersonalLoan({
      principal: 18000,
      annualRate: 8,
      months: 48,
      setupFee: 350,
      extraMonthly: 0,
    });

    expect(withFee.baseline.totalPayment).toBeCloseTo(noFee.baseline.totalPayment, 8);
    expect(withFee.baseline.totalCostWithFee).toBeCloseTo(noFee.baseline.totalCostWithFee + 350, 8);
  });

  it('enforces finite first-month extra-payment cap helper', () => {
    const maxExtra = getMaxExtraPaymentForFirstMonth({
      principal: 25000,
      annualRate: 9.5,
      months: 60,
    });

    expect(Number.isFinite(maxExtra)).toBe(true);
    expect(maxExtra).toBeGreaterThan(0);
  });

  it('caps monthly preview to first 60 months', () => {
    const result = calculatePersonalLoan({
      principal: 350000,
      annualRate: 6.8,
      months: 360,
      setupFee: 0,
      extraMonthly: 0,
    });

    const monthlyRows = previewMonthlyRows(result.baseline.schedule, 60);
    expect(monthlyRows).toHaveLength(60);
    expect(monthlyRows[0].period).toBe(1);
    expect(monthlyRows[59].period).toBe(60);
  });

  it('aggregates yearly preview to first 5 years with consistent totals', () => {
    const result = calculatePersonalLoan({
      principal: 90000,
      annualRate: 7.4,
      months: 120,
      setupFee: 0,
      extraMonthly: 0,
    });

    const yearlyRows = previewYearlyRows(result.baseline.schedule, 5);
    expect(yearlyRows).toHaveLength(5);
    expect(yearlyRows[0].period).toBe(1);
    expect(yearlyRows[4].period).toBe(5);

    const firstSixtyMonths = result.baseline.schedule.slice(0, 60);
    const sumPayment = firstSixtyMonths.reduce((sum, row) => sum + row.payment, 0);
    const aggregatedPayment = yearlyRows.reduce((sum, row) => sum + row.payment, 0);
    expect(aggregatedPayment).toBeCloseTo(sumPayment, 6);
  });
});
