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
});
