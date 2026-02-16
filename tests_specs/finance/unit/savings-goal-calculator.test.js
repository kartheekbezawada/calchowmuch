import { describe, expect, it } from 'vitest';
import { calculateSavingsGoal } from '../../../public/assets/js/core/time-value-utils.js';

describe('Savings Goal Calculator - SG-TEST-U-1: time to goal mode', () => {
  it('calculates months to goal with zero interest', () => {
    const result = calculateSavingsGoal({
      mode: 'time-to-goal',
      goalAmount: 10000,
      currentSavings: 1000,
      monthlyContribution: 500,
      annualRate: 0,
      compounding: 'monthly',
      contributionTiming: 'end',
    });

    expect(result).not.toBeNull();
    expect(result.monthsToGoal).toBe(18);
    expect(result.finalBalance).toBeCloseTo(10000, 8);
    expect(result.totalInterestEarned).toBeCloseTo(0, 8);
  });

  it('returns zero months when current savings already meets goal', () => {
    const result = calculateSavingsGoal({
      mode: 'time-to-goal',
      goalAmount: 5000,
      currentSavings: 6000,
      monthlyContribution: 0,
      annualRate: 0,
    });

    expect(result).not.toBeNull();
    expect(result.monthsToGoal).toBe(0);
    expect(result.requiredMonthlySavings).toBe(0);
  });
});

describe('Savings Goal Calculator - SG-TEST-U-2: monthly needed mode', () => {
  it('calculates required monthly savings with zero interest', () => {
    const result = calculateSavingsGoal({
      mode: 'monthly-needed',
      goalAmount: 20000,
      currentSavings: 2000,
      targetTime: 36,
      targetTimeUnit: 'months',
      annualRate: 0,
      compounding: 'monthly',
    });

    expect(result).not.toBeNull();
    expect(result.requiredMonthlySavings).toBeCloseTo(500, 8);
    expect(result.finalBalance).toBeCloseTo(20000, 8);
  });

  it('requires less monthly savings when interest is positive', () => {
    const noInterest = calculateSavingsGoal({
      mode: 'monthly-needed',
      goalAmount: 30000,
      currentSavings: 5000,
      targetTime: 5,
      targetTimeUnit: 'years',
      annualRate: 0,
      compounding: 'monthly',
    });

    const withInterest = calculateSavingsGoal({
      mode: 'monthly-needed',
      goalAmount: 30000,
      currentSavings: 5000,
      targetTime: 5,
      targetTimeUnit: 'years',
      annualRate: 4,
      compounding: 'monthly',
    });

    expect(noInterest).not.toBeNull();
    expect(withInterest).not.toBeNull();
    expect(withInterest.requiredMonthlySavings).toBeLessThan(noInterest.requiredMonthlySavings);
    expect(withInterest.finalBalance).toBeGreaterThanOrEqual(30000);
  });
});

describe('Savings Goal Calculator - SG-TEST-U-3: validation', () => {
  it('returns null for invalid values', () => {
    expect(
      calculateSavingsGoal({
        mode: 'monthly-needed',
        goalAmount: -1,
        currentSavings: 0,
        targetTime: 12,
      })
    ).toBeNull();

    expect(
      calculateSavingsGoal({
        mode: 'time-to-goal',
        goalAmount: 10000,
        currentSavings: 0,
        monthlyContribution: 0,
        annualRate: 0,
      })
    ).toBeNull();
  });
});
