import { describe, expect, it } from 'vitest';
import {
  addPolynomials,
  dividePolynomials,
  multiplyPolynomials,
  parsePolynomial,
  subtractPolynomials,
} from '../../../public/assets/js/core/algebra.js';

describe('math/polynomial-operations unit', () => {
  it('adds two polynomials correctly', () => {
    const p1 = parsePolynomial('2x^2 + 3x - 1').coeffs;
    const p2 = parsePolynomial('x^2 - x + 2').coeffs;
    const result = addPolynomials(p1, p2);
    expect(result[2]).toBeCloseTo(3, 8);
    expect(result[1]).toBeCloseTo(2, 8);
    expect(result[0]).toBeCloseTo(1, 8);
  });

  it('subtracts and multiplies polynomials correctly', () => {
    const p1 = parsePolynomial('x + 1').coeffs;
    const p2 = parsePolynomial('x - 1').coeffs;
    const sub = subtractPolynomials(p1, p2);
    const mul = multiplyPolynomials(p1, p2);
    expect(sub[0]).toBeCloseTo(2, 8);
    expect(sub[1] ?? 0).toBeCloseTo(0, 8);
    expect(mul[2]).toBeCloseTo(1, 8);
    expect(mul[1] ?? 0).toBeCloseTo(0, 8);
    expect(mul[0]).toBeCloseTo(-1, 8);
  });

  it('returns null on divide by zero polynomial', () => {
    const dividend = parsePolynomial('x^2 + 1').coeffs;
    const divisor = parsePolynomial('0').coeffs;
    const division = dividePolynomials(dividend, divisor);
    expect(division).toBeNull();
  });
});
