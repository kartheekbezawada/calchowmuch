import { describe, expect, it } from 'vitest';
import { calculateMonthlyToAnnual } from '../../../public/calculators/salary-calculators/shared/salary-utils.js';

describe('Monthly to Annual Salary Calculator', () => {
  it('MONTHLY-ANNUAL-TEST-U-1: converts monthly salary to annual and weekly values', () => {
    const result = calculateMonthlyToAnnual({ monthlySalary: 5000, weeksPerYear: 52 });

    expect(result).not.toBeNull();
    expect(result?.annualSalary).toBeCloseTo(60000, 8);
    expect(result?.biweeklyPay).toBeCloseTo(2307.692307, 6);
    expect(result?.weeklyPay).toBeCloseTo(1153.846153, 6);
  });

  it('MONTHLY-ANNUAL-TEST-U-2: rejects invalid monthly salary input', () => {
    expect(calculateMonthlyToAnnual({ monthlySalary: -1, weeksPerYear: 52 })).toBeNull();
  });
});
