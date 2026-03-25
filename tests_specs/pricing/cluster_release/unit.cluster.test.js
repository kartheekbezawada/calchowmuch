import { describe, expect, it } from 'vitest';
import {
  calculateCommission,
  calculateMargin,
  calculateMarkupFromCost,
  calculateMarkupFromPrice,
  percentOf,
} from '../../../public/assets/js/core/math.js';

describe('pricing cluster shared math helpers', () => {
  it('PRICE-CLUSTER-U-1: percentOf supports discount math', () => {
    expect(percentOf(25, 80)).toBe(20);
    expect(80 - percentOf(25, 80)).toBe(60);
  });

  it('PRICE-CLUSTER-U-2: calculateCommission supports flat rates', () => {
    const result = calculateCommission({ sales: 20000, mode: 'flat', rate: 7.5 });

    expect(result).not.toBeNull();
    expect(result.totalCommission).toBeCloseTo(1500, 8);
    expect(result.effectiveRate).toBeCloseTo(7.5, 8);
  });

  it('PRICE-CLUSTER-U-3: calculateMargin supports cost-price mode', () => {
    const result = calculateMargin({ mode: 'cost-price', cost: 60, price: 100 });

    expect(result).not.toBeNull();
    expect(result.marginPercent).toBeCloseTo(40, 8);
    expect(result.profit).toBeCloseTo(40, 8);
  });

  it('PRICE-CLUSTER-U-4: markup helpers support both directions', () => {
    const forward = calculateMarkupFromCost(80, 25);
    expect(forward).not.toBeNull();
    expect(forward.price).toBeCloseTo(100, 8);

    const reverse = calculateMarkupFromPrice(80, 100);
    expect(reverse).not.toBeNull();
    expect(reverse.markupPercent).toBeCloseTo(25, 8);
  });

  it('PRICE-CLUSTER-U-5: shared helpers reject invalid pricing inputs', () => {
    expect(calculateCommission({ sales: -1, mode: 'flat', rate: 5 })).toBeNull();
    expect(calculateMargin({ mode: 'cost-price', cost: -1, price: 100 })).toBeNull();

    const zeroCostMarkup = calculateMarkupFromPrice(0, 100);
    expect(zeroCostMarkup).not.toBeNull();
    expect(zeroCostMarkup.markupPercent).toBeNull();
  });
});
