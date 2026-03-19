import { describe, expect, it } from 'vitest';
import { calculateHirePurchase } from '../../../public/assets/js/core/auto-loan-utils.js';

describe('auto-loans/hire-purchase unit', () => {
  it('returns monthly payment, balloon, and total payable', () => {
    const result = calculateHirePurchase({
      price: 24000,
      deposit: 2000,
      apr: 6.2,
      termMonths: 48,
      balloon: 4000,
    });

    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.totalPayable).toBeGreaterThan(result.deposit);
    expect(result.balloon).toBe(4000);
  });
});
