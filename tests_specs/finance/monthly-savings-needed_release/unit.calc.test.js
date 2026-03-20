import { describe, expect, it } from 'vitest';
import { calculateSavingsGoal } from '../../../public/assets/js/core/time-value-utils.js';

describe('Monthly Savings Needed Calculator', () => {
  it('MSN-U-1 returns zero required savings when current balance already meets the goal', () => {
    const result = calculateSavingsGoal({
      mode: 'monthly-needed',
      goalAmount: 10000,
      currentSavings: 10000,
      targetTime: 12,
      targetTimeUnit: 'months',
      annualRate: 0,
      compounding: 'monthly',
      contributionTiming: 'end',
    });

    expect(result).not.toBeNull();
    expect(result.requiredMonthlySavings).toBe(0);
  });

  it('MSN-U-2 calculates a positive monthly contribution for a reachable plan', () => {
    const result = calculateSavingsGoal({
      mode: 'monthly-needed',
      goalAmount: 25000,
      currentSavings: 5000,
      targetTime: 36,
      targetTimeUnit: 'months',
      annualRate: 3,
      compounding: 'monthly',
      contributionTiming: 'end',
    });

    expect(result).not.toBeNull();
    expect(result.requiredMonthlySavings).toBeGreaterThan(0);
    expect(result.finalBalance).toBeGreaterThanOrEqual(25000);
  });

  it('MSN-U-3 returns null when target time is invalid', () => {
    const result = calculateSavingsGoal({
      mode: 'monthly-needed',
      goalAmount: 25000,
      currentSavings: 5000,
      targetTime: 0,
      targetTimeUnit: 'months',
      annualRate: 3,
      compounding: 'monthly',
      contributionTiming: 'end',
    });

    expect(result).toBeNull();
  });
});
