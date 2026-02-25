import { describe, expect, it } from 'vitest';
import {
  calculateBorrow,
  computeMonthlyPayment,
  computePrincipalFromPayment,
} from '../../../public/assets/js/core/loan-utils.js';

describe('How Much Can I Borrow - loan math contract', () => {
  it('payment method computes principal from disposable monthly budget', () => {
    const input = {
      grossIncomeAnnual: 90000,
      netIncomeMonthly: 5500,
      incomeBasis: 'gross',
      expensesMonthly: 1200,
      debtMonthly: 300,
      interestRate: 6.5,
      termYears: 25,
      method: 'payment',
      incomeMultiple: 4.5,
      deposit: 20000,
    };

    const result = calculateBorrow(input);
    const months = input.termYears * 12;
    const expectedPrincipal = computePrincipalFromPayment(
      result.monthlyDisposable,
      input.interestRate,
      months
    );

    expect(result.monthlyIncome).toBeCloseTo(7500, 6);
    expect(result.monthlyDisposable).toBeCloseTo(6000, 6);
    expect(result.maxBorrow).toBeCloseTo(expectedPrincipal, 3);
    expect(result.monthlyPayment).toBeCloseTo(result.monthlyDisposable, 3);
    expect(result.maxPropertyPrice).toBeCloseTo(result.maxBorrow + input.deposit, 3);
  });

  it('income-multiple method is capped by affordability via binary search', () => {
    const input = {
      grossIncomeAnnual: 90000,
      netIncomeMonthly: 0,
      incomeBasis: 'gross',
      expensesMonthly: 3200,
      debtMonthly: 1200,
      interestRate: 6.5,
      termYears: 25,
      method: 'income',
      incomeMultiple: 6.5,
      deposit: 0,
    };

    const result = calculateBorrow(input);
    const uncappedBorrow = input.grossIncomeAnnual * input.incomeMultiple;
    const uncappedPayment = computeMonthlyPayment(
      uncappedBorrow,
      input.interestRate,
      input.termYears * 12
    );

    expect(uncappedPayment).toBeGreaterThan(result.monthlyDisposable);
    expect(result.maxBorrow).toBeLessThan(uncappedBorrow);
    expect(result.monthlyPayment).toBeLessThanOrEqual(result.monthlyDisposable + 0.5);
    expect(result.maxPropertyPrice).toBe(null);
  });

  it('returns affordability gap when disposable monthly income is non-positive', () => {
    const result = calculateBorrow({
      grossIncomeAnnual: 36000,
      netIncomeMonthly: 0,
      incomeBasis: 'gross',
      expensesMonthly: 2600,
      debtMonthly: 800,
      interestRate: 6.5,
      termYears: 25,
      method: 'payment',
      incomeMultiple: 4.5,
      deposit: 0,
    });

    expect(result.hasAffordabilityGap).toBe(true);
    expect(result.monthlyDisposable).toBeLessThanOrEqual(0);
    expect(result.maxBorrow).toBe(0);
    expect(result.monthlyPayment).toBe(0);
    expect(result.maxPayment).toBe(0);
  });

  it('produces a deterministic rate series around current rate', () => {
    const result = calculateBorrow({
      grossIncomeAnnual: 90000,
      netIncomeMonthly: 0,
      incomeBasis: 'gross',
      expensesMonthly: 1200,
      debtMonthly: 300,
      interestRate: 6.5,
      termYears: 25,
      method: 'income',
      incomeMultiple: 4.5,
      deposit: 10000,
    });

    expect(result.rateSeries).toHaveLength(9);
    expect(result.rateSeries[0].rate).toBe(4.5);
    expect(result.rateSeries[result.rateSeries.length - 1].rate).toBe(8.5);
    expect(
      result.rateSeries.every((entry) => Number.isFinite(entry.value) && entry.value >= 0)
    ).toBe(true);
  });
});
