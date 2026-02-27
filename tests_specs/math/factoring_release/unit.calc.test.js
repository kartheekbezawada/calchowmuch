import { describe, expect, it } from 'vitest';
import {
  factorDifferenceOfSquares,
  factorQuadratic,
  parsePolynomial,
} from '../../../public/assets/js/core/algebra.js';

describe('math/factoring unit', () => {
  it('factors x^2 + 5x + 6 into two linear factors', () => {
    const parsed = parsePolynomial('x^2 + 5x + 6');
    const result = factorQuadratic(parsed.coeffs);
    expect(result).toBeTruthy();
    expect(result.factors).toHaveLength(2);
  });

  it('detects difference of squares for x^2 - 9', () => {
    const parsed = parsePolynomial('x^2 - 9');
    const result = factorDifferenceOfSquares(parsed.coeffs);
    expect(result).toBeTruthy();
    expect(result.factors).toHaveLength(2);
  });

  it('reports parsing errors for malformed expression', () => {
    const parsed = parsePolynomial('x^^2 + 5x');
    expect(parsed.errors.length).toBeGreaterThan(0);
  });
});
