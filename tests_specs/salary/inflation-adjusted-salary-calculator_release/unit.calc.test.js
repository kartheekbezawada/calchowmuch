import { describe, expect, it } from 'vitest';
import { calculateInflationAdjustedSalary } from '../../../public/calculators/salary-calculators/shared/salary-utils.js';

describe('Inflation Adjusted Salary Calculator', () => {
  it('IAS-TEST-U-1: calculates keep-pace salary and real gap when the new salary beats inflation', () => {
    const result = calculateInflationAdjustedSalary({
      currentSalary: 60000,
      newSalary: 66000,
      annualInflationRate: 3,
      yearsBetween: 2,
    });

    expect(result).not.toBeNull();
    expect(result?.requiredSalary).toBeCloseTo(63654, 3);
    expect(result?.nominalRaiseAmount).toBeCloseTo(6000, 8);
    expect(result?.realRaiseAmount).toBeCloseTo(2346, 3);
    expect(result?.newSalaryInTodayDollars).toBeCloseTo(62211.33, 2);
  });

  it('IAS-TEST-U-2: reports a negative real gap when inflation outpaces the salary change', () => {
    const result = calculateInflationAdjustedSalary({
      currentSalary: 60000,
      newSalary: 62000,
      annualInflationRate: 4,
      yearsBetween: 2,
    });

    expect(result).not.toBeNull();
    expect(result?.requiredSalary).toBeCloseTo(64896, 3);
    expect(result?.realRaiseAmount).toBeCloseTo(-2896, 3);
    expect(result?.realRaisePercent).toBeLessThan(0);
  });

  it('IAS-TEST-U-3: rejects invalid inputs', () => {
    const result = calculateInflationAdjustedSalary({
      currentSalary: 0,
      newSalary: 66000,
      annualInflationRate: 3,
      yearsBetween: 2,
    });

    expect(result).toBeNull();
  });
});
