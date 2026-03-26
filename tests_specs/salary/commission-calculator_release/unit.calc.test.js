import { describe, expect, it } from 'vitest';
import { calculateSalaryCommission } from '../../../public/calculators/salary-calculators/shared/salary-utils.js';

describe('Commission Calculator', () => {
  it('COMMISSION-TEST-U-1: calculates commission in rate mode', () => {
    const result = calculateSalaryCommission({
      salesAmount: 50000,
      mode: 'rate',
      commissionRate: 8,
      basePay: 3000,
    });

    expect(result).not.toBeNull();
    expect(result?.commissionAmount).toBeCloseTo(4000, 8);
    expect(result?.totalEarnings).toBeCloseTo(7000, 8);
    expect(result?.effectiveCommissionRate).toBeCloseTo(8, 8);
  });

  it('COMMISSION-TEST-U-2: calculates commission in amount mode', () => {
    const result = calculateSalaryCommission({
      salesAmount: 50000,
      mode: 'amount',
      commissionAmount: 4000,
      basePay: 3000,
    });

    expect(result).not.toBeNull();
    expect(result?.totalEarnings).toBeCloseTo(7000, 8);
    expect(result?.effectiveCommissionRate).toBeCloseTo(8, 8);
  });
});
