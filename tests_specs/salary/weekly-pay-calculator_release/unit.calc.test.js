import { describe, expect, it } from 'vitest';
import { calculateWeeklyPay } from '../../../public/calculators/salary-calculators/shared/salary-utils.js';

describe('Weekly Pay Calculator', () => {
  it('WEEKLY-PAY-TEST-U-1: calculates weekly pay in standard mode', () => {
    const result = calculateWeeklyPay({
      mode: 'standard',
      hourlyRate: 25,
      totalWeeklyHours: 40,
      weeksPerYear: 52,
    });

    expect(result).not.toBeNull();
    expect(result?.weeklyPay).toBeCloseTo(1000, 8);
    expect(result?.annualizedPay).toBeCloseTo(52000, 8);
  });

  it('WEEKLY-PAY-TEST-U-2: calculates weekly pay in split-hours mode', () => {
    const result = calculateWeeklyPay({
      mode: 'split',
      hourlyRate: 25,
      regularHours: 40,
      overtimeHours: 5,
      overtimeMultiplier: 1.5,
      weeksPerYear: 52,
    });

    expect(result).not.toBeNull();
    expect(result?.weeklyPay).toBeCloseTo(1187.5, 8);
    expect(result?.annualizedPay).toBeCloseTo(61750, 8);
  });
});
