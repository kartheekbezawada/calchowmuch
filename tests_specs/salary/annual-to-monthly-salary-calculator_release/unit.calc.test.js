import { describe, expect, it } from 'vitest';
import { calculateSalaryConversion } from '../../../public/calculators/salary-calculators/shared/salary-utils.js';

// The page was reframed 2026-08 into a gross pay-period converter driven by calculateSalaryConversion
// (a source-frequency picker + schedule inputs), so this covers the actual conversion it performs.
describe('Annual to Monthly Salary Calculator', () => {
  it('ANNUAL-MONTHLY-TEST-U-1: converts an annual salary into every pay period', () => {
    const result = calculateSalaryConversion({
      amount: 72000,
      frequency: 'annual',
      hoursPerWeek: 40,
      weeksPerYear: 52,
      daysPerWeek: 5,
    });

    expect(result).not.toBeNull();
    expect(result.annualPay).toBeCloseTo(72000, 8);
    expect(result.monthlyPay).toBeCloseTo(6000, 8);
    expect(result.biweeklyPay).toBeCloseTo(72000 / 26, 8);
    expect(result.weeklyPay).toBeCloseTo(72000 / 52, 8);
    expect(result.hourlyPay).toBeCloseTo(72000 / 52 / 40, 8);
  });

  it('ANNUAL-MONTHLY-TEST-U-2: converts an hourly rate up to an annual salary', () => {
    const result = calculateSalaryConversion({
      amount: 30,
      frequency: 'hourly',
      hoursPerWeek: 40,
      weeksPerYear: 52,
      daysPerWeek: 5,
    });

    expect(result.annualPay).toBeCloseTo(62400, 8);
    expect(result.monthlyPay).toBeCloseTo(5200, 8);
  });

  it('ANNUAL-MONTHLY-TEST-U-3: rejects invalid inputs', () => {
    expect(calculateSalaryConversion({ amount: 0, frequency: 'annual', weeksPerYear: 52 })).toBeNull();
    expect(
      calculateSalaryConversion({ amount: 72000, frequency: 'annual', weeksPerYear: 0 })
    ).toBeNull();
  });
});
