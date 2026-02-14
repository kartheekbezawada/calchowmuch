import { describe, it, expect } from 'vitest';
import { percentOf } from '../../../public/assets/js/core/math.js';

describe('discount calculator formulas', () => {
  it('DISC-TEST-U-1: 25% off 80 → discount 20, final 60', () => {
    const discountAmount = percentOf(25, 80);
    expect(discountAmount).toBe(20);
    expect(80 - discountAmount).toBe(60);
  });

  it('DISC-TEST-U-2: 0% off 100 → discount 0, final 100', () => {
    const discountAmount = percentOf(0, 100);
    expect(discountAmount).toBe(0);
    expect(100 - discountAmount).toBe(100);
  });

  it('DISC-TEST-U-3: 100% off 50 → discount 50, final 0', () => {
    const discountAmount = percentOf(100, 50);
    expect(discountAmount).toBe(50);
    expect(50 - discountAmount).toBe(0);
  });

  it('DISC-TEST-U-4: discount over 100% → negative final price', () => {
    const discountAmount = percentOf(150, 80);
    expect(discountAmount).toBe(120);
    expect(80 - discountAmount).toBe(-40);
  });

  it('DISC-TEST-U-5: decimal discount 12.5% off 200 → discount 25, final 175', () => {
    const discountAmount = percentOf(12.5, 200);
    expect(discountAmount).toBe(25);
    expect(200 - discountAmount).toBe(175);
  });

  it('DISC-TEST-U-6: original price 0 → discount 0, final 0', () => {
    const discountAmount = percentOf(25, 0);
    expect(discountAmount).toBe(0);
    expect(0 - discountAmount).toBe(0);
  });

  it('DISC-TEST-U-7: large values → correct precision', () => {
    const discountAmount = percentOf(10, 999999.99);
    expect(discountAmount).toBeCloseTo(99999.999, 3);
    expect(999999.99 - discountAmount).toBeCloseTo(899999.991, 3);
  });

  it('DISC-TEST-U-8: small decimal percentage 0.5% off 200 → discount 1, final 199', () => {
    const discountAmount = percentOf(0.5, 200);
    expect(discountAmount).toBe(1);
    expect(200 - discountAmount).toBe(199);
  });
});
