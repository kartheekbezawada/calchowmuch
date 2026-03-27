import { describe, expect, it } from 'vitest';
import { calculateSalaryToHourly } from '../../../public/calculators/salary-calculators/shared/salary-utils.js';

describe('Salary to Hourly Calculator', () => {
  it('SALARY-HOURLY-TEST-U-1: converts annual salary to hourly and weekly pay', () => {
    const result = calculateSalaryToHourly({ annualSalary: 52000, hoursPerWeek: 40, weeksPerYear: 52 });

    expect(result).not.toBeNull();
    expect(result?.hourlyPay).toBeCloseTo(25, 8);
    expect(result?.weeklyPay).toBeCloseTo(1000, 8);
    expect(result?.monthlyPay).toBeCloseTo(4333.333333, 6);
  });

  it('SALARY-HOURLY-TEST-U-2: rejects invalid annual salary input', () => {
    expect(calculateSalaryToHourly({ annualSalary: -1, hoursPerWeek: 40, weeksPerYear: 52 })).toBeNull();
  });
});
