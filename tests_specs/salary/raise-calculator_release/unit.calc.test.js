import { describe, expect, it } from 'vitest';
import { calculateRaise } from '../../../public/calculators/salary-calculators/shared/salary-utils.js';

describe('Raise Calculator', () => {
  it('RAISE-TEST-U-1: calculates raise in percent mode', () => {
    const result = calculateRaise({ currentSalary: 60000, mode: 'percent', raisePercent: 5 });

    expect(result).not.toBeNull();
    expect(result?.raiseAmount).toBeCloseTo(3000, 8);
    expect(result?.newSalary).toBeCloseTo(63000, 8);
    expect(result?.percentIncrease).toBeCloseTo(5, 8);
  });

  it('RAISE-TEST-U-2: calculates raise in amount mode', () => {
    const result = calculateRaise({ currentSalary: 60000, mode: 'amount', raiseAmount: 4000 });

    expect(result).not.toBeNull();
    expect(result?.newSalary).toBeCloseTo(64000, 8);
    expect(result?.percentIncrease).toBeCloseTo(6.6666667, 6);
  });
});
