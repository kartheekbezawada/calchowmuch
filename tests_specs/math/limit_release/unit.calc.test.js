// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { LimitCalculator } from '../../../public/calculators/math/calculus/limit/logic.js';

describe('math/limit unit', () => {
  it('returns 14 for a direct substitution limit at x = 3', () => {
    const calculator = new LimitCalculator('x');
    const result = calculator.calculateLimit('x^2 + 2*x - 1', '3', 'both');

    expect(result.exists).toBe(true);
    expect(result.value).toBeCloseTo(14, 10);
    expect(result.continuous).toBe(true);
  });

  it('approximates the removable discontinuity limit of (x^2-1)/(x-1) at x = 1', () => {
    const calculator = new LimitCalculator('x');
    const result = calculator.calculateLimit('(x^2-1)/(x-1)', '1', 'both');

    expect(result.exists).toBe(true);
    expect(result.value).toBeCloseTo(2, 2);
  });
});
