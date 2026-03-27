import { describe, expect, it } from 'vitest';
import { calculateAnnualToMonthly } from '../../../public/calculators/salary-calculators/shared/salary-utils.js';

describe('Annual to Monthly Salary Calculator', () => {
  it('ANNUAL-MONTHLY-TEST-U-1: converts annual salary to monthly and weekly values', () => {
    const result = calculateAnnualToMonthly({ annualSalary: 72000, weeksPerYear: 52 });

    expect(result).not.toBeNull();
    expect(result?.monthlySalary).toBeCloseTo(6000, 8);
    expect(result?.biweeklyPay).toBeCloseTo(2769.230769, 6);
    expect(result?.weeklyPay).toBeCloseTo(1384.615384, 6);
  });

  it('ANNUAL-MONTHLY-TEST-U-2: rejects invalid weeks-per-year', () => {
    expect(calculateAnnualToMonthly({ annualSalary: 72000, weeksPerYear: 0 })).toBeNull();
  });
});
