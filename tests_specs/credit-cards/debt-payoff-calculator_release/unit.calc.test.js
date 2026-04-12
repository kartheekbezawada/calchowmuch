import { describe, expect, it } from 'vitest';
import {
  buildDebtPayoffViewModel,
  DEFAULT_DEBTS,
  simulateDebtPayoff,
  solveGoalPayment,
} from '../../../public/calculators/credit-card-calculators/debt-payoff-calculator/engine.js';

describe('debt-payoff-calculator strategy math', () => {
  it('clears the default debt set with snowball', () => {
    const result = simulateDebtPayoff({
      debts: DEFAULT_DEBTS,
      extraPayment: 120,
      strategy: 'snowball',
      baseDate: new Date(2026, 0, 1),
    });

    expect(result).not.toBeNull();
    expect(result?.months).toBeGreaterThan(0);
    expect(result?.debtFreeDate).not.toBeNull();
    expect(result?.schedule[0].startBalance).toBeGreaterThan(0);
  });

  it('keeps avalanche interest at or below snowball for the same balances', () => {
    const snowball = simulateDebtPayoff({
      debts: DEFAULT_DEBTS,
      extraPayment: 120,
      strategy: 'snowball',
      baseDate: new Date(2026, 0, 1),
    });
    const avalanche = simulateDebtPayoff({
      debts: DEFAULT_DEBTS,
      extraPayment: 120,
      strategy: 'avalanche',
      baseDate: new Date(2026, 0, 1),
    });

    expect(avalanche?.totalInterest).toBeLessThanOrEqual(snowball?.totalInterest || Infinity);
  });
});

describe('debt-payoff-calculator goal mode', () => {
  it('solves an extra payment for a target date', () => {
    const result = solveGoalPayment({
      debts: DEFAULT_DEBTS,
      strategy: 'snowball',
      baseDate: new Date(2026, 0, 1),
      targetDate: new Date(2027, 11, 1),
    });

    expect(result).not.toBeNull();
    expect(result?.totalMonthlyPayment).toBeGreaterThan(0);
  });
});

describe('debt-payoff-calculator view model', () => {
  it('returns comparison data, payoff order, and next-step links', () => {
    const result = buildDebtPayoffViewModel({
      debts: DEFAULT_DEBTS,
      extraPayment: 120,
      strategy: 'snowball',
      mode: 'standard',
      baseDate: new Date(2026, 0, 1),
    });

    expect(result?.chosen.series.length).toBeGreaterThan(1);
    expect(result?.comparison?.alternateStrategy).toBe('avalanche');
    expect(result?.planOrder).toEqual(
      expect.arrayContaining(['Store card', 'Travel rewards card', 'Medical plan'])
    );
    expect(result?.copySummary).toContain('$');
    expect(result?.nextSteps).toHaveLength(4);
  });
});
