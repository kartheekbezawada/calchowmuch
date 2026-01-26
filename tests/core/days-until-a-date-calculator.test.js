import { describe, it, expect } from 'vitest';
import { calculateDaysUntil } from '../../public/assets/js/core/date-diff-utils.js';

describe('Days Until a Date Calculator', () => {
  it('should calculate days until a future date', () => {
    const today = new Date(2026, 0, 1);
    const target = new Date(2026, 0, 11);
    expect(calculateDaysUntil(target, today)).toBe(10);
  });

  it('should return zero for today', () => {
    const today = new Date(2026, 0, 1);
    const target = new Date(2026, 0, 1);
    expect(calculateDaysUntil(target, today)).toBe(0);
  });

  it('should calculate days since for past dates', () => {
    const today = new Date(2026, 0, 10);
    const target = new Date(2026, 0, 1);
    expect(calculateDaysUntil(target, today)).toBe(-9);
  });

  it('should return null for invalid dates', () => {
    const invalid = new Date('invalid');
    expect(calculateDaysUntil(invalid, new Date())).toBeNull();
  });
});
