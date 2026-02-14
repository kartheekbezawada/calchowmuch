import { describe, it, expect } from 'vitest';
import { zScore } from '../../public/assets/js/core/stats.js';

/**
 * ZSCORE-TEST-U-1 - Z-Score Unit Tests
 * Test Z-score calculations and conversions
 */
describe('Z-Score Calculator - ZSCORE-TEST-U-1: Standard Conversions', () => {
  describe('Standard conversions: μ=100, σ=15, x=115 → z=1.0', () => {
    it('should calculate z-score = 1.0 for value one std dev above mean', () => {
      const result = zScore(115, 100, 15);
      expect(result).toBe(1.0);
    });

    it('should calculate z-score = -1.0 for value one std dev below mean', () => {
      const result = zScore(85, 100, 15);
      expect(result).toBe(-1.0);
    });

    it('should calculate z-score = 0 for value equal to mean', () => {
      const result = zScore(100, 100, 15);
      expect(result).toBe(0);
    });

    it('should calculate z-score = 2.0 for value two std devs above mean', () => {
      const result = zScore(130, 100, 15);
      expect(result).toBe(2.0);
    });

    it('should calculate z-score = -2.0 for value two std devs below mean', () => {
      const result = zScore(70, 100, 15);
      expect(result).toBe(-2.0);
    });
  });

  describe('IQ score conversions (μ=100, σ=15)', () => {
    it('should calculate z-score for IQ of 145 (gifted)', () => {
      const result = zScore(145, 100, 15);
      expect(result).toBe(3.0); // 3 std devs above mean
    });

    it('should calculate z-score for IQ of 55 (very low)', () => {
      const result = zScore(55, 100, 15);
      expect(result).toBe(-3.0); // 3 std devs below mean
    });

    it('should calculate z-score for IQ of 110', () => {
      const result = zScore(110, 100, 15);
      expect(result).toBeCloseTo(0.6667, 4);
    });

    it('should calculate z-score for IQ of 92.5', () => {
      const result = zScore(92.5, 100, 15);
      expect(result).toBe(-0.5);
    });
  });

  describe('Test score conversions (μ=75, σ=10)', () => {
    it('should calculate z-score for perfect score of 100', () => {
      const result = zScore(100, 75, 10);
      expect(result).toBe(2.5);
    });

    it('should calculate z-score for score of 60', () => {
      const result = zScore(60, 75, 10);
      expect(result).toBe(-1.5);
    });

    it('should calculate z-score for average score of 75', () => {
      const result = zScore(75, 75, 10);
      expect(result).toBe(0);
    });
  });

  describe('Decimal value calculations', () => {
    it('should handle decimal raw scores', () => {
      const result = zScore(87.5, 100, 15);
      expect(result).toBeCloseTo(-0.8333, 4);
    });

    it('should handle decimal means', () => {
      const result = zScore(100, 98.5, 12);
      expect(result).toBeCloseTo(0.125, 3);
    });

    it('should handle decimal standard deviations', () => {
      const result = zScore(50, 45, 7.5);
      expect(result).toBeCloseTo(0.6667, 4);
    });

    it('should handle all decimal inputs', () => {
      const result = zScore(12.75, 10.5, 2.25);
      expect(result).toBe(1.0);
    });
  });

  describe('Percentile conversions (common z-scores)', () => {
    it('z = 1.96 corresponds to 97.5th percentile (95% CI)', () => {
      // This test verifies we can calculate the z-score that corresponds to common percentiles
      const x = 100 + 1.96 * 15; // μ + z*σ = 129.4
      const result = zScore(129.4, 100, 15);
      expect(result).toBeCloseTo(1.96, 2);
    });

    it('z = 1.645 corresponds to 95th percentile (90% CI)', () => {
      const x = 100 + 1.645 * 15; // μ + z*σ = 124.675
      const result = zScore(124.675, 100, 15);
      expect(result).toBeCloseTo(1.645, 3);
    });

    it('z = 2.576 corresponds to 99.5th percentile (99% CI)', () => {
      const x = 100 + 2.576 * 15; // μ + z*σ = 138.64
      const result = zScore(138.64, 100, 15);
      expect(result).toBeCloseTo(2.576, 3);
    });
  });
});

/**
 * ZSCORE-TEST-U-2 - Z-Score Edge Cases
 * Test validation and extreme cases
 */
