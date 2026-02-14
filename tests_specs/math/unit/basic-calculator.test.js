import { describe, it, expect } from 'vitest';
import { add, subtract, multiply, divide } from '../../public/assets/js/core/math.js';

/**
 * BASIC-TEST-U-1 - Basic Calculator Unit Tests
 * Test all arithmetic operations with known values
 */
describe('Basic Calculator - BASIC-TEST-U-1: Arithmetic Operations', () => {
  describe('Addition', () => {
    it('should add two positive numbers: 15 + 25 = 40', () => {
      expect(add(15, 25)).toBe(40);
    });

    it('should add negative numbers', () => {
      expect(add(-5, -10)).toBe(-15);
    });

    it('should add positive and negative numbers', () => {
      expect(add(10, -3)).toBe(7);
    });

    it('should add decimals: 1.5 + 2.7 = 4.2', () => {
      expect(add(1.5, 2.7)).toBeCloseTo(4.2);
    });

    it('should handle zero', () => {
      expect(add(5, 0)).toBe(5);
      expect(add(0, 0)).toBe(0);
    });
  });

  describe('Subtraction', () => {
    it('should subtract: 100 - 37 = 63', () => {
      expect(subtract(100, 37)).toBe(63);
    });

    it('should handle negative result', () => {
      expect(subtract(10, 25)).toBe(-15);
    });

    it('should subtract negative numbers', () => {
      expect(subtract(-5, -10)).toBe(5);
    });

    it('should subtract decimals', () => {
      expect(subtract(5.5, 2.3)).toBeCloseTo(3.2);
    });
  });

  describe('Multiplication', () => {
    it('should multiply: 12 × 8 = 96', () => {
      expect(multiply(12, 8)).toBe(96);
    });

    it('should handle zero', () => {
      expect(multiply(100, 0)).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(multiply(-3, 4)).toBe(-12);
      expect(multiply(-3, -4)).toBe(12);
    });

    it('should multiply decimals: 2.5 × 4.2 = 10.5', () => {
      expect(multiply(2.5, 4.2)).toBeCloseTo(10.5);
    });
  });

  describe('Division', () => {
    it('should divide: 84 ÷ 12 = 7', () => {
      expect(divide(84, 12)).toBe(7);
    });

    it('should handle decimal results', () => {
      expect(divide(10, 4)).toBe(2.5);
    });

    it('should handle negative numbers', () => {
      expect(divide(-12, 4)).toBe(-3);
      expect(divide(-12, -4)).toBe(3);
    });

    it('should handle decimal division', () => {
      expect(divide(7.5, 2.5)).toBe(3);
    });
  });
});

/**
 * BASIC-TEST-U-2 - Basic Calculator Edge Cases
 * Test error handling and edge cases
 */
describe('Basic Calculator - BASIC-TEST-U-2: Edge Cases', () => {
  describe('Division by zero', () => {
    it('should return null for division by zero', () => {
      expect(divide(10, 0)).toBe(null);
    });

    it('should return null for 0 / 0', () => {
      expect(divide(0, 0)).toBe(null);
    });
  });

  describe('Large number handling', () => {
    it('should handle large numbers', () => {
      expect(add(999999999, 1)).toBe(1000000000);
      expect(multiply(100000, 100000)).toBe(10000000000);
    });

    it('should handle very small decimals', () => {
      expect(add(0.000001, 0.000002)).toBeCloseTo(0.000003);
    });
  });

  describe('Chained operations', () => {
    it('should support chained add operations', () => {
      // 5 + 3 = 8, then + 2 = 10
      let result = add(5, 3);
      result = add(result, 2);
      expect(result).toBe(10);
    });

    it('should support chained subtract operations', () => {
      // 20 - 5 = 15, then - 3 = 12
      let result = subtract(20, 5);
      result = subtract(result, 3);
      expect(result).toBe(12);
    });

    it('should support chained multiply operations', () => {
      // 2 * 3 = 6, then * 4 = 24
      let result = multiply(2, 3);
      result = multiply(result, 4);
      expect(result).toBe(24);
    });

    it('should support mixed chained operations', () => {
      // 10 + 5 = 15, then * 2 = 30
      let result = add(10, 5);
      result = multiply(result, 2);
      expect(result).toBe(30);
    });
  });

  describe('Memory operations simulation', () => {
    it('should support memory store and recall pattern', () => {
      // Simulate memory operations
      let memory = 0;

      // Calculate 5 * 4 = 20, store to memory
      const result1 = multiply(5, 4);
      memory = result1;
      expect(memory).toBe(20);

      // Calculate 10 + 3 = 13
      const result2 = add(10, 3);
      expect(result2).toBe(13);

      // Recall memory and add to result2: 20 + 13 = 33
      expect(add(memory, result2)).toBe(33);
    });

    it('should support M+ pattern (memory add)', () => {
      let memory = 0;

      // Store 10
      memory = 10;

      // M+ with 5
      memory = add(memory, 5);
      expect(memory).toBe(15);

      // M+ with 3
      memory = add(memory, 3);
      expect(memory).toBe(18);
    });

    it('should support M- pattern (memory subtract)', () => {
      let memory = 100;

      // M- with 25
      memory = subtract(memory, 25);
      expect(memory).toBe(75);

      // M- with 10
      memory = subtract(memory, 10);
      expect(memory).toBe(65);
    });

    it('should support MC pattern (memory clear)', () => {
      let memory = 50;
      expect(memory).toBe(50);
      memory = 0; // MC
      expect(memory).toBe(0);
    });
  });

  describe('Decimal precision limits', () => {
    it('should handle reasonable decimal precision', () => {
      const result = divide(1, 3);
      expect(result).toBeCloseTo(0.3333333333, 8);
    });

    it('should handle floating point edge cases', () => {
      // Classic floating point test: 0.1 + 0.2
      expect(add(0.1, 0.2)).toBeCloseTo(0.3);
    });
  });
});
