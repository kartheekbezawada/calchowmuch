import { describe, expect, it } from 'vitest';
import { calculatePercentageComposition } from '../../../public/assets/js/core/math.js';

describe('Percentage Composition Calculator - PCOMP-TEST-U-1: calculated mode', () => {
  it('computes shares in calculated mode from item sum', () => {
    const result = calculatePercentageComposition([
      { name: 'A', value: 300 },
      { name: 'B', value: 200 },
      { name: 'C', value: 500 },
    ]);

    expect(result).not.toBeNull();
    expect(result.total).toBeCloseTo(1000, 8);
    expect(result.items[0].percent).toBeCloseTo(30, 8);
    expect(result.items[1].percent).toBeCloseTo(20, 8);
    expect(result.items[2].percent).toBeCloseTo(50, 8);
  });

  it('supports decimals and keeps stable percentages', () => {
    const result = calculatePercentageComposition([{ value: 33.33 }, { value: 66.67 }]);

    expect(result).not.toBeNull();
    expect(result.total).toBeCloseTo(100, 8);
    expect(result.items[0].percent).toBeCloseTo(33.33, 2);
    expect(result.items[1].percent).toBeCloseTo(66.67, 2);
  });
});

describe('Percentage Composition Calculator - PCOMP-TEST-U-2: known total and remainder', () => {
  it('computes positive remainder when sum is below known total', () => {
    const result = calculatePercentageComposition([{ value: 200 }, { value: 300 }], 1000);

    expect(result).not.toBeNull();
    expect(result.useKnownTotal).toBe(true);
    expect(result.remainingValue).toBeCloseTo(500, 8);
    expect(result.remainderPercent).toBeCloseTo(50, 8);
  });

  it('computes zero and negative remainder correctly', () => {
    const exact = calculatePercentageComposition([{ value: 400 }, { value: 600 }], 1000);
    const over = calculatePercentageComposition([{ value: 600 }, { value: 500 }], 1000);

    expect(exact).not.toBeNull();
    expect(exact.remainingValue).toBeCloseTo(0, 8);
    expect(exact.remainderPercent).toBeCloseTo(0, 8);

    expect(over).not.toBeNull();
    expect(over.remainingValue).toBeCloseTo(-100, 8);
    expect(over.remainderPercent).toBeCloseTo(-10, 8);
  });
});

describe('Percentage Composition Calculator - PCOMP-TEST-U-3: guards', () => {
  it('returns null for invalid total or invalid values', () => {
    expect(calculatePercentageComposition([{ value: 100 }], 0)).toBeNull();
    expect(calculatePercentageComposition([{ value: Number.NaN }])).toBeNull();
    expect(calculatePercentageComposition([{ value: 'abc' }])).toBeNull();
  });

  it('returns null for empty item list', () => {
    expect(calculatePercentageComposition([])).toBeNull();
  });
});
