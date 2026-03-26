// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { SymbolicIntegrator } from '../../../public/calculators/math/calculus/integral/logic.js';

describe('math/integral unit', () => {
  it('returns an antiderivative for x^2', () => {
    const integrator = new SymbolicIntegrator('x');
    const result = integrator.integrate('x^2');

    expect(result.integral).toBe('0.3333x^3 + C');
  });

  it('evaluates the definite integral of x^2 from 0 to 1', () => {
    const integrator = new SymbolicIntegrator('x');
    const result = integrator.integrate('x^2');

    expect(integrator.evaluateDefinite(result.terms, 0, 1)).toBeCloseTo(1 / 3, 10);
  });
});
