import { describe, expect, it } from 'vitest';
import { calculateOvertimePay } from '../../../public/calculators/salary-calculators/shared/salary-utils.js';

describe('Overtime Pay Calculator', () => {
  it('OVERTIME-PAY-TEST-U-1: calculates overtime pay and total pay', () => {
    const result = calculateOvertimePay({
      hourlyRate: 25,
      overtimeHours: 10,
      overtimeMultiplier: 1.5,
      basePay: 1000,
    });

    expect(result).not.toBeNull();
    expect(result?.overtimePay).toBeCloseTo(375, 8);
    expect(result?.totalPay).toBeCloseTo(1375, 8);
  });

  it('OVERTIME-PAY-TEST-U-2: rejects invalid multiplier', () => {
    expect(
      calculateOvertimePay({ hourlyRate: 25, overtimeHours: 10, overtimeMultiplier: 0 })
    ).toBeNull();
  });
});