describe('Z-Score Calculator - ZSCORE-TEST-U-2: Edge Cases', () => {
  describe('Very extreme z-scores (|z| > 4)', () => {
    it('should calculate extreme positive z-score', () => {
      const result = zScore(200, 100, 15);
      expect(result).toBeCloseTo(6.6667, 4);
    });

    it('should calculate extreme negative z-score', () => {
      const result = zScore(0, 100, 15);
      expect(result).toBeCloseTo(-6.6667, 4);
    });

    it('should handle z-score of 10', () => {
      const x = 100 + 10 * 15; // 250
      const result = zScore(x, 100, 15);
      expect(result).toBe(10);
    });
  });

  describe('Very small standard deviations', () => {
    it('should handle very small σ = 0.001', () => {
      const result = zScore(100.005, 100, 0.001);
      expect(result).toBeCloseTo(5, 10);
    });

    it('should handle σ = 0.0001', () => {
      const result = zScore(1.0002, 1, 0.0001);
      expect(result).toBeCloseTo(2, 10);
    });

    it('small differences with small σ produce large z-scores', () => {
      const result = zScore(10.01, 10, 0.01);
      expect(result).toBeCloseTo(1, 10);
    });
  });

  describe('Very large standard deviations', () => {
    it('should handle very large σ = 1000', () => {
      const result = zScore(2500, 1000, 1000);
      expect(result).toBe(1.5);
    });

    it('should handle σ = 10000', () => {
      const result = zScore(25000, 5000, 10000);
      expect(result).toBe(2);
    });
  });

  describe('Negative means and values', () => {
    it('should handle negative mean', () => {
      const result = zScore(-85, -100, 15);
      expect(result).toBe(1.0);
    });

    it('should handle both negative', () => {
      const result = zScore(-115, -100, 15);
      expect(result).toBe(-1.0);
    });

    it('should handle negative value with positive mean', () => {
      const result = zScore(-15, 100, 15);
      expect(result).toBeCloseTo(-7.6667, 4);
    });

    it('should handle all negative inputs', () => {
      const result = zScore(-10, -20, 5);
      expect(result).toBe(2.0);
    });
  });

  describe('Boundary conditions (z=0, p=0.5)', () => {
    it('z = 0 when x equals mean', () => {
      expect(zScore(50, 50, 10)).toBe(0);
      expect(zScore(0, 0, 5)).toBe(0);
      expect(zScore(-25, -25, 3)).toBe(0);
      expect(zScore(1000, 1000, 100)).toBe(0);
    });

    it('should calculate symmetric z-scores', () => {
      const zPositive = zScore(110, 100, 10);
      const zNegative = zScore(90, 100, 10);

      expect(zPositive).toBe(1);
      expect(zNegative).toBe(-1);
      expect(Math.abs(zPositive)).toBe(Math.abs(zNegative));
    });
  });

  describe('Inverse calculation accuracy', () => {
    it('should reverse calculate raw score from z-score', () => {
      const mean = 100;
      const stddev = 15;
      const z = 1.5;

      // x = μ + z*σ
      const x = mean + z * stddev; // 122.5
      const calculatedZ = zScore(x, mean, stddev);

      expect(calculatedZ).toBe(z);
    });

    it('should work for negative z-scores', () => {
      const mean = 75;
      const stddev = 12;
      const z = -2.3;

      const x = mean + z * stddev; // 47.4
      const calculatedZ = zScore(x, mean, stddev);

      expect(calculatedZ).toBeCloseTo(z, 10);
    });
  });

  describe('Zero and near-zero values', () => {
    it('should handle mean of zero', () => {
      const result = zScore(15, 0, 15);
      expect(result).toBe(1);
    });

    it('should handle raw score of zero', () => {
      const result = zScore(0, 50, 10);
      expect(result).toBe(-5);
    });

    it('should handle near-zero z-scores', () => {
      const result = zScore(100.01, 100, 10);
      expect(result).toBeCloseTo(0.001, 10);
    });
  });

  describe('Precision and rounding', () => {
    it('should maintain high precision', () => {
      const result = zScore(100.123456, 100, 10);
      expect(result).toBeCloseTo(0.0123456, 7);
    });

    it('should handle floating point precision', () => {
      const result = zScore(10.1, 10, 0.3);
      expect(result).toBeCloseTo(0.3333, 4);
    });
  });

  describe('Common statistical scenarios', () => {
    it('68-95-99.7 rule: z=1 boundary', () => {
      // In normal distribution, ~68% of values fall within ±1 std dev
      const z1 = zScore(115, 100, 15);
      const zNeg1 = zScore(85, 100, 15);

      expect(z1).toBe(1);
      expect(zNeg1).toBe(-1);
    });

    it('68-95-99.7 rule: z=2 boundary', () => {
      // ~95% of values fall within ±2 std devs
      const z2 = zScore(130, 100, 15);
      const zNeg2 = zScore(70, 100, 15);

      expect(z2).toBe(2);
      expect(zNeg2).toBe(-2);
    });

    it('68-95-99.7 rule: z=3 boundary', () => {
      // ~99.7% of values fall within ±3 std devs
      const z3 = zScore(145, 100, 15);
      const zNeg3 = zScore(55, 100, 15);

      expect(z3).toBe(3);
      expect(zNeg3).toBe(-3);
    });
  });

  describe('SAT score standardization (μ=500, σ=100)', () => {
    it('should calculate z-score for SAT 700', () => {
      const result = zScore(700, 500, 100);
      expect(result).toBe(2.0);
    });

    it('should calculate z-score for SAT 350', () => {
      const result = zScore(350, 500, 100);
      expect(result).toBe(-1.5);
    });

    it('should calculate z-score for perfect SAT 800', () => {
      const result = zScore(800, 500, 100);
      expect(result).toBe(3.0);
    });
  });

  describe('Height standardization (μ=170cm, σ=10cm)', () => {
    it('should calculate z-score for 180cm height', () => {
      const result = zScore(180, 170, 10);
      expect(result).toBe(1.0);
    });

    it('should calculate z-score for 155cm height', () => {
      const result = zScore(155, 170, 10);
      expect(result).toBe(-1.5);
    });
  });

  describe('Formula validation: z = (x - μ) / σ', () => {
    it('should satisfy formula for various inputs', () => {
      const testCases = [
        { x: 25, mean: 20, stddev: 5, expected: 1 },
        { x: 15, mean: 20, stddev: 5, expected: -1 },
        { x: 100, mean: 80, stddev: 10, expected: 2 },
        { x: 7.5, mean: 5, stddev: 2.5, expected: 1 },
      ];

      testCases.forEach(({ x, mean, stddev, expected }) => {
        const result = zScore(x, mean, stddev);
        expect(result).toBe(expected);
      });
    });
  });
});
