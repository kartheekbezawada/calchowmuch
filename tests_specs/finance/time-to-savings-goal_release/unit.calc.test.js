import { describe, expect, it } from 'vitest';
import { calculateSavingsGoal } from '../../../public/assets/js/core/time-value-utils.js';

describe('Time to Savings Goal Calculator', () => {
  it('TSG-U-1 returns zero timeline when current savings already meets the goal', () => {
    const result = calculateSavingsGoal({
      mode: 'time-to-goal',
      goalAmount: 10000,
      currentSavings: 10000,
      monthlyContribution: 0,
      annualRate: 0,
      compounding: 'monthly',
      contributionTiming: 'end',
    });

    expect(result).not.toBeNull();
    expect(result.monthsToGoal).toBe(0);
    expect(result.finalBalance).toBe(10000);
  });

  it('TSG-U-2 calculates a positive timeline for a reachable plan', () => {
    const result = calculateSavingsGoal({
      mode: 'time-to-goal',
      goalAmount: 25000,
      currentSavings: 5000,
      monthlyContribution: 500,
      annualRate: 3,
      compounding: 'annual',
      contributionTiming: 'end',
    });

    expect(result).not.toBeNull();
    expect(result.monthsToGoal).toBeGreaterThan(0);
    expect(result.finalBalance).toBeGreaterThanOrEqual(25000);
    expect(result.totalContributions).toBeGreaterThan(0);
  });

  it('TSG-U-3 returns null for unreachable inputs with no savings and no growth', () => {
    const result = calculateSavingsGoal({
      mode: 'time-to-goal',
      goalAmount: 25000,
      currentSavings: 0,
      monthlyContribution: 0,
      annualRate: 0,
      compounding: 'monthly',
      contributionTiming: 'end',
    });

    expect(result).toBeNull();
  });
});
