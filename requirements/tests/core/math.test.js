import { describe, it, expect } from 'vitest';
import { add, subtract, multiply, divide, percentageChange, percentOf } from '../../../public/assets/js/core/math.js';

describe('math utilities', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(add(-5, -3)).toBe(-8);
    });

    it('should add positive and negative numbers', () => {
      expect(add(10, -4)).toBe(6);
    });

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
    });

    it('should handle decimals', () => {
      expect(add(1.5, 2.3)).toBeCloseTo(3.8);
    });
  });

  describe('subtract', () => {
    it('should subtract two positive numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    it('should handle negative results', () => {
      expect(subtract(3, 5)).toBe(-2);
    });

    it('should subtract negative numbers', () => {
      expect(subtract(-5, -3)).toBe(-2);
    });

    it('should handle zero', () => {
      expect(subtract(5, 0)).toBe(5);
      expect(subtract(0, 5)).toBe(-5);
    });

    it('should handle decimals', () => {
      expect(subtract(5.5, 2.3)).toBeCloseTo(3.2);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      expect(multiply(4, 5)).toBe(20);
    });

    it('should multiply negative numbers', () => {
      expect(multiply(-3, -4)).toBe(12);
      expect(multiply(-3, 4)).toBe(-12);
    });

    it('should handle zero', () => {
      expect(multiply(5, 0)).toBe(0);
      expect(multiply(0, 5)).toBe(0);
    });

    it('should handle decimals', () => {
      expect(multiply(2.5, 4)).toBeCloseTo(10);
    });
  });

  describe('divide', () => {
    it('should divide two positive numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('should handle negative numbers', () => {
      expect(divide(-10, 2)).toBe(-5);
      expect(divide(10, -2)).toBe(-5);
      expect(divide(-10, -2)).toBe(5);
    });

    it('should handle decimals', () => {
      expect(divide(7.5, 2.5)).toBe(3);
    });

    it('should return null when dividing by zero', () => {
      expect(divide(5, 0)).toBe(null);
      expect(divide(0, 0)).toBe(null);
    });

    it('should handle dividing zero by a number', () => {
      expect(divide(0, 5)).toBe(0);
    });
  });

  describe('percentageChange', () => {
    it('should calculate positive percentage change', () => {
      expect(percentageChange(50, 75)).toBe(50);
    });

    it('should calculate negative percentage change', () => {
      expect(percentageChange(100, 75)).toBe(-25);
    });

    it('should handle no change', () => {
      expect(percentageChange(50, 50)).toBe(0);
    });

    it('should return null when fromValue is zero', () => {
      expect(percentageChange(0, 50)).toBe(null);
    });

    it('should handle decimal values', () => {
      expect(percentageChange(50, 60)).toBeCloseTo(20);
    });

    it('should handle large percentage increases', () => {
      expect(percentageChange(10, 100)).toBe(900);
    });
  });

  describe('percentOf', () => {
    it('should calculate percentage of a value', () => {
      expect(percentOf(50, 100)).toBe(50);
    });

    it('should handle zero percent', () => {
      expect(percentOf(0, 100)).toBe(0);
    });

    it('should handle 100 percent', () => {
      expect(percentOf(100, 50)).toBe(50);
    });

    it('should handle decimal percentages', () => {
      expect(percentOf(25.5, 200)).toBeCloseTo(51);
    });

    it('should handle percentages over 100', () => {
      expect(percentOf(150, 100)).toBe(150);
    });

    it('should handle zero value', () => {
      expect(percentOf(50, 0)).toBe(0);
    });
  });
});
