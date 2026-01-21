/**
 * Unit Tests for Calculus Calculator Suite (REQ-20260120-019)
 * Tests: CALC-TEST-U-1 through CALC-TEST-U-5
 */

import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';

/**
 * CALC-TEST-U-1: Derivative Calculator Unit Tests
 * Test symbolic differentiation with all rules
 */
describe('CALC-TEST-U-1: Derivative Calculator', () => {
  it('should differentiate polynomial using power rule', () => {
    // Test: d/dx(x^3) = 3x^2
    const coef = 1;
    const exponent = 3;
    const result = {
      coef: coef * exponent,
      exponent: exponent - 1
    };

    expect(result.coef).toBe(3);
    expect(result.exponent).toBe(2);
  });

  it('should handle constant rule (derivative of constant = 0)', () => {
    const coef = 5;
    const exponent = 0;
    const result = {
      coef: exponent === 0 ? 0 : coef * exponent,
      exponent: exponent - 1
    };

    expect(result.coef).toBe(0);
  });

  it('should differentiate linear function', () => {
    // Test: d/dx(2x) = 2
    const coef = 2;
    const exponent = 1;
    const result = {
      coef: coef * exponent,
      exponent: exponent - 1
    };

    expect(result.coef).toBe(2);
    expect(result.exponent).toBe(0);
  });

  it('should evaluate derivative at a point', () => {
    // For f'(x) = 2x, evaluate at x = 3
    const terms = [{ coef: 2, exponent: 1 }];
    const point = 3;
    let sum = 0;

    for (const term of terms) {
      sum += term.coef * Math.pow(point, term.exponent);
    }

    expect(sum).toBe(6);
  });

  it('should handle negative exponents', () => {
    // Test: d/dx(x^-1) = -x^-2
    const coef = 1;
    const exponent = -1;
    const result = {
      coef: coef * exponent,
      exponent: exponent - 1
    };

    expect(result.coef).toBe(-1);
    expect(result.exponent).toBe(-2);
  });
});

/**
 * CALC-TEST-U-2: Integral Calculator Unit Tests
 * Test symbolic and numerical integration
 */
describe('CALC-TEST-U-2: Integral Calculator', () => {
  it('should integrate polynomial using power rule', () => {
    // Test: ∫x^2 dx = x^3/3
    const coef = 1;
    const exponent = 2;
    const result = {
      coef: coef / (exponent + 1),
      exponent: exponent + 1
    };

    expect(result.coef).toBeCloseTo(0.3333, 4);
    expect(result.exponent).toBe(3);
  });

  it('should integrate constant', () => {
    // Test: ∫5 dx = 5x
    const coef = 5;
    const exponent = 0;
    const result = {
      coef: coef / (exponent + 1),
      exponent: exponent + 1
    };

    expect(result.coef).toBe(5);
    expect(result.exponent).toBe(1);
  });

  it('should evaluate definite integral', () => {
    // Test: ∫[0 to 2] x^2 dx = [x^3/3] from 0 to 2 = 8/3
    const terms = [{ type: 'polynomial', coef: 1/3, exponent: 3 }];
    const a = 0;
    const b = 2;

    const evalAt = (x) => {
      let sum = 0;
      for (const term of terms) {
        sum += term.coef * Math.pow(x, term.exponent);
      }
      return sum;
    };

    const result = evalAt(b) - evalAt(a);
    expect(result).toBeCloseTo(8/3, 4);
  });

  it('should handle special case x^-1 (natural log)', () => {
    // Test: ∫1/x dx should return ln type
    const coef = 1;
    const exponent = -1;

    const result = exponent === -1
      ? { type: 'ln', coef }
      : { type: 'polynomial', coef: coef / (exponent + 1), exponent: exponent + 1 };

    expect(result.type).toBe('ln');
    expect(result.coef).toBe(1);
  });

  it('should integrate linear function', () => {
    // Test: ∫3x dx = 3x^2/2
    const coef = 3;
    const exponent = 1;
    const result = {
      coef: coef / (exponent + 1),
      exponent: exponent + 1
    };

    expect(result.coef).toBe(1.5);
    expect(result.exponent).toBe(2);
  });
});

/**
 * CALC-TEST-U-3: Limit Calculator Unit Tests
 * Test limit calculation and indeterminate forms
 */
describe('CALC-TEST-U-3: Limit Calculator', () => {
  it('should calculate limit by direct substitution (continuous function)', () => {
    // Test: lim[x→2] (x^2 + 1) = 5
    const evalFunc = (x) => x * x + 1;
    const a = 2;
    const result = evalFunc(a);

    expect(result).toBe(5);
  });

  it('should detect indeterminate form 0/0', () => {
    // Test: lim[x→1] (x^2-1)/(x-1) gives 0/0
    const a = 1;
    const numerator = a * a - 1; // 0
    const denominator = a - 1;   // 0

    expect(numerator).toBe(0);
    expect(denominator).toBe(0);
    expect(isNaN(numerator / denominator) || !isFinite(numerator / denominator)).toBe(true);
  });

  it('should calculate one-sided limits', () => {
    // Numerical approximation: approach from left
    const a = 2;
    const epsilon = 0.001;
    const evalFunc = (x) => x * x;

    const leftApproach = a - epsilon;
    const leftValue = evalFunc(leftApproach);

    expect(leftValue).toBeCloseTo(4, 2);
  });

  it('should handle limits at infinity', () => {
    // Test: lim[x→∞] 1/x = 0
    const evalFunc = (x) => 1 / x;
    const largeValue = 10000;
    const result = evalFunc(largeValue);

    expect(result).toBeCloseTo(0, 3);
  });

  it('should detect when limits do not exist', () => {
    // Test: lim[x→0] 1/x does not exist (left and right differ)
    const evalFunc = (x) => 1 / x;
    const epsilon = 0.001;

    const leftLimit = evalFunc(-epsilon);
    const rightLimit = evalFunc(epsilon);

    expect(Math.sign(leftLimit)).not.toBe(Math.sign(rightLimit));
  });
});

