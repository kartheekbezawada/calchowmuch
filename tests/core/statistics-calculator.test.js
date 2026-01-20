import { describe, it, expect } from 'vitest';
import {
  sum,
  mean,
  median,
  mode,
  min,
  max,
  range,
  variance,
  standardDeviation,
  parseDataset,
} from '../../public/assets/js/core/stats.js';

/**
 * STATS-TEST-U-1 - Comprehensive Statistics Unit Tests
 * Test complete statistical analysis with known dataset: [1,2,3,4,5,6,7,8,9,10]
 */
describe('Statistics Calculator - STATS-TEST-U-1: Comprehensive Analysis', () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  describe('All descriptive statistics calculation', () => {
    it('should calculate sum correctly', () => {
      const result = sum(data);
      expect(result).toBe(55); // 1+2+3+4+5+6+7+8+9+10 = 55
    });

    it('should calculate mean correctly', () => {
      const result = mean(data);
      expect(result).toBe(5.5); // 55 / 10 = 5.5
    });

    it('should calculate median correctly', () => {
      const result = median(data);
      expect(result).toBe(5.5); // (5 + 6) / 2 = 5.5
    });

    it('should calculate mode correctly (no mode)', () => {
      const result = mode(data);
      expect(result).toBe(null); // All values appear once
    });

    it('should calculate min correctly', () => {
      const result = min(data);
      expect(result).toBe(1);
    });

    it('should calculate max correctly', () => {
      const result = max(data);
      expect(result).toBe(10);
    });

    it('should calculate range correctly', () => {
      const result = range(data);
      expect(result).toBe(9); // 10 - 1 = 9
    });
  });

  describe('Variance and standard deviation', () => {
    it('should calculate population variance correctly', () => {
      const result = variance(data, false);
      // Variance = sum((x - mean)²) / n
      // = [(1-5.5)² + (2-5.5)² + ... + (10-5.5)²] / 10
      // = [20.25 + 12.25 + 6.25 + 2.25 + 0.25 + 0.25 + 2.25 + 6.25 + 12.25 + 20.25] / 10
      // = 82.5 / 10 = 8.25
      expect(result).toBe(8.25);
    });

    it('should calculate sample variance correctly', () => {
      const result = variance(data, true);
      // Sample variance = 82.5 / 9 = 9.166...
      expect(result).toBeCloseTo(9.1667, 4);
    });

    it('should calculate population standard deviation correctly', () => {
      const result = standardDeviation(data, false);
      // σ = sqrt(8.25) = 2.872...
      expect(result).toBeCloseTo(2.8723, 4);
    });

    it('should calculate sample standard deviation correctly', () => {
      const result = standardDeviation(data, true);
      // s = sqrt(9.1667) = 3.027...
      expect(result).toBeCloseTo(3.0277, 4);
    });
  });

  describe('Different data patterns', () => {
    it('should handle odd-count dataset', () => {
      const oddData = [1, 3, 5, 7, 9];
      expect(median(oddData)).toBe(5);
      expect(mean(oddData)).toBe(5);
    });

    it('should handle even-count dataset', () => {
      const evenData = [2, 4, 6, 8];
      expect(median(evenData)).toBe(5); // (4 + 6) / 2
      expect(mean(evenData)).toBe(5); // 20 / 4
    });

    it('should handle single mode', () => {
      const dataWithMode = [1, 2, 2, 3, 4];
      expect(mode(dataWithMode)).toEqual([2]);
    });

    it('should handle multiple modes (bimodal)', () => {
      const bimodalData = [1, 2, 2, 3, 3, 4];
      const result = mode(bimodalData);
      expect(result).toEqual([2, 3]);
    });
  });
});

/**
 * STATS-TEST-U-2 - Statistics Edge Cases
 * Test comprehensive edge cases
 */
