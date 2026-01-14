import { describe, it, expect } from "vitest";
import {
  calculatePercentageChange,
  calculatePercentOf,
  calculateWhatPercent,
  calculateAddSubtractPercent,
} from "../../public/assets/js/core/percentage-tools.js";

describe("percentage tools", () => {
  describe("calculatePercentageChange", () => {
    it("returns a percentage change for valid inputs", () => {
      const result = calculatePercentageChange(200, 260);
      expect(result.error).toBeUndefined();
      expect(result.value).toBe(30);
    });

    it("returns a negative percentage change for decreases", () => {
      const result = calculatePercentageChange(100, 75);
      expect(result.error).toBeUndefined();
      expect(result.value).toBe(-25);
    });

    it("returns an error for invalid inputs", () => {
      const result = calculatePercentageChange(Number.NaN, 200);
      expect(result.error).toBeTruthy();
    });

    it("returns an error when the starting value is zero", () => {
      const result = calculatePercentageChange(0, 100);
      expect(result.error).toBe(
        "Starting value must be greater than zero to calculate percent change."
      );
    });
  });

  describe("calculatePercentOf", () => {
    it("returns the percentage of a value", () => {
      const result = calculatePercentOf(25, 400);
      expect(result.error).toBeUndefined();
      expect(result.value).toBe(100);
    });

    it("returns zero when percent is zero", () => {
      const result = calculatePercentOf(0, 500);
      expect(result.error).toBeUndefined();
      expect(result.value).toBe(0);
    });

    it("returns zero when base value is zero", () => {
      const result = calculatePercentOf(50, 0);
      expect(result.error).toBeUndefined();
      expect(result.value).toBe(0);
    });

    it("returns an error for invalid inputs", () => {
      const result = calculatePercentOf(25, Number.NaN);
      expect(result.error).toBeTruthy();
    });
  });

  describe("calculateWhatPercent", () => {
    it("returns what percent a part is of a whole", () => {
      const result = calculateWhatPercent(45, 180);
      expect(result.error).toBeUndefined();
      expect(result.value).toBe(25);
    });

    it("returns zero when part is zero", () => {
      const result = calculateWhatPercent(0, 100);
      expect(result.error).toBeUndefined();
      expect(result.value).toBe(0);
    });

    it("returns an error when the whole is zero", () => {
      const result = calculateWhatPercent(10, 0);
      expect(result.error).toBe("Whole value must be greater than zero.");
    });
  });

  describe("calculateAddSubtractPercent", () => {
    it("returns values after adding and subtracting a percentage", () => {
      const result = calculateAddSubtractPercent(250, 10);
      expect(result.error).toBeUndefined();
      expect(result.addValue).toBeCloseTo(275);
      expect(result.subtractValue).toBeCloseTo(225);
    });

    it("handles negative percentages correctly", () => {
      const result = calculateAddSubtractPercent(100, -10);
      expect(result.error).toBeUndefined();
      expect(result.addValue).toBeCloseTo(90);
      expect(result.subtractValue).toBeCloseTo(110);
    });

    it("handles negative base values correctly", () => {
      const result = calculateAddSubtractPercent(-100, 10);
      expect(result.error).toBeUndefined();
      expect(result.addValue).toBeCloseTo(-110);
      expect(result.subtractValue).toBeCloseTo(-90);
    });

    it("handles zero base value correctly", () => {
      const result = calculateAddSubtractPercent(0, 10);
      expect(result.error).toBeUndefined();
      expect(result.addValue).toBe(0);
      expect(result.subtractValue).toBe(0);
    });

    it("returns an error for invalid inputs", () => {
      const result = calculateAddSubtractPercent(Number.NaN, 10);
      expect(result.error).toBeTruthy();
    });
  });
});
