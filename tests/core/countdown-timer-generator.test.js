import { describe, it, expect } from 'vitest';
import { calculateCountdown } from '../../public/assets/js/core/date-diff-utils.js';

describe('Countdown Timer Generator', () => {
  it('should calculate countdown breakdown for a future target', () => {
    const reference = new Date(2026, 0, 1, 0, 0, 0);
    const target = new Date(2026, 0, 2, 3, 4, 5);
    const result = calculateCountdown(target, reference);

    expect(result).not.toBeNull();
    expect(result.days).toBe(1);
    expect(result.hours).toBe(3);
    expect(result.minutes).toBe(4);
    expect(result.seconds).toBe(5);
    expect(result.totalSeconds).toBe(1 * 86400 + 3 * 3600 + 4 * 60 + 5);
    expect(result.totalMinutes).toBeCloseTo(1624.0833, 3);
    expect(result.totalHours).toBeCloseTo(27.068, 3);
  });

  it('should return zero countdown for same time', () => {
    const reference = new Date(2026, 0, 1, 12, 0, 0);
    const target = new Date(2026, 0, 1, 12, 0, 0);
    const result = calculateCountdown(target, reference);

    expect(result).not.toBeNull();
    expect(result.totalSeconds).toBe(0);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });

  it('should return null for past or invalid dates', () => {
    const reference = new Date(2026, 0, 1, 12, 0, 0);
    const past = new Date(2026, 0, 1, 11, 59, 59);
    const invalid = new Date('invalid');

    expect(calculateCountdown(past, reference)).toBeNull();
    expect(calculateCountdown(invalid, reference)).toBeNull();
  });
});
