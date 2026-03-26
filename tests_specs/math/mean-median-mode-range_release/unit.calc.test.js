import { describe, expect, it } from 'vitest';
import {
  mean,
  median,
  mode,
  range,
  parseDataset,
} from '../../../public/assets/js/core/stats.js';

describe('math/mean-median-mode-range unit', () => {
  it('calculates the summary statistics for the default dataset', () => {
    const data = [12, 15, 18, 22, 15, 25, 18, 15];

    expect(mean(data)).toBeCloseTo(17.5);
    expect(median(data)).toBeCloseTo(16.5);
    expect(mode(data)).toEqual([15]);
    expect(range(data)).toBe(13);
  });

  it('parses mixed separators cleanly', () => {
    const result = parseDataset('1, 2\n3 4, 5');

    expect(result.data).toEqual([1, 2, 3, 4, 5]);
    expect(result.errors).toEqual([]);
  });
});
