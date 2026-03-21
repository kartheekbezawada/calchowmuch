import { describe, expect, it } from 'vitest';
import { calculateCarLoan } from '../../../public/assets/js/core/auto-loan-utils.js';

describe('auto-loans/car-loan unit', () => {
  it('calculates amount financed, monthly payment, and yearly schedule', () => {
    const result = calculateCarLoan({
      price: 28000,
      downPaymentType: 'amount',
      downPaymentAmount: 3000,
      downPaymentPercent: 0,
      tradeIn: 1500,
      fees: 600,
      taxRate: 7,
      apr: 6.5,
      termYears: 5,
    });

    expect(result.amountFinanced).toBeGreaterThan(0);
    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.totalPayment).toBeGreaterThan(result.amountFinanced);
    expect(result.yearly.length).toBeGreaterThan(0);
  });
});
