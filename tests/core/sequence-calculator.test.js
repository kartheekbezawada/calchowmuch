import { describe, it, expect } from 'vitest';
import {
  analyzeSequence,
  nthTermArithmetic,
  nthTermGeometric,
  sumArithmetic,
  sumGeometric,
} from '../../public/assets/js/core/stats.js';

/**
 * SEQ-TEST-U-1 - Sequence detection tests
 */
describe('Number Sequence - SEQ-TEST-U-1: Detection', () => {
  it('detects arithmetic sequences', () => {
    const result = analyzeSequence([2, 4, 6, 8]);
    expect(result.type).toBe('arithmetic');
    expect(result.difference).toBe(2);
  });

  it('detects geometric sequences', () => {
    const result = analyzeSequence([3, 6, 12, 24]);
    expect(result.type).toBe('geometric');
    expect(result.ratio).toBe(2);
  });

  it('detects constant sequences', () => {
    const result = analyzeSequence([5, 5, 5, 5]);
    expect(result.type).toBe('constant');
    expect(result.difference).toBe(0);
    expect(result.ratio).toBe(1);
  });
});

/**
 * SEQ-TEST-U-2 - Sequence calculation tests
 */
describe('Number Sequence - SEQ-TEST-U-2: Calculations', () => {
  it('calculates arithmetic nth term and sum', () => {
    expect(nthTermArithmetic(2, 3, 5)).toBe(14);
    expect(sumArithmetic(2, 3, 5)).toBe(40);
  });

  it('calculates geometric nth term and sum', () => {
    expect(nthTermGeometric(2, 2, 6)).toBe(64);
    expect(sumGeometric(2, 2, 4)).toBe(30);
  });
});
