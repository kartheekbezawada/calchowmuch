import { describe, expect, it } from 'vitest';
import { calculateMultipleCarLoan } from '../../../public/assets/js/core/auto-loan-utils.js';

describe('auto-loans/multiple-car-loan unit', () => {
  it('combines monthly payments and total interest across two loans', () => {
    const result = calculateMultipleCarLoan({
      loanA: { amount: 18000, apr: 5.5, termYears: 4 },
      loanB: { amount: 12000, apr: 7.2, termYears: 5 },
    });

    expect(result.loanA.totalInterest).toBeGreaterThan(0);
    expect(result.loanB.totalInterest).toBeGreaterThan(0);
    expect(result.combined.monthlyPayment).toBeCloseTo(
      result.loanA.monthlyPayment + result.loanB.monthlyPayment,
      2
    );
  });
});
