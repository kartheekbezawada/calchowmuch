import { describe, expect, it } from 'vitest';
import { percentageChange } from '../../public/assets/js/core/math.js';

describe('Percentage Increase Calculator - PINC-TEST-U-1: core formula', () => {
  it('calculates increase from 80 to 100 as 25%', () => {
    expect(percentageChange(80, 100)).toBeCloseTo(25, 8);
  });

  it('supports decimals and large values', () => {
    expect(percentageChange(0.5, 0.75)).toBeCloseTo(50, 8);
    expect(percentageChange(1000, 1500)).toBeCloseTo(50, 8);
  });
});

describe('Percentage Increase Calculator - PINC-TEST-U-2: edge cases', () => {
  it('returns null when original value is zero', () => {
    expect(percentageChange(0, 100)).toBeNull();
  });

  it('can return negative result when new value is smaller (decrease)', () => {
    expect(percentageChange(100, 90)).toBeCloseTo(-10, 8);
  });
});