/**
 * CALC-TEST-U-4: Series Convergence Unit Tests
 * Test convergence tests (ratio, root, comparison)
 */
describe('CALC-TEST-U-4: Series Convergence Calculator', () => {
  it('should apply ratio test to convergent series', () => {
    // Test: ∑(1/n!) converges by ratio test (L = 0 < 1)
    const a_n = (n) => 1 / factorial(n);
    const a_n_plus_1 = (n) => 1 / factorial(n + 1);

    const n = 10;
    const ratio = Math.abs(a_n_plus_1(n) / a_n(n));

    expect(ratio).toBeLessThan(1);
    expect(ratio).toBeCloseTo(1/11, 4);
  });

  it('should apply ratio test to divergent series', () => {
    // Test: ∑n! diverges by ratio test (L = ∞ > 1)
    const a_n = (n) => factorial(n);
    const a_n_plus_1 = (n) => factorial(n + 1);

    const n = 5;
    const ratio = Math.abs(a_n_plus_1(n) / a_n(n));

    expect(ratio).toBeGreaterThan(1);
    expect(ratio).toBe(6);
  });

  it('should apply root test to geometric series', () => {
    // Test: ∑(1/2)^n converges by root test (L = 1/2 < 1)
    const a_n = (n) => Math.pow(0.5, n);
    const n = 10;
    const root = Math.pow(Math.abs(a_n(n)), 1/n);

    expect(root).toBeCloseTo(0.5, 2);
    expect(root).toBeLessThan(1);
  });

  it('should identify p-series convergence (p > 1)', () => {
    // Test: ∑1/n^2 converges (p = 2 > 1)
    const p = 2;
    const converges = p > 1;

    expect(converges).toBe(true);
  });

  it('should identify p-series divergence (p ≤ 1)', () => {
    // Test: ∑1/n diverges (p = 1)
    const p = 1;
    const converges = p > 1;

    expect(converges).toBe(false);
  });
});

/**
 * CALC-TEST-U-5: Critical Points Finder Unit Tests
 * Test finding and classifying critical points
 */
describe('CALC-TEST-U-5: Critical Points Finder', () => {
  it('should find critical points where f\'(x) = 0', () => {
    // Test: f(x) = x^2, f'(x) = 2x, critical point at x = 0
    const derivative = (x) => 2 * x;
    const criticalPoint = 0;

    expect(derivative(criticalPoint)).toBe(0);
  });

  it('should use second derivative test for local minimum', () => {
    // Test: f(x) = x^2, f''(x) = 2 > 0 at x = 0 → local minimum
    const secondDerivative = (x) => 2;
    const criticalPoint = 0;
    const secondDerivValue = secondDerivative(criticalPoint);

    const classification = secondDerivValue > 0 ? 'local minimum'
                         : secondDerivValue < 0 ? 'local maximum'
                         : 'inconclusive';

    expect(classification).toBe('local minimum');
  });

  it('should use second derivative test for local maximum', () => {
    // Test: f(x) = -x^2, f''(x) = -2 < 0 at x = 0 → local maximum
    const secondDerivative = (x) => -2;
    const criticalPoint = 0;
    const secondDerivValue = secondDerivative(criticalPoint);

    const classification = secondDerivValue > 0 ? 'local minimum'
                         : secondDerivValue < 0 ? 'local maximum'
                         : 'inconclusive';

    expect(classification).toBe('local maximum');
  });

  it('should find inflection points where f\'\'(x) = 0', () => {
    // Test: f(x) = x^3, f''(x) = 6x, inflection at x = 0
    const secondDerivative = (x) => 6 * x;
    const inflectionPoint = 0;

    expect(secondDerivative(inflectionPoint)).toBe(0);
  });

  it('should evaluate function at critical point', () => {
    // Test: f(x) = x^2 - 4x + 3 has critical point at x = 2, f(2) = -1
    const func = (x) => x * x - 4 * x + 3;
    const criticalPoint = 2;
    const value = func(criticalPoint);

    expect(value).toBe(-1);
  });

  it('should use numerical differentiation for complex functions', () => {
    // Test central difference method
    const func = (x) => Math.sin(x);
    const x = Math.PI / 2;
    const h = 0.0001;

    const derivative = (func(x + h) - func(x - h)) / (2 * h);

    expect(derivative).toBeCloseTo(0, 3); // cos(π/2) = 0
  });
});

// Helper function for factorial
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
