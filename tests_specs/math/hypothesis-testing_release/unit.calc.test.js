import { describe, expect, it } from 'vitest';
import {
  chiSquareGoodnessOfFit,
  oneSampleTTest,
} from '../../../public/assets/js/core/advanced-statistics.js';

describe('Hypothesis Testing - test helpers', () => {
  it('returns a usable one-sample t-test result', () => {
    const result = oneSampleTTest([105, 98, 102, 110, 95, 103, 107, 101], 100, 'two-sided');
    expect(result.tStatistic).toBeDefined();
    expect(result.pValue).toBeGreaterThan(0);
    expect(result.confidenceInterval.lower).toBeLessThan(result.confidenceInterval.upper);
  });

  it('returns a chi-square goodness-of-fit summary', () => {
    const result = chiSquareGoodnessOfFit([50, 30, 20], [40, 35, 25]);
    expect(result.chiSquare).toBeGreaterThan(0);
    expect(result.pValue).toBeLessThan(0.2);
  });
});
