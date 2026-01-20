import { describe, it, expect } from 'vitest';
import {
  mean,
  median,
  mode,
  min,
  max,
  range,
  parseDataset,
} from '../../public/assets/js/core/stats.js';

/**
 * MMMR-TEST-U-1 - Mean Median Mode Range Unit Tests
 * Test descriptive statistics with known datasets
 */
describe('Mean Median Mode Range Calculator - MMMR-TEST-U-1: Statistics Calculations', () => {
  describe('Even count dataset: [1,2,3,4]', () => {
    const data = [1, 2, 3, 4];

    it('should calculate Mean = 2.5', () => {
      expect(mean(data)).toBe(2.5);
    });

    it('should calculate Median = 2.5 (average of middle values)', () => {
      expect(median(data)).toBe(2.5);
    });

    it('should return null for Mode (no repeating values)', () => {
      expect(mode(data)).toBe(null);
    });

    it('should calculate Range = 3 (4 - 1)', () => {
      expect(range(data)).toBe(3);
    });

    it('should find Min = 1', () => {
      expect(min(data)).toBe(1);
    });

    it('should find Max = 4', () => {
      expect(max(data)).toBe(4);
    });
  });

  describe('Odd count dataset: [1,2,3,4,5]', () => {
    const data = [1, 2, 3, 4, 5];

    it('should calculate Mean = 3', () => {
      expect(mean(data)).toBe(3);
    });

    it('should calculate Median = 3 (middle value)', () => {
      expect(median(data)).toBe(3);
    });

    it('should return null for Mode (no repeating values)', () => {
      expect(mode(data)).toBe(null);
    });

    it('should calculate Range = 4', () => {
      expect(range(data)).toBe(4);
    });
  });

  describe('Multiple modes dataset: [1,2,2,3,3]', () => {
    const data = [1, 2, 2, 3, 3];

    it('should calculate Mean = 2.2', () => {
      expect(mean(data)).toBeCloseTo(2.2);
    });

    it('should calculate Median = 2', () => {
      expect(median(data)).toBe(2);
    });

    it('should identify Modes = [2, 3] (bimodal)', () => {
      const result = mode(data);
      expect(result).toEqual([2, 3]);
    });

    it('should calculate Range = 2', () => {
      expect(range(data)).toBe(2);
    });
  });

  describe('Single value dataset: [5]', () => {
    const data = [5];

    it('should calculate Mean = 5', () => {
      expect(mean(data)).toBe(5);
    });

    it('should calculate Median = 5', () => {
      expect(median(data)).toBe(5);
    });

    it('should return null for Mode (single value)', () => {
      expect(mode(data)).toBe(null);
    });

    it('should calculate Range = 0', () => {
      expect(range(data)).toBe(0);
    });

    it('should find Min = Max = 5', () => {
      expect(min(data)).toBe(5);
      expect(max(data)).toBe(5);
    });
  });

  describe('Dataset with clear mode: [1,2,2,2,3,4]', () => {
    const data = [1, 2, 2, 2, 3, 4];

    it('should calculate correct Mean', () => {
      // (1+2+2+2+3+4) / 6 = 14/6 ≈ 2.333
      expect(mean(data)).toBeCloseTo(2.333, 2);
    });

    it('should calculate Median = 2 (average of 2 and 2)', () => {
      expect(median(data)).toBe(2);
    });

    it('should identify Mode = [2] (appears 3 times)', () => {
      expect(mode(data)).toEqual([2]);
    });

    it('should calculate Range = 3', () => {
      expect(range(data)).toBe(3);
    });
  });

  describe('Decimal dataset: [1.5, 2.5, 3.5, 4.5, 5.5]', () => {
    const data = [1.5, 2.5, 3.5, 4.5, 5.5];

    it('should calculate Mean = 3.5', () => {
      expect(mean(data)).toBe(3.5);
    });

    it('should calculate Median = 3.5', () => {
      expect(median(data)).toBe(3.5);
    });

    it('should calculate Range = 4', () => {
      expect(range(data)).toBe(4);
    });
  });

  describe('Negative numbers: [-5, -2, 0, 3, 8]', () => {
    const data = [-5, -2, 0, 3, 8];

    it('should calculate correct Mean', () => {
      // (-5 + -2 + 0 + 3 + 8) / 5 = 4/5 = 0.8
      expect(mean(data)).toBeCloseTo(0.8);
    });

    it('should calculate Median = 0', () => {
      expect(median(data)).toBe(0);
    });

    it('should calculate Range = 13 (8 - (-5))', () => {
      expect(range(data)).toBe(13);
    });

    it('should find Min = -5 and Max = 8', () => {
      expect(min(data)).toBe(-5);
      expect(max(data)).toBe(8);
    });
  });

  describe('Unsorted input: [9, 1, 5, 3, 7]', () => {
    const data = [9, 1, 5, 3, 7];

    it('should calculate Mean correctly regardless of order', () => {
      expect(mean(data)).toBe(5);
    });

    it('should calculate Median = 5 (sorts internally)', () => {
      expect(median(data)).toBe(5);
    });

    it('should find correct Min and Max', () => {
      expect(min(data)).toBe(1);
      expect(max(data)).toBe(9);
    });
  });
});

