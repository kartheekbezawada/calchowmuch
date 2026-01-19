import { describe, it, expect } from 'vitest';
import { formatNumber, formatCurrency, formatPercent } from '../../../public/assets/js/core/format.js';

describe('format utilities', () => {
  describe('formatNumber', () => {
    it('should format numbers with default options', () => {
      expect(formatNumber(1234.5678)).toMatch(/1,234\.57|1234.57/); // Different locales may or may not use comma
    });

    it('should format integers', () => {
      expect(formatNumber(42)).toMatch(/42/);
    });

    it('should handle custom maximumFractionDigits', () => {
      const result = formatNumber(3.14159, { maximumFractionDigits: 3 });
      expect(result).toMatch(/3\.14[12]?/); // Allow for rounding differences
    });

    it('should handle custom minimumFractionDigits', () => {
      const result = formatNumber(5, { minimumFractionDigits: 2 });
      expect(result).toContain('5');
    });

    it('should return em dash for null', () => {
      expect(formatNumber(null)).toBe('—');
    });

    it('should return em dash for undefined', () => {
      expect(formatNumber(undefined)).toBe('—');
    });

    it('should return em dash for NaN', () => {
      expect(formatNumber(NaN)).toBe('—');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    it('should handle negative numbers', () => {
      const result = formatNumber(-42.5);
      expect(result).toContain('-');
      expect(result).toContain('42');
    });

    it('should handle very large numbers', () => {
      const result = formatNumber(1234567890);
      expect(result).toMatch(/1,234,567,890|1234567890/);
    });

    it('should handle very small numbers', () => {
      const result = formatNumber(0.0001);
      expect(result).toBe('0');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with default USD', () => {
      const result = formatCurrency(1234.56);
      expect(result).toMatch(/\$|USD/); // Should contain dollar sign or USD
      expect(result).toMatch(/1,?234\.56/); // Should contain the number
    });

    it('should handle zero', () => {
      const result = formatCurrency(0);
      expect(result).toMatch(/\$|USD/);
      expect(result).toMatch(/0/);
    });

    it('should format negative amounts', () => {
      const result = formatCurrency(-50.25);
      expect(result).toContain('-');
      expect(result).toMatch(/50\.25/);
    });

    it('should return em dash for null', () => {
      expect(formatCurrency(null)).toBe('—');
    });

    it('should return em dash for undefined', () => {
      expect(formatCurrency(undefined)).toBe('—');
    });

    it('should return em dash for NaN', () => {
      expect(formatCurrency(NaN)).toBe('—');
    });

    it('should handle custom currency', () => {
      const result = formatCurrency(100, 'EUR');
      expect(result).toMatch(/€|EUR/);
    });

    it('should round to 2 decimal places', () => {
      const result = formatCurrency(10.999);
      expect(result).toMatch(/11\.00/);
    });

    it('should handle large amounts', () => {
      const result = formatCurrency(1234567.89);
      expect(result).toMatch(/1,?234,?567\.89/);
    });
  });

  describe('formatPercent', () => {
    it('should format percentage with default options', () => {
      expect(formatPercent(50)).toBe('50%');
    });

    it('should format decimal percentages', () => {
      const result = formatPercent(42.567);
      expect(result).toMatch(/42\.57%/);
    });

    it('should handle zero', () => {
      expect(formatPercent(0)).toBe('0%');
    });

    it('should handle negative percentages', () => {
      const result = formatPercent(-25.5);
      expect(result).toMatch(/-25\.5%/);
    });

    it('should return em dash for null', () => {
      expect(formatPercent(null)).toBe('—');
    });

    it('should return em dash for undefined', () => {
      expect(formatPercent(undefined)).toBe('—');
    });

    it('should return em dash for NaN', () => {
      expect(formatPercent(NaN)).toBe('—');
    });

    it('should handle custom maximumFractionDigits', () => {
      const result = formatPercent(33.333333, { maximumFractionDigits: 4 });
      expect(result).toMatch(/33\.333[3]?%/);
    });

    it('should handle percentages over 100', () => {
      expect(formatPercent(150)).toBe('150%');
    });

    it('should handle very small percentages', () => {
      const result = formatPercent(0.001);
      expect(result).toBe('0%');
    });

    it('should handle large percentages', () => {
      const result = formatPercent(1234.56);
      expect(result).toMatch(/1,?234\.56%/);
    });
  });
});
