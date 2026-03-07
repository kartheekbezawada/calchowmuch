import { describe, expect, it } from 'vitest';
import {
  addFractions,
  divideFractions,
  evaluateFractionMode,
  gcd,
  improperToMixed,
  lcm,
  mixedToImproper,
  multiplyFractions,
  simplifyFraction,
  subtractFractions,
} from '../../../public/calculators/math/fraction-calculator/module.js';

describe('fraction calculator shared math helpers', () => {
  it('computes gcd and lcm for classroom fraction cases', () => {
    expect(gcd(12, 18)).toBe(6);
    expect(lcm(4, 6)).toBe(12);
  });

  it('adds fractions with unlike denominators', () => {
    expect(addFractions(1, 4, 1, 8)).toEqual({ numerator: 3, denominator: 8 });
  });

  it('subtracts fractions and keeps the negative sign in the numerator', () => {
    expect(subtractFractions(1, 4, 3, 4)).toEqual({ numerator: -1, denominator: 2 });
  });

  it('multiplies and simplifies fractions', () => {
    expect(multiplyFractions(2, 3, 3, 5)).toEqual({ numerator: 2, denominator: 5 });
  });

  it('divides by multiplying by the reciprocal', () => {
    expect(divideFractions(2, 3, 4, 5)).toEqual({ numerator: 5, denominator: 6 });
  });

  it('returns null when dividing by a zero-value fraction', () => {
    expect(divideFractions(2, 3, 0, 5)).toBeNull();
  });

  it('simplifies fractions and normalizes zero correctly', () => {
    expect(simplifyFraction(6, 8)).toEqual({ numerator: 3, denominator: 4 });
    expect(simplifyFraction(0, 9)).toEqual({ numerator: 0, denominator: 1 });
  });

  it('converts improper fractions to mixed numbers', () => {
    expect(improperToMixed(7, 3)).toEqual({ whole: 2, numerator: 1, denominator: 3 });
    expect(improperToMixed(-7, 3)).toEqual({ whole: -2, numerator: 1, denominator: 3 });
  });

  it('converts mixed numbers to improper fractions', () => {
    expect(mixedToImproper(1, 2, 5)).toEqual({ numerator: 7, denominator: 5 });
    expect(mixedToImproper(-1, 2, 5)).toEqual({ numerator: -7, denominator: 5 });
  });

  it('builds a plain-English validation state for invalid denominators', () => {
    const state = evaluateFractionMode('add', { num1: 1, den1: 0, num2: 1, den2: 8 });
    expect(state.teacherNote).toBe('A denominator cannot be zero.');
    expect(state.steps).toContain('Correct the input values and try again.');
  });

  it('builds convert mode output with both directions visible', () => {
    const state = evaluateFractionMode('convert', {
      impNum: 7,
      impDen: 3,
      mixWhole: 1,
      mixNum: 2,
      mixDen: 5,
    });
    expect(state.tiles[0]).toEqual({ label: 'Improper to mixed', value: '2 1/3' });
    expect(state.tiles[1]).toEqual({ label: 'Mixed to improper', value: '7/5' });
    expect(state.teacherNote).toContain('mixed number');
  });
});
