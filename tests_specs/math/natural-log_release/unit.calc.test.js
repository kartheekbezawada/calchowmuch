import { describe, expect, it } from 'vitest';
import { calculateNaturalLog } from '../../../public/assets/js/core/logarithm.js';

describe('math/natural-log unit', () => {
  it('returns 1 for e within floating-point tolerance', () => {
    expect(calculateNaturalLog(Math.E)).toBeCloseTo(1, 10);
  });

  it('returns null for non-positive inputs', () => {
    expect(calculateNaturalLog(0)).toBeNull();
    expect(calculateNaturalLog(-5)).toBeNull();
  });
});
