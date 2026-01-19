import { describe, it, expect } from 'vitest';
import { calculateBuyToLet, buildRentIncreaseSchedule } from '../../../public/assets/js/core/loan-utils.js';
import { hasMaxDigits } from '../../../public/assets/js/core/validate.js';

describe('buy-to-let rent increase calculations', () => {
  it('applies percentage-based rent increases annually', () => {
    const schedule = buildRentIncreaseSchedule({
      monthlyRent: 1000,
      years: 10,
      rentIncreaseEnabled: true,
      rentIncreaseType: 'percent',
      rentIncreaseValue: 5,
      rentIncreaseInterval: 1,
    });

    expect(schedule[0].monthlyRent).toBeCloseTo(1000, 2);
    expect(schedule[1].monthlyRent).toBeCloseTo(1050, 2);
    expect(schedule[4].monthlyRent).toBeCloseTo(1215.51, 2);
  });

  it('applies fixed rent increases annually', () => {
    const schedule = buildRentIncreaseSchedule({
      monthlyRent: 1000,
      years: 10,
      rentIncreaseEnabled: true,
      rentIncreaseType: 'amount',
      rentIncreaseValue: 50,
      rentIncreaseInterval: 1,
    });

    expect(schedule[0].monthlyRent).toBeCloseTo(1000, 2);
    expect(schedule[1].monthlyRent).toBeCloseTo(1050, 2);
    expect(schedule[4].monthlyRent).toBeCloseTo(1200, 2);
  });

  it('applies rent increases on a custom interval', () => {
    const schedule = buildRentIncreaseSchedule({
      monthlyRent: 1000,
      years: 6,
      rentIncreaseEnabled: true,
      rentIncreaseType: 'percent',
      rentIncreaseValue: 10,
      rentIncreaseInterval: 2,
    });

    expect(schedule[0].monthlyRent).toBeCloseTo(1000, 2);
    expect(schedule[1].monthlyRent).toBeCloseTo(1000, 2);
    expect(schedule[2].monthlyRent).toBeCloseTo(1100, 2);
    expect(schedule[3].monthlyRent).toBeCloseTo(1100, 2);
    expect(schedule[4].monthlyRent).toBeCloseTo(1210, 2);
    expect(schedule[5].monthlyRent).toBeCloseTo(1210, 2);
  });

  it('rejects input values longer than 10 digits', () => {
    expect(hasMaxDigits('12345678901', 10)).toBe(false);
  });

  it('shows higher cashflow when rent increase is enabled', () => {
    const base = calculateBuyToLet({
      propertyPrice: 200000,
      depositType: 'percent',
      depositAmount: 0,
      depositPercent: 25,
      annualRate: 5,
      termYears: 5,
      mortgageType: 'interest-only',
      monthlyRent: 1000,
      vacancyType: 'percent',
      vacancyPercent: 0,
      vacancyMonths: 0,
      agentFeePercent: 0,
      maintenanceMonthly: 0,
      otherCostsMonthly: 0,
      rentIncreaseEnabled: false,
      rentIncreaseType: 'percent',
      rentIncreaseValue: 0,
      rentIncreaseInterval: 1,
    });

    const increased = calculateBuyToLet({
      propertyPrice: 200000,
      depositType: 'percent',
      depositAmount: 0,
      depositPercent: 25,
      annualRate: 5,
      termYears: 5,
      mortgageType: 'interest-only',
      monthlyRent: 1000,
      vacancyType: 'percent',
      vacancyPercent: 0,
      vacancyMonths: 0,
      agentFeePercent: 0,
      maintenanceMonthly: 0,
      otherCostsMonthly: 0,
      rentIncreaseEnabled: true,
      rentIncreaseType: 'percent',
      rentIncreaseValue: 5,
      rentIncreaseInterval: 1,
    });

    expect(increased.projection[1].netCashflow).toBeGreaterThan(base.projection[1].netCashflow);
  });
});
