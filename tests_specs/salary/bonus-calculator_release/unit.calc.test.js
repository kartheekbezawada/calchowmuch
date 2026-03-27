import { describe, expect, it } from 'vitest';
import { calculateBonus } from '../../../public/calculators/salary-calculators/shared/salary-utils.js';

describe('Bonus Calculator', () => {
  it('BONUS-TEST-U-1: calculates bonus in percent mode', () => {
    const result = calculateBonus({ salaryAmount: 60000, mode: 'percent', bonusPercent: 10 });

    expect(result).not.toBeNull();
    expect(result?.bonusAmount).toBeCloseTo(6000, 8);
    expect(result?.totalCompensation).toBeCloseTo(66000, 8);
    expect(result?.bonusPercent).toBeCloseTo(10, 8);
  });

  it('BONUS-TEST-U-2: calculates bonus in amount mode', () => {
    const result = calculateBonus({ salaryAmount: 60000, mode: 'amount', bonusAmount: 8000 });

    expect(result).not.toBeNull();
    expect(result?.totalCompensation).toBeCloseTo(68000, 8);
    expect(result?.bonusPercent).toBeCloseTo(13.3333333, 6);
  });
});
