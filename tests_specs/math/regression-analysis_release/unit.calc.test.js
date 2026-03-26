import { describe, expect, it } from 'vitest';
import {
  exponentialRegression,
  linearRegression,
  logarithmicRegression,
  polynomialRegression,
} from '../../../public/assets/js/core/advanced-statistics.js';

describe('Regression Analysis - model helpers', () => {
  it('fits a strong linear model for line-shaped data', () => {
    const result = linearRegression([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
    expect(result.slope).toBeCloseTo(2, 5);
    expect(result.intercept).toBeCloseTo(0, 5);
    expect(result.rSquared).toBeCloseTo(1, 5);
  });

  it('supports polynomial, exponential, and logarithmic fits', () => {
    const polynomial = polynomialRegression([1, 2, 3, 4], [1, 4, 9, 16], 2);
    const exponential = exponentialRegression([1, 2, 3, 4], [2, 4, 8, 16]);
    const logarithmic = logarithmicRegression([1, 2, 4, 8], [0, 1, 2, 3]);
    expect(polynomial.rSquared).toBeCloseTo(1, 5);
    expect(exponential.rSquared).toBeGreaterThan(0.99);
    expect(logarithmic.rSquared).toBeGreaterThan(0.99);
  });
});
