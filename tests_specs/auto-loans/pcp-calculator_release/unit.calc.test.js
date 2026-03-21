import { describe, expect, it } from 'vitest';
import { calculatePcp } from '../../../public/assets/js/core/auto-loan-utils.js';

describe('auto-loans/pcp-calculator unit', () => {
  it('returns monthly payment, gfv, and final payment including option fee', () => {
    const result = calculatePcp({
      price: 32000,
      deposit: 4000,
      apr: 5.9,
      termMonths: 48,
      balloon: 15000,
      optionFee: 100,
    });

    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.finalPayment).toBeCloseTo(result.gfv + result.optionFee, 6);
    expect(result.totalPayable).toBeGreaterThan(result.deposit);
  });
});
