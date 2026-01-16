import { describe, it, expect } from 'vitest';
import { sampleValues, getPaddedMinMax, buildPolyline } from '../../public/assets/js/core/graph-utils.js';

describe('graph utils', () => {
  it('samples values down to max points', () => {
    const values = Array.from({ length: 10 }, (_, i) => i + 1);
    const sampled = sampleValues(values, 4);
    expect(sampled.length).toBeLessThanOrEqual(5);
    expect(sampled[0]).toBe(1);
    expect(sampled.at(-1)).toBe(10);
  });

  it('pads min and max values', () => {
    const { min, max } = getPaddedMinMax([10, 20, 30], 0.1);
    expect(min).toBeLessThan(10);
    expect(max).toBeGreaterThan(30);
  });

  it('pads when min and max are equal', () => {
    const { min, max } = getPaddedMinMax([5, 5, 5], 0.1);
    expect(min).toBeLessThan(5);
    expect(max).toBeGreaterThan(5);
  });

  it('builds a polyline string', () => {
    const polyline = buildPolyline([0, 50, 100], 0, 100);
    expect(polyline.split(' ').length).toBe(3);
    expect(polyline).toContain(',');
  });
});