/**
 * MMMR-TEST-U-2 - Mean Median Mode Range Edge Cases
 * Test edge cases and validation
 */
describe('Mean Median Mode Range Calculator - MMMR-TEST-U-2: Edge Cases', () => {
  describe('Empty and invalid datasets', () => {
    it('should return null for empty array - mean', () => {
      expect(mean([])).toBe(null);
    });

    it('should return null for empty array - median', () => {
      expect(median([])).toBe(null);
    });

    it('should return null for empty array - mode', () => {
      expect(mode([])).toBe(null);
    });

    it('should return null for empty array - range', () => {
      expect(range([])).toBe(null);
    });

    it('should return null for non-array input', () => {
      expect(mean(null)).toBe(null);
      expect(median(undefined)).toBe(null);
      expect(mode('not an array')).toBe(null);
    });
  });

  describe('All identical values: [7, 7, 7, 7, 7]', () => {
    const data = [7, 7, 7, 7, 7];

    it('should calculate Mean = 7', () => {
      expect(mean(data)).toBe(7);
    });

    it('should calculate Median = 7', () => {
      expect(median(data)).toBe(7);
    });

    it('should identify Mode = [7]', () => {
      // All values are the same and appear more than once
      expect(mode(data)).toEqual([7]);
    });

    it('should calculate Range = 0', () => {
      expect(range(data)).toBe(0);
    });
  });

  describe('Two-value dataset: [10, 20]', () => {
    const data = [10, 20];

    it('should calculate Mean = 15', () => {
      expect(mean(data)).toBe(15);
    });

    it('should calculate Median = 15 (average of two)', () => {
      expect(median(data)).toBe(15);
    });

    it('should return null for Mode (no repeats)', () => {
      expect(mode(data)).toBe(null);
    });

    it('should calculate Range = 10', () => {
      expect(range(data)).toBe(10);
    });
  });

  describe('Large dataset handling', () => {
    it('should handle dataset of 1000 values', () => {
      const data = Array.from({ length: 1000 }, (_, i) => i + 1);

      // Mean of 1 to 1000 = 500.5
      expect(mean(data)).toBe(500.5);

      // Median of 1 to 1000 = (500 + 501) / 2 = 500.5
      expect(median(data)).toBe(500.5);

      // Range = 999
      expect(range(data)).toBe(999);
    });
  });

  describe('Decimal precision handling', () => {
    it('should maintain precision for small decimals', () => {
      const data = [0.001, 0.002, 0.003];
      expect(mean(data)).toBeCloseTo(0.002, 6);
    });

    it('should handle mixed integer and decimal', () => {
      const data = [1, 1.5, 2, 2.5, 3];
      expect(mean(data)).toBe(2);
      expect(median(data)).toBe(2);
    });
  });

  describe('parseDataset function', () => {
    it('should parse comma-separated values', () => {
      const result = parseDataset('1, 2, 3, 4, 5');
      expect(result.data).toEqual([1, 2, 3, 4, 5]);
      expect(result.errors).toEqual([]);
    });

    it('should parse space-separated values', () => {
      const result = parseDataset('1 2 3 4 5');
      expect(result.data).toEqual([1, 2, 3, 4, 5]);
      expect(result.errors).toEqual([]);
    });

    it('should parse newline-separated values', () => {
      const result = parseDataset('1\n2\n3\n4\n5');
      expect(result.data).toEqual([1, 2, 3, 4, 5]);
      expect(result.errors).toEqual([]);
    });

    it('should handle mixed separators', () => {
      const result = parseDataset('1, 2 3\n4, 5');
      expect(result.data).toEqual([1, 2, 3, 4, 5]);
      expect(result.errors).toEqual([]);
    });

    it('should trim whitespace', () => {
      const result = parseDataset('  1  ,  2  ,  3  ');
      expect(result.data).toEqual([1, 2, 3]);
      expect(result.errors).toEqual([]);
    });

    it('should report invalid values', () => {
      const result = parseDataset('1, 2, abc, 4, xyz');
      expect(result.data).toEqual([1, 2, 4]);
      expect(result.errors).toEqual(['abc', 'xyz']);
    });

    it('should handle empty input', () => {
      const result = parseDataset('');
      expect(result.data).toEqual([]);
      expect(result.errors).toEqual([]);
    });

    it('should handle null/undefined input', () => {
      expect(parseDataset(null).data).toEqual([]);
      expect(parseDataset(undefined).data).toEqual([]);
    });

    it('should parse negative numbers', () => {
      const result = parseDataset('-5, -3, 0, 3, 5');
      expect(result.data).toEqual([-5, -3, 0, 3, 5]);
      expect(result.errors).toEqual([]);
    });

    it('should parse decimal numbers', () => {
      const result = parseDataset('1.5, 2.7, 3.14');
      expect(result.data).toEqual([1.5, 2.7, 3.14]);
      expect(result.errors).toEqual([]);
    });

    it('should handle leading/trailing commas', () => {
      const result = parseDataset(',1, 2, 3,');
      expect(result.data).toEqual([1, 2, 3]);
      expect(result.errors).toEqual([]);
    });
  });

  describe('Multiple modes (multimodal)', () => {
    it('should identify trimodal dataset', () => {
      const data = [1, 1, 2, 2, 3, 3, 4];
      expect(mode(data)).toEqual([1, 2, 3]);
    });

    it('should handle all values appearing same frequency (> 1)', () => {
      const data = [1, 1, 2, 2, 3, 3];
      expect(mode(data)).toEqual([1, 2, 3]);
    });
  });

  describe('Outlier impact', () => {
    it('mean should be affected by outliers', () => {
      const normalData = [10, 11, 12, 13, 14];
      const withOutlier = [10, 11, 12, 13, 100];

      const normalMean = mean(normalData);
      const outlierMean = mean(withOutlier);

      // Normal mean = 12
      expect(normalMean).toBe(12);

      // Outlier mean = 29.2 (significantly higher)
      expect(outlierMean).toBeCloseTo(29.2);
      expect(outlierMean).toBeGreaterThan(normalMean * 2);
    });

    it('median should be robust to outliers', () => {
      const normalData = [10, 11, 12, 13, 14];
      const withOutlier = [10, 11, 12, 13, 100];

      const normalMedian = median(normalData);
      const outlierMedian = median(withOutlier);

      // Both medians = 12 (middle value)
      expect(normalMedian).toBe(12);
      expect(outlierMedian).toBe(12);
    });
  });
});
