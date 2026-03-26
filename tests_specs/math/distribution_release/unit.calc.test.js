import { describe, expect, it } from 'vitest';
import {
  fCdf,
  normalCdfCustom,
  normalQuantile,
  tCdf,
} from '../../../public/assets/js/core/advanced-statistics.js';

describe('Distribution Calculator - probability helpers', () => {
  it('returns stable normal cdf and quantile values', () => {
    expect(normalCdfCustom(1.96, 0, 1)).toBeCloseTo(0.975, 2);
    expect(normalQuantile(0.975)).toBeCloseTo(1.96, 1);
  });

  it('supports t and F distribution lookups', () => {
    expect(tCdf(0, 10)).toBeCloseTo(0.5, 5);
    expect(fCdf(1, 5, 10)).toBeGreaterThan(0.45);
    expect(fCdf(1, 5, 10)).toBeLessThan(0.55);
  });
});
