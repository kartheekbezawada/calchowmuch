import { describe, expect, it } from 'vitest';
import {
  analyzeSequence,
  generateSequenceTerms,
  nthTermArithmetic,
  nthTermGeometric,
  sumArithmetic,
  sumGeometric,
} from '../../../public/assets/js/core/stats.js';

describe('Number Sequence Calculator - arithmetic and geometric helpers', () => {
  it('detects arithmetic defaults and computes the nth term and sum', () => {
    const result = analyzeSequence([2, 4, 6, 8, 10]);
    expect(result.type).toBe('arithmetic');
    expect(result.difference).toBe(2);
    expect(nthTermArithmetic(2, 2, 10)).toBe(20);
    expect(sumArithmetic(2, 2, 10)).toBe(110);
  });

  it('handles geometric growth and preview generation', () => {
    const result = analyzeSequence([2, 6, 18, 54]);
    expect(result.type).toBe('geometric');
    expect(result.ratio).toBe(3);
    expect(nthTermGeometric(2, 3, 5)).toBe(162);
    expect(sumGeometric(2, 3, 5)).toBe(242);
    expect(generateSequenceTerms(2, 3, 5, 'geometric')).toEqual([2, 6, 18, 54, 162]);
  });
});
