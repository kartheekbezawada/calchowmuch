import { describe, it, expect } from 'vitest';
import {
  calculateCarLoan,
  calculateMultipleCarLoan,
  computeBalloonPayment,
  calculateHirePurchase,
  calculatePcp,
  calculateLease,
} from '../../../public/assets/js/core/auto-loan-utils.js';

describe('auto loan utility calculations', () => {
  it('calculates car loan amount financed with percent down', () => {
    const result = calculateCarLoan({
      price: 20000,
      downPaymentType: 'percent',
      downPaymentAmount: 0,
      downPaymentPercent: 10,
      tradeIn: 1000,
      fees: 500,
      taxRate: 5,
      apr: 6,
      termYears: 5,
    });

    expect(result.amountFinanced).toBeCloseTo(18450, 2);
    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it('calculates multiple car loans and combined totals', () => {
    const result = calculateMultipleCarLoan({
      loanA: { amount: 15000, apr: 5, termYears: 4 },
      loanB: { amount: 10000, apr: 7, termYears: 5 },
    });

    expect(result.loanA.monthlyPayment).toBeGreaterThan(0);
    expect(result.loanB.monthlyPayment).toBeGreaterThan(0);
    expect(result.combined.monthlyPayment).toBeCloseTo(
      result.loanA.monthlyPayment + result.loanB.monthlyPayment,
      2
    );
  });

  it('computes balloon payment with zero interest', () => {
    const payment = computeBalloonPayment(10000, 0, 10, 2000);
    expect(payment).toBeCloseTo(800, 6);
  });

  it('calculates hire purchase with balloon', () => {
    const result = calculateHirePurchase({
      price: 20000,
      deposit: 2000,
      apr: 5,
      termMonths: 36,
      balloon: 5000,
    });

    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.totalPayable).toBeGreaterThan(0);
    expect(result.balloon).toBeLessThanOrEqual(result.financed);
  });

  it('calculates PCP with option fee', () => {
    const result = calculatePcp({
      price: 25000,
      deposit: 2000,
      apr: 4.5,
      termMonths: 36,
      balloon: 12000,
      optionFee: 150,
    });

    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.balloon).toBeGreaterThanOrEqual(0);
  });

  it('calculates lease payment with residual percent', () => {
    const result = calculateLease({
      price: 30000,
      residualType: 'percent',
      residualValue: 0,
      residualPercent: 50,
      termMonths: 36,
      moneyFactor: 0.002,
      upfrontPayment: 1000,
    });

    expect(result.residual).toBeCloseTo(15000, 2);
    expect(result.monthlyPayment).toBeCloseTo(476.89, 1);
    expect(result.totalLeaseCost).toBeGreaterThan(result.monthlyPayment);
  });
});