describe('Statistics Calculator - STATS-TEST-U-2: Edge Cases', () => {
  describe('Multimodal distributions', () => {
    it('should identify trimodal distribution', () => {
      const data = [1, 1, 2, 2, 3, 3, 4];
      const result = mode(data);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return null for no mode (all unique)', () => {
      const data = [10, 20, 30, 40, 50];
      const result = mode(data);
      expect(result).toBe(null);
    });

    it('should handle all values equal (single mode)', () => {
      const data = [5, 5, 5, 5];
      const result = mode(data);
      expect(result).toEqual([5]);
    });
  });

  describe('Highly skewed data', () => {
    it('should handle right-skewed data', () => {
      const data = [1, 2, 2, 3, 3, 3, 100];
      const dataMean = mean(data);
      const dataMedian = median(data);

      // In right-skewed data, mean > median
      expect(dataMean).toBeGreaterThan(dataMedian);
      expect(dataMean).toBeCloseTo(16.2857, 4);
      expect(dataMedian).toBe(3);
    });

    it('should handle left-skewed data', () => {
      const data = [1, 97, 98, 98, 99, 99, 99];
      const dataMean = mean(data);
      const dataMedian = median(data);

      // In left-skewed data, mean < median
      expect(dataMean).toBeLessThan(dataMedian);
      expect(dataMean).toBeCloseTo(84.4286, 4);
      expect(dataMedian).toBe(98);
    });
  });

  describe('Data with extreme outliers', () => {
    it('outliers should affect mean more than median', () => {
      const normalData = [10, 11, 12, 13, 14];
      const dataWithOutlier = [10, 11, 12, 13, 1000];

      const normalMean = mean(normalData);
      const normalMedian = median(normalData);
      const outlierMean = mean(dataWithOutlier);
      const outlierMedian = median(dataWithOutlier);

      expect(normalMean).toBe(12);
      expect(normalMedian).toBe(12);
      expect(outlierMean).toBeCloseTo(209.2, 1);
      expect(outlierMedian).toBe(12); // Median unchanged
    });

    it('outliers should significantly increase range', () => {
      const normalData = [10, 11, 12, 13, 14];
      const dataWithOutlier = [10, 11, 12, 13, 100];

      expect(range(normalData)).toBe(4);
      expect(range(dataWithOutlier)).toBe(90);
    });
  });

  describe('Mixed positive/negative datasets', () => {
    it('should handle mixed positive and negative numbers', () => {
      const data = [-10, -5, 0, 5, 10];

      expect(sum(data)).toBe(0);
      expect(mean(data)).toBe(0);
      expect(median(data)).toBe(0);
      expect(min(data)).toBe(-10);
      expect(max(data)).toBe(10);
      expect(range(data)).toBe(20);
    });

    it('should handle all negative numbers', () => {
      const data = [-50, -40, -30, -20, -10];

      expect(mean(data)).toBe(-30);
      expect(median(data)).toBe(-30);
      expect(range(data)).toBe(40);
    });

    it('should calculate standard deviation for negative numbers', () => {
      const data = [-5, -3, -1, 1, 3, 5];
      const stdDev = standardDeviation(data, false);

      expect(mean(data)).toBe(0);
      expect(stdDev).toBeCloseTo(3.4157, 4);
    });
  });

  describe('Single value dataset', () => {
    const data = [42];

    it('should handle single value correctly', () => {
      expect(sum(data)).toBe(42);
      expect(mean(data)).toBe(42);
      expect(median(data)).toBe(42);
      // Mode for single value may be null (no mode) or [42] depending on implementation
      const dataMode = mode(data);
      expect(dataMode === null || (Array.isArray(dataMode) && dataMode.includes(42))).toBe(true);
      expect(min(data)).toBe(42);
      expect(max(data)).toBe(42);
      expect(range(data)).toBe(0);
      expect(variance(data, false)).toBe(0);
      expect(standardDeviation(data, false)).toBe(0);
    });
  });

  describe('Two value dataset', () => {
    const data = [10, 20];

    it('should calculate statistics correctly for two values', () => {
      expect(mean(data)).toBe(15);
      expect(median(data)).toBe(15);
      expect(mode(data)).toBe(null); // No mode
      expect(range(data)).toBe(10);
    });
  });

  describe('Large datasets (performance)', () => {
    it('should handle 1000 values efficiently', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => i + 1);

      const start = performance.now();
      const dataMean = mean(largeData);
      const dataMedian = median(largeData);
      const dataStdDev = standardDeviation(largeData, false);
      const end = performance.now();

      expect(dataMean).toBe(500.5);
      expect(dataMedian).toBe(500.5);
      expect(dataStdDev).toBeGreaterThan(0);
      expect(end - start).toBeLessThan(100); // Should complete in < 100ms
    });
  });

  describe('Decimal precision', () => {
    it('should maintain precision with decimal values', () => {
      const data = [1.1, 2.2, 3.3, 4.4, 5.5];

      expect(sum(data)).toBeCloseTo(16.5, 10);
      expect(mean(data)).toBeCloseTo(3.3, 10);
      expect(median(data)).toBeCloseTo(3.3, 10);
    });

    it('should handle very small decimal differences', () => {
      const data = [1.0001, 1.0002, 1.0003, 1.0004, 1.0005];

      const dataMean = mean(data);
      const stdDev = standardDeviation(data, false);

      expect(dataMean).toBeCloseTo(1.0003, 4);
      expect(stdDev).toBeCloseTo(0.00014142, 8);
    });
  });

  describe('Sorted vs unsorted data', () => {
    it('should produce same median for sorted and unsorted data', () => {
      const unsorted = [5, 1, 9, 3, 7];
      const sorted = [1, 3, 5, 7, 9];

      expect(median(unsorted)).toBe(median(sorted));
      expect(median(unsorted)).toBe(5);
    });

    it('should produce same statistics regardless of order', () => {
      const data1 = [10, 20, 30, 40, 50];
      const data2 = [50, 30, 10, 40, 20];

      expect(mean(data1)).toBe(mean(data2));
      expect(median(data1)).toBe(median(data2));
      expect(standardDeviation(data1, false)).toBe(standardDeviation(data2, false));
      expect(range(data1)).toBe(range(data2));
    });
  });

  describe('Zero values', () => {
    it('should handle datasets containing zeros', () => {
      const data = [0, 0, 1, 2, 3];

      expect(mean(data)).toBeCloseTo(1.2, 1);
      expect(median(data)).toBe(1);
      expect(mode(data)).toEqual([0]);
      expect(min(data)).toBe(0);
    });

    it('should handle all zeros', () => {
      const data = [0, 0, 0, 0];

      expect(mean(data)).toBe(0);
      expect(median(data)).toBe(0);
      expect(mode(data)).toEqual([0]);
      expect(variance(data, false)).toBe(0);
      expect(standardDeviation(data, false)).toBe(0);
    });
  });
});
