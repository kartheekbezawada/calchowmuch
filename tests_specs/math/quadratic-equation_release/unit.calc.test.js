import { describe, expect, it } from 'vitest';
import { solveQuadratic } from '../../../public/assets/js/core/algebra.js';

describe('math/quadratic-equation unit', () => {
  it('returns two real roots for x^2 - 5x + 6 = 0', () => {
    const result = solveQuadratic(1, -5, 6);
    expect(result.type).toBe('two-real');
    expect(result.roots[0]).toBeCloseTo(3, 8);
    expect(result.roots[1]).toBeCloseTo(2, 8);
    expect(result.discriminant).toBeCloseTo(1, 8);
  });

  it('returns one repeated root when discriminant is zero', () => {
    const result = solveQuadratic(1, -2, 1);
    expect(result.type).toBe('one-real');
    expect(result.roots[0]).toBeCloseTo(1, 8);
    expect(result.discriminant).toBe(0);
  });

  it('returns complex roots when discriminant is negative', () => {
    const result = solveQuadratic(1, 0, 1);
    expect(result.type).toBe('complex');
    expect(result.roots[0].real).toBeCloseTo(0, 8);
    expect(result.roots[0].imaginary).toBeCloseTo(1, 8);
  });

  it('returns error when a is zero', () => {
    const result = solveQuadratic(0, 2, 1);
    expect(result.error).toContain('cannot be zero');
  });
});
