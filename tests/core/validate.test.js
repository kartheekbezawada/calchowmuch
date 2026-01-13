import { describe, it, expect } from 'vitest';
import { toNumber, clamp } from '../../public/assets/js/core/validate.js';

describe('validation utilities', () => {
  describe('toNumber', () => {
    it('should convert string to number', () => {
      expect(toNumber('42')).toBe(42);
      expect(toNumber('3.14')).toBe(3.14);
    });

    it('should convert negative strings to numbers', () => {
      expect(toNumber('-42')).toBe(-42);
      expect(toNumber('-3.14')).toBe(-3.14);
    });

    it('should handle zero', () => {
      expect(toNumber('0')).toBe(0);
      expect(toNumber(0)).toBe(0);
    });

    it('should return fallback for invalid values', () => {
      expect(toNumber('abc')).toBe(0);
      expect(toNumber('abc', 10)).toBe(10);
      expect(toNumber(null, 5)).toBe(5);
      expect(toNumber(undefined, 5)).toBe(5);
    });

    it('should return fallback for infinity', () => {
      expect(toNumber(Infinity)).toBe(0);
      expect(toNumber(-Infinity)).toBe(0);
    });

    it('should return fallback for NaN', () => {
      expect(toNumber(NaN)).toBe(0);
    });

    it('should handle numbers directly', () => {
      expect(toNumber(42)).toBe(42);
      expect(toNumber(3.14)).toBe(3.14);
    });

    it('should use custom fallback', () => {
      expect(toNumber('invalid', 100)).toBe(100);
      expect(toNumber('invalid', -50)).toBe(-50);
    });

    it('should handle empty string', () => {
      expect(toNumber('')).toBe(0);
      expect(toNumber('', 99)).toBe(99);
    });

    it('should handle whitespace', () => {
      expect(toNumber('  42  ')).toBe(42);
    });
  });

  describe('clamp', () => {
    it('should return value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it('should clamp to min when value is below range', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(-100, 0, 10)).toBe(0);
    });

    it('should clamp to max when value is above range', () => {
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(1000, 0, 10)).toBe(10);
    });

    it('should handle negative ranges', () => {
      expect(clamp(-5, -10, -1)).toBe(-5);
      expect(clamp(-15, -10, -1)).toBe(-10);
      expect(clamp(0, -10, -1)).toBe(-1);
    });

    it('should handle decimal values', () => {
      expect(clamp(5.5, 0, 10)).toBe(5.5);
      expect(clamp(10.5, 0, 10)).toBe(10);
      expect(clamp(-0.5, 0, 10)).toBe(0);
    });

    it('should return min when value is NaN', () => {
      expect(clamp(NaN, 0, 10)).toBe(0);
      expect(clamp(NaN, -5, 5)).toBe(-5);
    });

    it('should handle same min and max', () => {
      expect(clamp(5, 10, 10)).toBe(10);
      expect(clamp(15, 10, 10)).toBe(10);
    });

    it('should handle zero boundaries', () => {
      expect(clamp(-5, 0, 0)).toBe(0);
      expect(clamp(5, 0, 0)).toBe(0);
      expect(clamp(0, 0, 0)).toBe(0);
    });
  });
});
