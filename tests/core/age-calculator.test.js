import { describe, it, expect } from 'vitest';
import { calculateExactAge } from '../../public/assets/js/core/date-diff-utils.js';

describe('Age Calculator - calendar-aware exact age', () => {
  it('should calculate exact age using calendar months and days', () => {
    const birth = new Date(1990, 5, 15);
    const asOf = new Date(2025, 8, 1);
    const age = calculateExactAge(birth, asOf);

    expect(age).toEqual({ years: 35, months: 2, days: 17 });
  });

  it('should return exact years for matching anniversary', () => {
    const birth = new Date(2000, 0, 1);
    const asOf = new Date(2001, 0, 1);
    const age = calculateExactAge(birth, asOf);

    expect(age).toEqual({ years: 1, months: 0, days: 0 });
  });

  it('should handle leap year birthdays', () => {
    const birth = new Date(2000, 1, 29);
    const asOf = new Date(2001, 1, 28);
    const age = calculateExactAge(birth, asOf);

    expect(age).toEqual({ years: 1, months: 0, days: 0 });
  });

  it('should return null for invalid dates', () => {
    const invalid = new Date('invalid');
    expect(calculateExactAge(invalid, new Date())).toBeNull();
  });
});
