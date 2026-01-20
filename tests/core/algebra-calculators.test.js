import { describe, it, expect } from 'vitest';
import {
  addPolynomials,
  calculateSlopeDistance,
  coefficientsToArray,
  dividePolynomials,
  factorByGrouping,
  factorDifferenceOfSquares,
  factorQuadratic,
  factorSumDifferenceCubes,
  formatLinearFactor,
  formatPolynomial,
  formatPowerFactor,
  formatQuadraticFactor,
  parsePolynomial,
  solveQuadratic,
  solveSystem2x2,
  solveSystem3x3,
  subtractPolynomials,
  multiplyPolynomials,
} from '../../public/assets/js/core/algebra.js';

/**
 * ALG-TEST-U-1 - Quadratic solver unit tests
 */
describe('Algebra - ALG-TEST-U-1: Quadratic Solver', () => {
  it('handles two real roots', () => {
    const result = solveQuadratic(1, -5, 6);
    expect(result.type).toBe('two-real');
    const roots = result.roots.slice().sort((a, b) => a - b);
    expect(roots[0]).toBeCloseTo(2);
    expect(roots[1]).toBeCloseTo(3);
  });

  it('handles complex roots', () => {
    const result = solveQuadratic(1, 0, 1);
    expect(result.type).toBe('complex');
    expect(result.roots[0].real).toBeCloseTo(0);
    expect(Math.abs(result.roots[0].imaginary)).toBeCloseTo(1);
  });
});

/**
 * ALG-TEST-U-2 - System of equations unit tests
 */
describe('Algebra - ALG-TEST-U-2: Systems of Equations', () => {
  it('solves a 2x2 system', () => {
    const result = solveSystem2x2(1, 2, 5, 3, 4, 11);
    expect(result.type).toBe('unique');
    expect(result.solution.x).toBeCloseTo(1);
    expect(result.solution.y).toBeCloseTo(2);
  });

  it('solves a 3x3 system', () => {
    const result = solveSystem3x3(1, 0, 0, 1, 0, 1, 0, 2, 0, 0, 1, 3);
    expect(result.type).toBe('unique');
    expect(result.solution.x).toBeCloseTo(1);
    expect(result.solution.y).toBeCloseTo(2);
    expect(result.solution.z).toBeCloseTo(3);
  });
});

/**
 * ALG-TEST-U-3 - Polynomial operations unit tests
 */
describe('Algebra - ALG-TEST-U-3: Polynomial Operations', () => {
  it('adds and subtracts polynomials', () => {
    const p1 = parsePolynomial('2x^2 + 3x - 1').coeffs;
    const p2 = parsePolynomial('x^2 - x + 2').coeffs;
    const sum = coefficientsToArray(addPolynomials(p1, p2));
    const diff = coefficientsToArray(subtractPolynomials(p1, p2));
    expect(sum).toEqual([1, 2, 3]);
    expect(diff).toEqual([-3, 4, 1]);
  });

  it('multiplies polynomials', () => {
    const p1 = parsePolynomial('x + 2').coeffs;
    const p2 = parsePolynomial('x - 3').coeffs;
    const product = formatPolynomial(multiplyPolynomials(p1, p2));
    expect(product).toBe('x^2 - x - 6');
  });

  it('divides polynomials', () => {
    const dividend = parsePolynomial('x^2 - 1').coeffs;
    const divisor = parsePolynomial('x - 1').coeffs;
    const result = dividePolynomials(dividend, divisor);
    expect(formatPolynomial(result.quotient)).toBe('x + 1');
    expect(formatPolynomial(result.remainder)).toBe('0');
  });
});

/**
 * ALG-TEST-U-4 - Factoring calculator unit tests
 */
describe('Algebra - ALG-TEST-U-4: Factoring', () => {
  it('factors a quadratic', () => {
    const coeffs = parsePolynomial('x^2 + 5x + 6').coeffs;
    const result = factorQuadratic(coeffs);
    const factors = result.factors.map((factor) => formatLinearFactor(factor)).sort();
    expect(factors).toEqual(['(x + 2)', '(x + 3)']);
  });

  it('factors a difference of squares', () => {
    const coeffs = parsePolynomial('x^2 - 9').coeffs;
    const result = factorDifferenceOfSquares(coeffs);
    const factors = result.factors.map((factor) => formatPowerFactor(factor)).sort();
    expect(factors).toEqual(['(x + 3)', '(x - 3)'].sort());
  });

  it('factors a difference of cubes', () => {
    const coeffs = parsePolynomial('x^3 - 8').coeffs;
    const result = factorSumDifferenceCubes(coeffs);
    const linear = formatLinearFactor(result.factors[0]);
    const quadratic = formatQuadraticFactor(result.factors[1]);
    expect(linear).toBe('(x - 2)');
    expect(quadratic).toBe('(x^2 + 2x + 4)');
  });

  it('factors by grouping', () => {
    const coeffs = parsePolynomial('x^3 + 3x^2 + 2x + 6').coeffs;
    const result = factorByGrouping(coeffs);
    const quadratic = formatQuadraticFactor(result.factors[0]);
    const linear = formatLinearFactor(result.factors[1]);
    expect(quadratic).toBe('(x^2 + 2)');
    expect(linear).toBe('(x + 3)');
  });
});

/**
 * ALG-TEST-U-5 - Slope & distance unit tests
 */
describe('Algebra - ALG-TEST-U-5: Slope & Distance', () => {
  it('calculates slope, distance, and midpoint', () => {
    const result = calculateSlopeDistance(1, 2, 4, 8);
    expect(result.slope).toBeCloseTo(2);
    expect(result.distance).toBeCloseTo(Math.sqrt(45));
    expect(result.midpoint.x).toBeCloseTo(2.5);
    expect(result.midpoint.y).toBeCloseTo(5);
  });

  it('handles vertical lines', () => {
    const result = calculateSlopeDistance(3, 1, 3, 5);
    expect(result.slope).toBe(null);
  });
});
