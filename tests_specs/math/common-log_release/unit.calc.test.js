import { describe, expect, it } from 'vitest';
import { calculateLogBase, calculateLogChangeOfBase } from '../../../public/assets/js/core/logarithm.js';

describe('math/common-log unit', () => {
  it('returns 2 for log base 10 of 100', () => {
    expect(calculateLogBase(100, 10)).toBeCloseTo(2, 10);
  });

  it('computes change-of-base results for a custom base', () => {
    const result = calculateLogChangeOfBase(25, 5, 10);
    expect(result?.fromValue).toBeCloseTo(2, 10);
    expect(result?.toValue).toBeCloseTo(Math.log10(25), 10);
  });
});
