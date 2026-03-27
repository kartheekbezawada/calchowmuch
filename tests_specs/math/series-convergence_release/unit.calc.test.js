import { describe, expect, it } from 'vitest';
import { SeriesAnalyzer } from '../../../public/calculators/math/calculus/series-convergence/module.js';

describe('math/series-convergence unit', () => {
  it('marks n/2^n as convergent under the ratio test', () => {
    const analyzer = new SeriesAnalyzer('n/2^n');
    const result = analyzer.ratioTest();

    expect(result.conclusion).toBe('converges');
    expect(result.limit).toBeLessThan(1);
  });

  it('marks 2^n as divergent under the ratio test', () => {
    const analyzer = new SeriesAnalyzer('2^n');
    const result = analyzer.ratioTest();

    expect(result.conclusion).toBe('diverges');
    expect(result.limit).toBeGreaterThan(1);
  });
});
