import { describe, expect, it } from 'vitest';
import { calculateMargin } from '../../public/assets/js/core/math.js';

describe('Margin Calculator - MARG-TEST-U-1: cost + price mode', () => {
  it('calculates gross margin and profit from cost and price', () => {
    const result = calculateMargin({ mode: 'cost-price', cost: 60, price: 100 });

    expect(result).not.toBeNull();
    expect(result.profit).toBeCloseTo(40, 8);
    expect(result.marginPercent).toBeCloseTo(40, 8);
    expect(result.price).toBeCloseTo(100, 8);
  });

  it('supports negative margin when selling price is below cost', () => {
    const result = calculateMargin({ mode: 'cost-price', cost: 120, price: 100 });

    expect(result).not.toBeNull();
    expect(result.profit).toBeCloseTo(-20, 8);
    expect(result.marginPercent).toBeCloseTo(-20, 8);
  });
});

describe('Margin Calculator - MARG-TEST-U-2: cost + margin mode', () => {
  it('calculates selling price and profit from cost and gross margin percent', () => {
    const result = calculateMargin({ mode: 'cost-margin', cost: 60, marginPercent: 40 });

    expect(result).not.toBeNull();
    expect(result.price).toBeCloseTo(100, 8);
    expect(result.profit).toBeCloseTo(40, 8);
    expect(result.marginPercent).toBeCloseTo(40, 8);
  });
});

describe('Margin Calculator - MARG-TEST-U-3: validation', () => {
  it('returns null for invalid divide-by-zero cases', () => {
    expect(calculateMargin({ mode: 'cost-price', cost: 50, price: 0 })).toBeNull();
    expect(calculateMargin({ mode: 'cost-margin', cost: 50, marginPercent: 100 })).toBeNull();
  });

  it('returns null for invalid negative inputs', () => {
    expect(calculateMargin({ mode: 'cost-price', cost: -1, price: 10 })).toBeNull();
    expect(calculateMargin({ mode: 'cost-price', cost: 10, price: -1 })).toBeNull();
    expect(calculateMargin({ mode: 'cost-margin', cost: 10, marginPercent: -5 })).toBeNull();
  });
});
