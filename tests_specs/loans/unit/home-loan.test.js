import { describe, it, expect } from 'vitest';
import {
  parseStartDate,
  formatMonthYear,
  formatTerm,
  buildHomeLoanSchedule,
  aggregateYearly,
  buildMonthlySeries,
  buildYearlySeries,
} from '../../public/assets/js/core/home-loan-utils.js';
import { computeMonthlyPayment } from '../../public/assets/js/core/loan-utils.js';

/**
 * HOME-LOAN-TEST-U-1 - Home Loan Calculator Unit Tests
 * Covers payment math, amortization schedules, and series generation.
 */

describe('Home Loan Utils - Parsing & Formatting', () => {
  it('parses a valid start date and formats month/year', () => {
    const date = parseStartDate('2026-07');
    expect(date).toBeInstanceOf(Date);
    expect(formatMonthYear(date)).toBe('Jul 2026');
  });

  it('returns null for invalid start dates', () => {
    expect(parseStartDate('')).toBe(null);
    expect(parseStartDate('invalid')).toBe(null);
    expect(parseStartDate('2026-13')).toBe(null);
  });

  it('formats loan terms into years and months', () => {
    expect(formatTerm(360)).toBe('30 years');
    expect(formatTerm(18)).toBe('1 years 6 months');
    expect(formatTerm(6)).toBe('6 months');
  });
});

describe('Home Loan Utils - Schedule Calculations', () => {
  it('computes a baseline amortization schedule with expected interest', () => {
    const principal = 320000;
    const annualRate = 6.5;
    const months = 360;
    const payment = computeMonthlyPayment(principal, annualRate, months);

    const result = buildHomeLoanSchedule({
      principal,
      annualRate,
      months,
      payment,
      extraMonthly: 0,
      lumpSum: 0,
      lumpSumMonth: null,
    });

    const first = result.schedule[0];
    const expectedInterest = (principal * annualRate) / 100 / 12;
    expect(first.interest).toBeCloseTo(expectedInterest, 2);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.months).toBeGreaterThanOrEqual(months - 1);
    expect(result.months).toBeLessThanOrEqual(months + 1);
  });

  it('handles zero interest rate loans', () => {
    const principal = 120000;
    const annualRate = 0;
    const months = 120;
    const payment = computeMonthlyPayment(principal, annualRate, months);

    const result = buildHomeLoanSchedule({
      principal,
      annualRate,
      months,
      payment,
    });

    expect(payment).toBeCloseTo(1000, 4);
    expect(result.totalInterest).toBeCloseTo(0, 6);
    expect(result.schedule[0].interest).toBe(0);
  });

  it('reduces payoff time with extra monthly payments', () => {
    const principal = 400000;
    const annualRate = 6.5;
    const months = 360;
    const payment = computeMonthlyPayment(principal, annualRate, months);

    const baseline = buildHomeLoanSchedule({
      principal,
      annualRate,
      months,
      payment,
      extraMonthly: 0,
    });

    const accelerated = buildHomeLoanSchedule({
      principal,
      annualRate,
      months,
      payment,
      extraMonthly: 500,
    });

    expect(accelerated.months).toBeLessThan(baseline.months);
    expect(accelerated.totalInterest).toBeLessThan(baseline.totalInterest);
  });

  it('applies lump sum payments in the specified month', () => {
    const principal = 250000;
    const annualRate = 5.5;
    const months = 360;
    const payment = computeMonthlyPayment(principal, annualRate, months);

    const result = buildHomeLoanSchedule({
      principal,
      annualRate,
      months,
      payment,
      extraMonthly: 0,
      lumpSum: 10000,
      lumpSumMonth: 12,
    });

    const lumpEntry = result.schedule.find((entry) => entry.month === 12);
    expect(lumpEntry).toBeDefined();
    expect(lumpEntry.extra).toBeCloseTo(10000, 2);
  });
});

describe('Home Loan Utils - Yearly Aggregation & Series', () => {
  it('aggregates yearly data with and without a start date', () => {
    const principal = 12000;
    const annualRate = 4;
    const months = 14;
    const payment = computeMonthlyPayment(principal, annualRate, months);
    const schedule = buildHomeLoanSchedule({ principal, annualRate, months, payment }).schedule;

    const yearlyNoDate = aggregateYearly(schedule, null);
    expect(yearlyNoDate.length).toBe(2);
    expect(yearlyNoDate[0].label).toBe('1');
    expect(yearlyNoDate[1].label).toBe('2');

    const startDate = parseStartDate('2025-01');
    const yearlyWithDate = aggregateYearly(schedule, startDate);
    expect(yearlyWithDate[0].label).toBe('2025');
    expect(yearlyWithDate[1].label).toBe('2026');
  });

  it('builds monthly and yearly balance series', () => {
    const principal = 3000;
    const annualRate = 0;
    const months = 3;
    const payment = computeMonthlyPayment(principal, annualRate, months);
    const scheduleResult = buildHomeLoanSchedule({ principal, annualRate, months, payment });
    const monthlySeries = buildMonthlySeries(scheduleResult.schedule, principal, months);

    expect(monthlySeries.length).toBe(months + 1);
    expect(monthlySeries[0]).toBe(principal);
    expect(monthlySeries[months]).toBe(0);

    const yearly = aggregateYearly(scheduleResult.schedule, null);
    const yearlySeries = buildYearlySeries(yearly, principal, yearly.length);

    expect(yearlySeries.length).toBe(yearly.length + 1);
    expect(yearlySeries[0]).toBe(principal);
  });
});
