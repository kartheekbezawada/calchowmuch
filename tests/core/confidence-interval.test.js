import { describe, it, expect } from 'vitest';
import {
  calculateProportionCI,
  calculateMeanCI,
  Z_VALUES,
} from '../../public/assets/js/core/stats.js';

/**
 * CI-TEST-U-1 - Confidence Interval Unit Tests
 * Test statistical calculations
 */
describe('Confidence Interval Calculator - CI-TEST-U-1: Statistical Calculations', () => {
  describe('95% CI with known values: n=25, x̄=50, σ=10', () => {
    it('should calculate correct confidence interval for mean', () => {
      const result = calculateMeanCI(50, 10, 25, Z_VALUES['95%']);

      // SE = 10 / sqrt(25) = 10 / 5 = 2
      expect(result.se).toBe(2);

      // ME = 1.96 * 2 = 3.92
      expect(result.me).toBeCloseTo(3.92, 2);

      // Lower = 50 - 3.92 = 46.08
      expect(result.lower).toBeCloseTo(46.08, 2);

      // Upper = 50 + 3.92 = 53.92
      expect(result.upper).toBeCloseTo(53.92, 2);
    });
  });

  describe('Different confidence levels (90%, 95%, 99%)', () => {
    const n = 100;
    const xbar = 50;
    const sigma = 10;

    it('should calculate 90% CI correctly', () => {
      const result = calculateMeanCI(xbar, sigma, n, Z_VALUES['90%']);

      // SE = 10 / sqrt(100) = 1
      expect(result.se).toBe(1);

      // ME = 1.645 * 1 = 1.645
      expect(result.me).toBeCloseTo(1.645, 3);

      // Interval: [48.355, 51.645]
      expect(result.lower).toBeCloseTo(48.355, 3);
      expect(result.upper).toBeCloseTo(51.645, 3);
    });

    it('should calculate 95% CI correctly', () => {
      const result = calculateMeanCI(xbar, sigma, n, Z_VALUES['95%']);

      // ME = 1.96 * 1 = 1.96
      expect(result.me).toBeCloseTo(1.96, 2);

      // Interval: [48.04, 51.96]
      expect(result.lower).toBeCloseTo(48.04, 2);
      expect(result.upper).toBeCloseTo(51.96, 2);
    });

    it('should calculate 99% CI correctly', () => {
      const result = calculateMeanCI(xbar, sigma, n, Z_VALUES['99%']);

      // ME = 2.576 * 1 = 2.576
      expect(result.me).toBeCloseTo(2.576, 3);

      // Interval: [47.424, 52.576]
      expect(result.lower).toBeCloseTo(47.424, 3);
      expect(result.upper).toBeCloseTo(52.576, 3);
    });

    it('higher confidence level should produce wider interval', () => {
      const ci90 = calculateMeanCI(xbar, sigma, n, Z_VALUES['90%']);
      const ci95 = calculateMeanCI(xbar, sigma, n, Z_VALUES['95%']);
      const ci99 = calculateMeanCI(xbar, sigma, n, Z_VALUES['99%']);

      const width90 = ci90.upper - ci90.lower;
      const width95 = ci95.upper - ci95.lower;
      const width99 = ci99.upper - ci99.lower;

      expect(width90).toBeLessThan(width95);
      expect(width95).toBeLessThan(width99);
    });
  });

  describe('Proportion confidence interval calculations', () => {
    it('should calculate CI for proportion p=0.5, n=100, 95%', () => {
      const result = calculateProportionCI(50, 100, Z_VALUES['95%']);

      // SE = sqrt(0.5 * 0.5 / 100) = sqrt(0.0025) = 0.05
      expect(result.se).toBe(0.05);

      // ME = 1.96 * 0.05 = 0.098
      expect(result.me).toBeCloseTo(0.098, 3);

      // Interval: [0.402, 0.598]
      expect(result.lower).toBeCloseTo(0.402, 3);
      expect(result.upper).toBeCloseTo(0.598, 3);
    });

    it('should calculate CI for proportion p=0.3, n=200, 95%', () => {
      const result = calculateProportionCI(30, 200, Z_VALUES['95%']);

      // SE = sqrt(0.3 * 0.7 / 200) = sqrt(0.00105) ≈ 0.0324
      expect(result.se).toBeCloseTo(0.0324, 3);

      // ME ≈ 1.96 * 0.0324 ≈ 0.0635
      expect(result.me).toBeCloseTo(0.0635, 3);
    });

    it('should bound proportion CI between 0 and 1', () => {
      // Very high proportion (98%) with small sample
      const result = calculateProportionCI(98, 20, Z_VALUES['99%']);

      // Upper bound should be capped at 1
      expect(result.upper).toBeLessThanOrEqual(1);
      expect(result.lower).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Sample size impact', () => {
    it('larger sample size should produce narrower interval', () => {
      const ci_n25 = calculateMeanCI(50, 10, 25, Z_VALUES['95%']);
      const ci_n100 = calculateMeanCI(50, 10, 100, Z_VALUES['95%']);
      const ci_n400 = calculateMeanCI(50, 10, 400, Z_VALUES['95%']);

      const width_n25 = ci_n25.upper - ci_n25.lower;
      const width_n100 = ci_n100.upper - ci_n100.lower;
      const width_n400 = ci_n400.upper - ci_n400.lower;

      expect(width_n25).toBeGreaterThan(width_n100);
      expect(width_n100).toBeGreaterThan(width_n400);
    });
  });
});

/**
 * CI-TEST-U-2 - Confidence Interval Edge Cases
 * Test validation and edge cases
 */
describe('Confidence Interval Calculator - CI-TEST-U-2: Edge Cases', () => {
  describe('Very small samples (n=2, n=3)', () => {
    it('should handle n=2 for mean CI', () => {
      const result = calculateMeanCI(50, 10, 2, Z_VALUES['95%']);

      // SE = 10 / sqrt(2) ≈ 7.07
      expect(result.se).toBeCloseTo(7.07, 2);

      // Very wide interval expected
      expect(result.upper - result.lower).toBeGreaterThan(25);
    });

    it('should handle n=3 for proportion CI', () => {
      const result = calculateProportionCI(66.67, 3, Z_VALUES['95%']);

      // Should produce a very wide interval
      expect(result.upper - result.lower).toBeGreaterThan(0.3);
    });
  });

  describe('Zero standard deviation', () => {
    it('should produce zero-width interval when sigma=0.0001 (near zero)', () => {
      // In practice, sigma should be > 0, but test with very small value
      const result = calculateMeanCI(50, 0.0001, 100, Z_VALUES['95%']);

      expect(result.se).toBeCloseTo(0.00001, 6);
      expect(result.lower).toBeCloseTo(result.upper, 4);
    });
  });

  describe('Negative sample means', () => {
    it('should correctly handle negative mean', () => {
      const result = calculateMeanCI(-25, 5, 36, Z_VALUES['95%']);

      // SE = 5 / sqrt(36) = 5/6 ≈ 0.833
      expect(result.se).toBeCloseTo(0.833, 3);

      // ME = 1.96 * 0.833 ≈ 1.633
      expect(result.me).toBeCloseTo(1.633, 2);

      // Both bounds should be negative
      expect(result.lower).toBeLessThan(0);
      expect(result.upper).toBeLessThan(0);

      // Interval: [-26.633, -23.367]
      expect(result.lower).toBeCloseTo(-26.633, 2);
      expect(result.upper).toBeCloseTo(-23.367, 2);
    });
  });

  describe('Extreme proportions', () => {
    it('should handle p=0% (no successes)', () => {
      const result = calculateProportionCI(0, 100, Z_VALUES['95%']);

      // SE = sqrt(0 * 1 / 100) = 0
      expect(result.se).toBe(0);
      expect(result.me).toBe(0);
      expect(result.lower).toBe(0);
      expect(result.upper).toBe(0);
    });

    it('should handle p=100% (all successes)', () => {
      const result = calculateProportionCI(100, 100, Z_VALUES['95%']);

      // SE = sqrt(1 * 0 / 100) = 0
      expect(result.se).toBe(0);
      expect(result.me).toBe(0);
      expect(result.lower).toBe(1);
      expect(result.upper).toBe(1);
    });

    it('should handle p near 0% correctly', () => {
      const result = calculateProportionCI(5, 100, Z_VALUES['95%']);

      // Lower bound should not go below 0
      expect(result.lower).toBeGreaterThanOrEqual(0);
    });

    it('should handle p near 100% correctly', () => {
      const result = calculateProportionCI(95, 100, Z_VALUES['95%']);

      // Upper bound should not exceed 1
      expect(result.upper).toBeLessThanOrEqual(1);
    });
  });

  describe('Large sample sizes', () => {
    it('should handle very large sample size (n=10000)', () => {
      const result = calculateMeanCI(100, 15, 10000, Z_VALUES['95%']);

      // SE = 15 / sqrt(10000) = 15 / 100 = 0.15
      expect(result.se).toBe(0.15);

      // ME = 1.96 * 0.15 = 0.294
      expect(result.me).toBeCloseTo(0.294, 3);

      // Very narrow interval: [99.706, 100.294]
      expect(result.lower).toBeCloseTo(99.706, 3);
      expect(result.upper).toBeCloseTo(100.294, 3);
    });
  });

  describe('Standard error formula verification', () => {
    it('SE for proportion should use sqrt(p*(1-p)/n) formula', () => {
      const p = 0.4;
      const n = 50;
      const expectedSE = Math.sqrt((p * (1 - p)) / n);

      const result = calculateProportionCI(40, 50, Z_VALUES['95%']);
      expect(result.se).toBeCloseTo(expectedSE, 6);
    });

    it('SE for mean should use sigma/sqrt(n) formula', () => {
      const sigma = 12;
      const n = 36;
      const expectedSE = sigma / Math.sqrt(n);

      const result = calculateMeanCI(50, sigma, n, Z_VALUES['95%']);
      expect(result.se).toBeCloseTo(expectedSE, 6);
    });
  });
});
