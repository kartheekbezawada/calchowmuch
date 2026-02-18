import { describe, expect, it } from 'vitest';
import { calculateCommission } from '../../../public/assets/js/core/math.js';

describe('Commission Calculator - COMM-TEST-U-1: flat commission', () => {
  it('calculates commission and effective rate for flat mode', () => {
    const result = calculateCommission({ sales: 20000, mode: 'flat', rate: 7.5 });

    expect(result).not.toBeNull();
    expect(result.totalCommission).toBeCloseTo(1500, 8);
    expect(result.effectiveRate).toBeCloseTo(7.5, 8);
  });

  it('returns zero commission when sales are zero', () => {
    const result = calculateCommission({ sales: 0, mode: 'flat', rate: 10 });

    expect(result).not.toBeNull();
    expect(result.totalCommission).toBeCloseTo(0, 8);
    expect(result.effectiveRate).toBeCloseTo(0, 8);
  });
});

describe('Commission Calculator - COMM-TEST-U-2: tiered commission', () => {
  it('allocates sales across tiers in ascending thresholds', () => {
    const result = calculateCommission({
      sales: 40000,
      mode: 'tiered',
      tiers: [
        { upTo: 10000, rate: 5 },
        { upTo: 25000, rate: 7 },
        { upTo: null, rate: 10 },
      ],
    });

    expect(result).not.toBeNull();
    expect(result.totalCommission).toBeCloseTo(3050, 8);
    expect(result.effectiveRate).toBeCloseTo(7.625, 8);
    expect(result.breakdown).toHaveLength(3);
    expect(result.breakdown[0].sales).toBeCloseTo(10000, 8);
    expect(result.breakdown[1].sales).toBeCloseTo(15000, 8);
    expect(result.breakdown[2].sales).toBeCloseTo(15000, 8);
  });

  it('falls back to last tier rate when no open-ended row exists', () => {
    const result = calculateCommission({
      sales: 30000,
      mode: 'tiered',
      tiers: [
        { upTo: 10000, rate: 5 },
        { upTo: 20000, rate: 8 },
      ],
    });

    expect(result).not.toBeNull();
    expect(result.totalCommission).toBeCloseTo(2100, 8);
  });
});

describe('Commission Calculator - COMM-TEST-U-3: validation', () => {
  it('returns null for descending tier thresholds', () => {
    const result = calculateCommission({
      sales: 20000,
      mode: 'tiered',
      tiers: [
        { upTo: 15000, rate: 5 },
        { upTo: 10000, rate: 7 },
      ],
    });

    expect(result).toBeNull();
  });

  it('returns null for negative values', () => {
    expect(calculateCommission({ sales: -1, mode: 'flat', rate: 5 })).toBeNull();
    expect(calculateCommission({ sales: 1000, mode: 'flat', rate: -2 })).toBeNull();
  });
});
