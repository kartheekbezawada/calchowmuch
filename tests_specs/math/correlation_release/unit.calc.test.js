import { describe, expect, it } from 'vitest';
import {
  kendallCorrelation,
  pearsonCorrelation,
  spearmanCorrelation,
} from '../../../public/assets/js/core/advanced-statistics.js';

describe('Correlation Calculator - coefficient helpers', () => {
  it('returns a near-perfect positive Pearson correlation for a linear dataset', () => {
    const result = pearsonCorrelation([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
    expect(result.r).toBeCloseTo(1, 5);
    expect(result.pValue).toBeLessThan(0.01);
  });

  it('returns perfect rank-based correlation for monotonic data', () => {
    const spearman = spearmanCorrelation([1, 2, 3, 4, 5], [10, 20, 30, 40, 50]);
    const kendall = kendallCorrelation([1, 2, 3, 4], [2, 4, 6, 8]);
    expect(spearman.r).toBeCloseTo(1, 5);
    expect(kendall.tau).toBeCloseTo(1, 5);
  });
});
