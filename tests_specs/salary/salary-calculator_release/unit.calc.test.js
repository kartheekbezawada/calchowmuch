import { describe, expect, it } from 'vitest';
import { calculateSalaryConversion } from '../../../public/calculators/salary-calculators/shared/salary-utils.js';

describe('Salary Calculator', () => {
  it('SALARY-TEST-U-1: converts hourly pay across major pay frequencies', () => {
    const result = calculateSalaryConversion({
      amount: 25,
      frequency: 'hourly',
      hoursPerWeek: 40,
      weeksPerYear: 52,
      daysPerWeek: 5,
    });

    expect(result).not.toBeNull();
    expect(result?.annualPay).toBeCloseTo(52000, 8);
    expect(result?.monthlyPay).toBeCloseTo(4333.333333, 6);
    expect(result?.dailyPay).toBeCloseTo(200, 8);
    expect(result?.hourlyPay).toBeCloseTo(25, 8);
  });

  it('SALARY-TEST-U-2: rejects invalid schedules', () => {
    expect(
      calculateSalaryConversion({ amount: 25, frequency: 'hourly', hoursPerWeek: 0, weeksPerYear: 52, daysPerWeek: 5 })
    ).toBeNull();
  });
});
