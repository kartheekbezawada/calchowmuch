import { describe, it, expect } from 'vitest';
import {
  calculateCreditCardPayoff,
  calculateMinimumPayment,
  calculateBalanceTransfer,
  calculateConsolidation,
} from '../../../public/assets/js/core/credit-card-utils.js';

describe('credit card utility calculations', () => {
  it('calculates credit card payoff with fixed payment', () => {
    const result = calculateCreditCardPayoff({
      balance: 5000,
      apr: 18,
      monthlyPayment: 200,
      extraPayment: 0,
    });

    expect(result.error).toBeUndefined();
    expect(result.months).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalPayment).toBeGreaterThan(5000);
  });

  it('flags payment too low to reduce balance', () => {
    const result = calculateCreditCardPayoff({
      balance: 5000,
      apr: 24,
      monthlyPayment: 20,
      extraPayment: 0,
    });

    expect(result.error).toBeTruthy();
  });

  it('calculates minimum payment schedule', () => {
    const result = calculateMinimumPayment({
      balance: 3000,
      apr: 19.9,
      minRate: 2,
      minPayment: 25,
    });

    expect(result.error).toBeUndefined();
    expect(result.firstPayment).toBeGreaterThan(0);
    expect(result.lastPayment).toBeGreaterThan(0);
    expect(result.months).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it('returns error when minimum payment cannot reduce balance', () => {
    const result = calculateMinimumPayment({
      balance: 5000,
      apr: 36,
      minRate: 0.1,
      minPayment: 5,
    });

    expect(result.error).toBe('Minimum payment is too low to reduce the balance.');
  });

  it('handles zero APR with zero interest', () => {
    const result = calculateMinimumPayment({
      balance: 1200,
      apr: 0,
      minRate: 2.5,
      minPayment: 20,
    });

    expect(result.error).toBeUndefined();
    expect(result.months).toBeGreaterThan(0);
    expect(result.totalInterest).toBe(0);
  });

  it('pays off tiny balance below floor in one month', () => {
    const result = calculateMinimumPayment({
      balance: 10,
      apr: 0,
      minRate: 1,
      minPayment: 25,
    });

    expect(result.error).toBeUndefined();
    expect(result.months).toBe(1);
  });

  it('calculates balance transfer with fee and promo period', () => {
    const result = calculateBalanceTransfer({
      balance: 4000,
      transferFeePercent: 3,
      promoApr: 0,
      promoMonths: 12,
      postApr: 18,
      monthlyPayment: 150,
    });

    expect(result.error).toBeUndefined();
    expect(result.fee).toBeCloseTo(120, 2);
    expect(result.startingBalance).toBeCloseTo(4120, 2);
    expect(result.months).toBeGreaterThan(0);
  });

  it('calculates consolidation comparison', () => {
    const result = calculateConsolidation({
      balance: 10000,
      currentApr: 18,
      currentPayment: 350,
      consolidationApr: 9,
      termMonths: 36,
      fees: 200,
    });

    expect(result.error).toBeUndefined();
    expect(result.current.months).toBeGreaterThan(0);
    expect(result.consolidation.monthlyPayment).toBeGreaterThan(0);
    expect(result.interestDifference).toBeDefined();
  });

  it('handles consolidation with zero APR', () => {
    const result = calculateConsolidation({
      balance: 7500,
      currentApr: 22,
      currentPayment: 260,
      consolidationApr: 0,
      termMonths: 36,
      fees: 0,
    });

    expect(result.error).toBeUndefined();
    expect(result.consolidation.totalInterest).toBe(0);
    expect(result.consolidation.totalPayment).toBeCloseTo(7500, 2);
  });

  it('handles consolidation with zero fees', () => {
    const result = calculateConsolidation({
      balance: 9000,
      currentApr: 19,
      currentPayment: 300,
      consolidationApr: 11,
      termMonths: 48,
      fees: 0,
    });

    expect(result.error).toBeUndefined();
    expect(result.consolidation.balance).toBe(9000);
    expect(result.consolidation.monthlyPayment).toBeGreaterThan(0);
  });

  it('returns negative savings when consolidation is more expensive', () => {
    const result = calculateConsolidation({
      balance: 5000,
      currentApr: 12,
      currentPayment: 220,
      consolidationApr: 24,
      termMonths: 60,
      fees: 400,
    });

    expect(result.error).toBeUndefined();
    expect(result.interestDifference).toBeLessThan(0);
    expect(result.totalDifference).toBeLessThan(0);
  });
});
