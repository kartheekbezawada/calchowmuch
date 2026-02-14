import { describe, it, expect } from 'vitest';
import {
  mean,
  variance,
  standardDeviation,
  parseDataset,
} from '../../public/assets/js/core/stats.js';

/**
 * SD-TEST-U-1 - Standard Deviation Unit Tests
 * Test standard deviation calculations with known datasets
 */
describe('Standard Deviation Calculator - SD-TEST-U-1: Statistical Calculations', () => {
  describe('Simple dataset: [2, 4, 6, 8, 10]', () => {
    const data = [2, 4, 6, 8, 10];

    it('should calculate mean correctly', () => {
      const result = mean(data);
      expect(result).toBe(6);
    });

    it('should calculate population variance correctly', () => {
      const result = variance(data, false);
      // Variance = [(2-6)² + (4-6)² + (6-6)² + (8-6)² + (10-6)²] / 5
      // = [16 + 4 + 0 + 4 + 16] / 5 = 40 / 5 = 8
      expect(result).toBe(8);
    });

    it('should calculate population standard deviation (σ) correctly', () => {
      const result = standardDeviation(data, false);
      // σ = sqrt(8) = 2.8284...
      expect(result).toBeCloseTo(2.8284, 4);
    });

    it('should calculate sample variance correctly', () => {
      const result = variance(data, true);
      // Sample variance = 40 / (5-1) = 40 / 4 = 10
      expect(result).toBe(10);
    });

    it('should calculate sample standard deviation (s) correctly', () => {
      const result = standardDeviation(data, true);
      // s = sqrt(10) = 3.1623...
      expect(result).toBeCloseTo(3.1623, 4);
    });
  });

  describe('Population vs sample calculations', () => {
    const data = [10, 12, 23, 23, 16, 23, 21, 16];

    it('should calculate population standard deviation', () => {
      const dataMean = mean(data); // 18
      const popVar = variance(data, false);
      const popStdDev = standardDeviation(data, false);

      expect(dataMean).toBe(18);
      expect(popStdDev).toBeCloseTo(4.899, 3);
    });

    it('should calculate sample standard deviation', () => {
      const sampleStdDev = standardDeviation(data, true);
      // Sample std dev should be slightly larger than population
      expect(sampleStdDev).toBeCloseTo(5.237, 3);
    });

    it('sample std dev should be larger than population std dev', () => {
      const popStdDev = standardDeviation(data, false);
      const sampleStdDev = standardDeviation(data, true);
      expect(sampleStdDev).toBeGreaterThan(popStdDev);
    });
  });

  describe('Zero variance dataset (all values equal)', () => {
    const data = [5, 5, 5, 5, 5];

    it('should calculate variance as 0', () => {
      expect(variance(data, false)).toBe(0);
      expect(variance(data, true)).toBe(0);
    });

    it('should calculate standard deviation as 0', () => {
      expect(standardDeviation(data, false)).toBe(0);
      expect(standardDeviation(data, true)).toBe(0);
    });
  });

  describe('Negative number datasets', () => {
    const data = [-10, -5, 0, 5, 10];

    it('should handle negative numbers correctly', () => {
      const dataMean = mean(data);
      const stdDev = standardDeviation(data, false);

      expect(dataMean).toBe(0);
      // Variance = (100 + 25 + 0 + 25 + 100) / 5 = 250 / 5 = 50
      // Std Dev = sqrt(50) = 7.071...
      expect(stdDev).toBeCloseTo(7.071, 3);
    });
  });
});

/**
 * SD-TEST-U-2 - Standard Deviation Edge Cases
 * Test validation and edge cases
 */
describe('Standard Deviation Calculator - SD-TEST-U-2: Edge Cases', () => {
  describe('Single data point', () => {
    const data = [42];

    it('should calculate population std dev as 0', () => {
      const result = standardDeviation(data, false);
      expect(result).toBe(0);
    });

    it('sample std dev should be null or 0 for single point', () => {
      // Note: Mathematically undefined for single point (division by n-1 = 0)
      const result = standardDeviation(data, true);
      // Implementation may return null or 0 for undefined case
      expect(result === null || result === 0).toBe(true);
    });
  });

  describe('Two data points', () => {
    const data = [10, 20];

    it('should calculate mean correctly', () => {
      expect(mean(data)).toBe(15);
    });

    it('should calculate sample standard deviation correctly', () => {
      const result = standardDeviation(data, true);
      // s = sqrt(((10-15)² + (20-15)²) / 1) = sqrt((25 + 25) / 1) = sqrt(50)
      expect(result).toBeCloseTo(7.071, 3);
    });
  });

  describe('Very large datasets (performance)', () => {
    const data = Array.from({ length: 1000 }, (_, i) => i + 1);

    it('should handle large datasets efficiently', () => {
      const start = performance.now();
      const result = standardDeviation(data, false);
      const end = performance.now();

      expect(result).toBeGreaterThan(0);
      expect(end - start).toBeLessThan(100); // Should complete in < 100ms
    });

    it('should calculate correct mean for 1 to 1000', () => {
      const result = mean(data);
      // Mean of 1 to 1000 = (1 + 1000) / 2 = 500.5
      expect(result).toBe(500.5);
    });
  });

  describe('Extreme outliers impact', () => {
    const dataWithoutOutlier = [10, 12, 11, 13, 12];
    const dataWithOutlier = [10, 12, 11, 13, 100];

    it('outlier should significantly increase standard deviation', () => {
      const stdDevWithout = standardDeviation(dataWithoutOutlier, false);
      const stdDevWith = standardDeviation(dataWithOutlier, false);

      expect(stdDevWith).toBeGreaterThan(stdDevWithout * 5);
    });
  });

  describe('Decimal precision maintenance', () => {
    const data = [1.111, 2.222, 3.333, 4.444, 5.555];

    it('should maintain decimal precision in calculations', () => {
      const dataMean = mean(data);
      const stdDev = standardDeviation(data, false);

      expect(dataMean).toBeCloseTo(3.333, 3);
      expect(stdDev).toBeCloseTo(1.571, 3);
    });
  });

  describe('parseDataset validation', () => {
    it('should parse comma-separated values', () => {
      const result = parseDataset('1, 2, 3, 4, 5');
      expect(result.data).toEqual([1, 2, 3, 4, 5]);
      expect(result.errors).toEqual([]);
    });

    it('should parse space-separated values', () => {
      const result = parseDataset('10 20 30 40');
      expect(result.data).toEqual([10, 20, 30, 40]);
      expect(result.errors).toEqual([]);
    });

    it('should parse newline-separated values', () => {
      const result = parseDataset('5\n10\n15\n20');
      expect(result.data).toEqual([5, 10, 15, 20]);
      expect(result.errors).toEqual([]);
    });

    it('should handle mixed separators', () => {
      const result = parseDataset('1, 2\n3 4, 5');
      expect(result.data).toEqual([1, 2, 3, 4, 5]);
      expect(result.errors).toEqual([]);
    });

    it('should reject non-numeric values', () => {
      const result = parseDataset('1, abc, 3');
      expect(result.data).toEqual([1, 3]);
      expect(result.errors).toContain('abc');
    });

    it('should handle negative numbers', () => {
      const result = parseDataset('-5, -10, 15, 20');
      expect(result.data).toEqual([-5, -10, 15, 20]);
      expect(result.errors).toEqual([]);
    });

    it('should handle decimal numbers', () => {
      const result = parseDataset('1.5, 2.7, 3.9');
      expect(result.data).toEqual([1.5, 2.7, 3.9]);
      expect(result.errors).toEqual([]);
    });
  });
});
