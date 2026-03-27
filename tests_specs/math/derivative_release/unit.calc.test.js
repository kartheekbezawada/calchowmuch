// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { SymbolicDifferentiator } from '../../../public/calculators/math/calculus/derivative/logic.js';

describe('math/derivative unit', () => {
  it('returns 2x + 3 for x^2 + 3*x + 5', () => {
    const differentiator = new SymbolicDifferentiator('x');
    const result = differentiator.differentiate('x^2+3*x+5', 1);

    expect(result.derivative).toBe('2x + 3');
  });

  it('evaluates the derivative at x = 2', () => {
    const differentiator = new SymbolicDifferentiator('x');
    const result = differentiator.differentiate('x^2+3*x+5', 1);

    expect(differentiator.evaluateAt(result.terms, 2)).toBeCloseTo(7, 10);
  });
});
