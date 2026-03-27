import { describe, expect, it } from 'vitest';
import { oneWayAnova } from '../../../public/assets/js/core/advanced-statistics.js';

describe('ANOVA Calculator - variance helpers', () => {
  it('returns a significant result for clearly separated groups', () => {
    const result = oneWayAnova([
      [23, 25, 27, 22, 24],
      [30, 32, 28, 31, 29],
      [18, 20, 22, 19, 21],
    ]);

    expect(result.fStatistic).toBeGreaterThan(20);
    expect(result.pValue).toBeLessThan(0.01);
    expect(result.etaSquared).toBeGreaterThan(0.5);
  });
});
