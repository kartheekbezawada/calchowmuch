import { describe, expect, it } from 'vitest';
import { calculateHourlyToSalary } from '../../../public/calculators/salary-calculators/shared/salary-utils.js';

describe('Hourly to Salary Calculator', () => {
  it('HOURLY-SALARY-TEST-U-1: converts hourly pay to annual and monthly views', () => {
    const result = calculateHourlyToSalary({ hourlyRate: 25, hoursPerWeek: 40, weeksPerYear: 52 });

    expect(result).not.toBeNull();
    expect(result?.annualPay).toBeCloseTo(52000, 8);
    expect(result?.monthlyPay).toBeCloseTo(4333.333333, 6);
    expect(result?.weeklyPay).toBeCloseTo(1000, 8);
  });

  it('HOURLY-SALARY-TEST-U-2: rejects non-positive inputs', () => {
    expect(calculateHourlyToSalary({ hourlyRate: 0, hoursPerWeek: 40, weeksPerYear: 52 })).toBeNull();
  });
});
