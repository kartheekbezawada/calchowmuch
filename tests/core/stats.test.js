import { describe, it, expect } from "vitest";
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
  factorial,
  permutation,
  combination,
  zScore,
} from "../../public/assets/js/core/stats.js";

describe("stats utilities", () => {
  describe("sum", () => {
    it("should sum positive numbers", () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15);
    });

    it("should sum negative numbers", () => {
      expect(sum([-1, -2, -3])).toBe(-6);
    });

    it("should handle mixed positive and negative", () => {
      expect(sum([10, -5, 3, -2])).toBe(6);
    });

    it("should return 0 for empty array", () => {
      expect(sum([])).toBe(0);
    });

    it("should return 0 for non-array input", () => {
      expect(sum(null)).toBe(0);
      expect(sum(undefined)).toBe(0);
    });

    it("should handle decimals", () => {
      expect(sum([1.5, 2.5, 3.0])).toBeCloseTo(7);
    });

    it("should handle single value", () => {
      expect(sum([42])).toBe(42);
    });
  });

  describe("mean", () => {
    it("should calculate mean of positive numbers", () => {
      expect(mean([2, 4, 6, 8, 10])).toBe(6);
    });

    it("should calculate mean with decimals", () => {
      expect(mean([1, 2, 3])).toBeCloseTo(2);
    });

    it("should return null for empty array", () => {
      expect(mean([])).toBe(null);
    });

    it("should return null for non-array", () => {
      expect(mean(null)).toBe(null);
    });

    it("should handle negative numbers", () => {
      expect(mean([-10, 0, 10])).toBe(0);
    });

    it("should handle single value", () => {
      expect(mean([5])).toBe(5);
    });
  });

  describe("median", () => {
    it("should find median of odd-length array", () => {
      expect(median([1, 3, 5, 7, 9])).toBe(5);
    });

    it("should find median of even-length array", () => {
      expect(median([1, 2, 3, 4])).toBe(2.5);
    });

    it("should handle unsorted input", () => {
      expect(median([9, 1, 5, 3, 7])).toBe(5);
    });

    it("should return null for empty array", () => {
      expect(median([])).toBe(null);
    });

    it("should return null for non-array", () => {
      expect(median(null)).toBe(null);
    });

    it("should handle single value", () => {
      expect(median([42])).toBe(42);
    });

    it("should handle negative numbers", () => {
      expect(median([-5, -2, 0, 3, 8])).toBe(0);
    });

    it("should handle decimals", () => {
      expect(median([1.5, 2.5, 3.5])).toBeCloseTo(2.5);
    });
  });

  describe("mode", () => {
    it("should find single mode", () => {
      expect(mode([1, 2, 2, 3, 4])).toEqual([2]);
    });

    it("should find multiple modes (bimodal)", () => {
      expect(mode([1, 1, 2, 2, 3])).toEqual([1, 2]);
    });

    it("should return null when no mode exists (all unique)", () => {
      expect(mode([1, 2, 3, 4, 5])).toBe(null);
    });

    it("should return null for empty array", () => {
      expect(mode([])).toBe(null);
    });

    it("should return null for non-array", () => {
      expect(mode(null)).toBe(null);
    });

    it("should handle negative numbers", () => {
      expect(mode([-1, -1, 2, 3])).toEqual([-1]);
    });

    it("should handle single value", () => {
      expect(mode([5])).toBe(null); // Single value = all unique
    });

    it("should handle all same values", () => {
      expect(mode([7, 7, 7, 7])).toEqual([7]);
    });

    it("should sort multiple modes", () => {
      expect(mode([5, 5, 1, 1, 3])).toEqual([1, 5]);
    });
  });

  describe("min", () => {
    it("should find minimum value", () => {
      expect(min([5, 2, 8, 1, 9])).toBe(1);
    });

    it("should handle negative numbers", () => {
      expect(min([-5, 2, -10, 3])).toBe(-10);
    });

    it("should return null for empty array", () => {
      expect(min([])).toBe(null);
    });

    it("should return null for non-array", () => {
      expect(min(null)).toBe(null);
    });

    it("should handle single value", () => {
      expect(min([42])).toBe(42);
    });
  });

  describe("max", () => {
    it("should find maximum value", () => {
      expect(max([5, 2, 8, 1, 9])).toBe(9);
    });

    it("should handle negative numbers", () => {
      expect(max([-5, -2, -10, -3])).toBe(-2);
    });

    it("should return null for empty array", () => {
      expect(max([])).toBe(null);
    });

    it("should return null for non-array", () => {
      expect(max(null)).toBe(null);
    });

    it("should handle single value", () => {
      expect(max([42])).toBe(42);
    });
  });

  describe("range", () => {
    it("should calculate range", () => {
      expect(range([1, 5, 3, 9, 2])).toBe(8);
    });

    it("should handle negative numbers", () => {
      expect(range([-10, 5, -3, 8])).toBe(18);
    });

    it("should return 0 for same values", () => {
      expect(range([5, 5, 5])).toBe(0);
    });

    it("should return null for empty array", () => {
      expect(range([])).toBe(null);
    });

    it("should return null for non-array", () => {
      expect(range(null)).toBe(null);
    });

    it("should handle single value", () => {
      expect(range([42])).toBe(0);
    });
  });

  describe("variance", () => {
    it("should calculate sample variance", () => {
      // Data: [2, 4, 6, 8], mean = 5
      // Squared diffs: 9, 1, 1, 9 = 20
      // Sample variance: 20 / 3 = 6.666...
      expect(variance([2, 4, 6, 8], true)).toBeCloseTo(6.6667, 3);
    });

    it("should calculate population variance", () => {
      // Data: [2, 4, 6, 8], mean = 5
      // Squared diffs: 9, 1, 1, 9 = 20
      // Population variance: 20 / 4 = 5
      expect(variance([2, 4, 6, 8], false)).toBe(5);
    });

    it("should default to sample variance", () => {
      expect(variance([2, 4, 6, 8])).toBeCloseTo(6.6667, 3);
    });

    it("should return null for empty array", () => {
      expect(variance([])).toBe(null);
    });

    it("should return null for single value with sample variance", () => {
      expect(variance([5], true)).toBe(null);
    });

    it("should return 0 for single value with population variance", () => {
      expect(variance([5], false)).toBe(0);
    });

    it("should return null for non-array", () => {
      expect(variance(null)).toBe(null);
    });

    it("should handle negative numbers", () => {
      expect(variance([-2, -1, 0, 1, 2], false)).toBeCloseTo(2);
    });
  });

  describe("standardDeviation", () => {
    it("should calculate sample standard deviation", () => {
      // sqrt(6.6667) ≈ 2.582
      expect(standardDeviation([2, 4, 6, 8], true)).toBeCloseTo(2.582, 2);
    });

    it("should calculate population standard deviation", () => {
      // sqrt(5) ≈ 2.236
      expect(standardDeviation([2, 4, 6, 8], false)).toBeCloseTo(2.236, 2);
    });

    it("should default to sample standard deviation", () => {
      expect(standardDeviation([2, 4, 6, 8])).toBeCloseTo(2.582, 2);
    });

    it("should return null for empty array", () => {
      expect(standardDeviation([])).toBe(null);
    });

    it("should return null for single value with sample", () => {
      expect(standardDeviation([5], true)).toBe(null);
    });

    it("should return 0 for single value with population", () => {
      expect(standardDeviation([5], false)).toBe(0);
    });

    it("should return null for non-array", () => {
      expect(standardDeviation(null)).toBe(null);
    });
  });

  describe("parseDataset", () => {
    it("should parse comma-separated values", () => {
      const result = parseDataset("1, 2, 3, 4, 5");
      expect(result.data).toEqual([1, 2, 3, 4, 5]);
      expect(result.errors).toEqual([]);
    });

    it("should parse space-separated values", () => {
      const result = parseDataset("1 2 3 4 5");
      expect(result.data).toEqual([1, 2, 3, 4, 5]);
      expect(result.errors).toEqual([]);
    });

    it("should parse newline-separated values", () => {
      const result = parseDataset("1\n2\n3\n4\n5");
      expect(result.data).toEqual([1, 2, 3, 4, 5]);
      expect(result.errors).toEqual([]);
    });

    it("should parse mixed separators", () => {
      const result = parseDataset("1, 2\n3 4, 5");
      expect(result.data).toEqual([1, 2, 3, 4, 5]);
      expect(result.errors).toEqual([]);
    });

    it("should handle decimals", () => {
      const result = parseDataset("1.5, 2.5, 3.5");
      expect(result.data).toEqual([1.5, 2.5, 3.5]);
      expect(result.errors).toEqual([]);
    });

    it("should handle negative numbers", () => {
      const result = parseDataset("-1, -2.5, 3");
      expect(result.data).toEqual([-1, -2.5, 3]);
      expect(result.errors).toEqual([]);
    });

    it("should report invalid tokens", () => {
      const result = parseDataset("1, abc, 3, xyz");
      expect(result.data).toEqual([1, 3]);
      expect(result.errors).toEqual(["abc", "xyz"]);
    });

    it("should handle empty input", () => {
      const result = parseDataset("");
      expect(result.data).toEqual([]);
      expect(result.errors).toEqual([]);
    });

    it("should handle null input", () => {
      const result = parseDataset(null);
      expect(result.data).toEqual([]);
      expect(result.errors).toEqual([]);
    });

    it("should handle whitespace-only input", () => {
      const result = parseDataset("   \n\t  ");
      expect(result.data).toEqual([]);
      expect(result.errors).toEqual([]);
    });

    it("should trim whitespace around tokens", () => {
      const result = parseDataset("  1  ,  2  ,  3  ");
      expect(result.data).toEqual([1, 2, 3]);
      expect(result.errors).toEqual([]);
    });
  });

  describe("factorial", () => {
    it("should calculate factorial of 0", () => {
      expect(factorial(0)).toBe(BigInt(1));
    });

    it("should calculate factorial of 1", () => {
      expect(factorial(1)).toBe(BigInt(1));
    });

    it("should calculate factorial of 5", () => {
      expect(factorial(5)).toBe(BigInt(120));
    });

    it("should calculate factorial of 10", () => {
      expect(factorial(10)).toBe(BigInt(3628800));
    });

    it("should return null for negative numbers", () => {
      expect(factorial(-1)).toBe(null);
    });

    it("should return null for non-integers", () => {
      expect(factorial(5.5)).toBe(null);
    });

    it("should return null for n > 170", () => {
      expect(factorial(171)).toBe(null);
    });

    it("should handle n = 170", () => {
      expect(factorial(170)).not.toBe(null);
    });
  });

  describe("permutation", () => {
    it("should calculate nPr for basic case", () => {
      // 5P3 = 5!/(5-3)! = 120/2 = 60
      expect(permutation(5, 3)).toBe(BigInt(60));
    });

    it("should calculate nPn (full permutation)", () => {
      // 4P4 = 4! = 24
      expect(permutation(4, 4)).toBe(BigInt(24));
    });

    it("should calculate nP0", () => {
      // nP0 = 1
      expect(permutation(5, 0)).toBe(BigInt(1));
    });

    it("should return null when r > n", () => {
      expect(permutation(3, 5)).toBe(null);
    });

    it("should return null for negative n", () => {
      expect(permutation(-5, 3)).toBe(null);
    });

    it("should return null for negative r", () => {
      expect(permutation(5, -3)).toBe(null);
    });

    it("should return null for non-integers", () => {
      expect(permutation(5.5, 3)).toBe(null);
    });

    it("should return null for n > 170", () => {
      expect(permutation(171, 3)).toBe(null);
    });
  });

  describe("combination", () => {
    it("should calculate nCr for basic case", () => {
      // 5C3 = 5!/(3!*2!) = 120/(6*2) = 10
      expect(combination(5, 3)).toBe(BigInt(10));
    });

    it("should calculate nCn", () => {
      // nCn = 1
      expect(combination(5, 5)).toBe(BigInt(1));
    });

    it("should calculate nC0", () => {
      // nC0 = 1
      expect(combination(5, 0)).toBe(BigInt(1));
    });

    it("should calculate nC1", () => {
      // nC1 = n
      expect(combination(5, 1)).toBe(BigInt(5));
    });

    it("should return null when r > n", () => {
      expect(combination(3, 5)).toBe(null);
    });

    it("should return null for negative n", () => {
      expect(combination(-5, 3)).toBe(null);
    });

    it("should return null for negative r", () => {
      expect(combination(5, -3)).toBe(null);
    });

    it("should return null for non-integers", () => {
      expect(combination(5.5, 3)).toBe(null);
    });

    it("should return null for n > 170", () => {
      expect(combination(171, 3)).toBe(null);
    });

    it("should handle symmetric property nCr = nC(n-r)", () => {
      expect(combination(10, 3)).toBe(combination(10, 7));
    });
  });

  describe("zScore", () => {
    it("should calculate basic z-score", () => {
      // z = (x - mean) / stdDev = (75 - 70) / 10 = 0.5
      expect(zScore(75, 70, 10)).toBe(0.5);
    });

    it("should handle negative z-score", () => {
      // z = (65 - 70) / 10 = -0.5
      expect(zScore(65, 70, 10)).toBe(-0.5);
    });

    it("should handle z-score of 0 when x equals mean", () => {
      expect(zScore(70, 70, 10)).toBe(0);
    });

    it("should return null for sigma <= 0", () => {
      expect(zScore(75, 70, 0)).toBe(null);
      expect(zScore(75, 70, -5)).toBe(null);
    });

    it("should return null for non-numeric inputs", () => {
      expect(zScore("75", 70, 10)).toBe(null);
      expect(zScore(75, "70", 10)).toBe(null);
      expect(zScore(75, 70, "10")).toBe(null);
    });

    it("should handle decimal values", () => {
      expect(zScore(72.5, 70, 5)).toBeCloseTo(0.5);
    });
  });
});
