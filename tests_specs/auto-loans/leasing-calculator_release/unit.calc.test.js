import { describe, expect, it } from 'vitest';
import { calculateLease } from '../../../public/assets/js/core/auto-loan-utils.js';

describe('auto-loans/leasing-calculator unit', () => {
  it('returns monthly payment, residual, and total lease cost', () => {
    const result = calculateLease({
      price: 30000,
      residualType: 'percent',
      residualValue: 0,
      residualPercent: 50,
      termMonths: 36,
      moneyFactor: 0.0022,
      upfrontPayment: 1500,
    });

    expect(result.residual).toBeGreaterThan(0);
    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.totalLeaseCost).toBeGreaterThan(result.upfrontPayment);
  });
});
