import { describe, it, expect } from 'vitest';
import {
  calculateBirthdayWeekdays,
  getWeekdayName,
} from '../../public/assets/js/core/date-diff-utils.js';

describe('Birthday Day-of-Week Calculator', () => {
  it('should calculate birth weekday and target-year weekday', () => {
    const birthDate = new Date(2000, 0, 1);
    const result = calculateBirthdayWeekdays(birthDate, 2025);
    expect(result?.birthWeekday).toBe('Saturday');
    expect(result?.targetWeekday).toBe(getWeekdayName(new Date(2025, 0, 1)));
  });

  it('should treat Feb 29 as Feb 28 in non-leap target years', () => {
    const birthDate = new Date(2000, 1, 29);
    const result = calculateBirthdayWeekdays(birthDate, 2021);
    expect(result).not.toBeNull();
    expect(result?.targetDate.getDate()).toBe(28);
    expect(result?.targetWeekday).toBe(getWeekdayName(new Date(2021, 1, 28)));
  });

  it('should return null for invalid target years', () => {
    const birthDate = new Date(2000, 0, 1);
    expect(calculateBirthdayWeekdays(birthDate, 2025.5)).toBeNull();
  });

  it('should return null for invalid dates', () => {
    const invalid = new Date('invalid');
    expect(calculateBirthdayWeekdays(invalid, 2025)).toBeNull();
  });
});
