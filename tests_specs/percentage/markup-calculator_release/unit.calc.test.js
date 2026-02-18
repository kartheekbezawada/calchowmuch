import { describe, it, expect } from 'vitest';
import {
  calculateMarkupFromCost,
  calculateMarkupFromPrice,
  calculateBasketMarkup,
} from '../../../public/assets/js/core/math.js';

describe('markup calculator — single product (cost → price)', () => {
  it('MARKUP-TEST-U-1: 40% markup on $50 cost → price $70, markup amount $20', () => {
    const result = calculateMarkupFromCost(50, 40);
    expect(result.price).toBe(70);
    expect(result.markupAmount).toBe(20);
    expect(result.markupPercent).toBe(40);
    expect(result.cost).toBe(50);
  });

  it('MARKUP-TEST-U-2: 0% markup → price equals cost', () => {
    const result = calculateMarkupFromCost(100, 0);
    expect(result.price).toBe(100);
    expect(result.markupAmount).toBe(0);
  });

  it('MARKUP-TEST-U-3: 100% markup → price is double cost', () => {
    const result = calculateMarkupFromCost(60, 100);
    expect(result.price).toBe(120);
    expect(result.markupAmount).toBe(60);
  });

  it('MARKUP-TEST-U-4: decimal markup 12.5% on $200 → price $225', () => {
    const result = calculateMarkupFromCost(200, 12.5);
    expect(result.price).toBe(225);
    expect(result.markupAmount).toBe(25);
  });

  it('MARKUP-TEST-U-5: cost zero → price zero, markup amount zero', () => {
    const result = calculateMarkupFromCost(0, 50);
    expect(result.price).toBe(0);
    expect(result.markupAmount).toBe(0);
  });

  it('MARKUP-TEST-U-6: invalid input → null', () => {
    expect(calculateMarkupFromCost('abc', 10)).toBeNull();
    expect(calculateMarkupFromCost(50, NaN)).toBeNull();
  });
});

describe('markup calculator — single product (price → markup %)', () => {
  it('MARKUP-TEST-U-7: cost $50, price $70 → markup 40%', () => {
    const result = calculateMarkupFromPrice(50, 70);
    expect(result.markupPercent).toBe(40);
    expect(result.markupAmount).toBe(20);
  });

  it('MARKUP-TEST-U-8: cost $100, price $100 → markup 0%', () => {
    const result = calculateMarkupFromPrice(100, 100);
    expect(result.markupPercent).toBe(0);
    expect(result.markupAmount).toBe(0);
  });

  it('MARKUP-TEST-U-9: price below cost → negative markup', () => {
    const result = calculateMarkupFromPrice(100, 80);
    expect(result.markupPercent).toBe(-20);
    expect(result.markupAmount).toBe(-20);
  });

  it('MARKUP-TEST-U-10: cost zero → markup percent null (divide by zero)', () => {
    const result = calculateMarkupFromPrice(0, 50);
    expect(result.markupPercent).toBeNull();
    expect(result.markupAmount).toBe(50);
  });

  it('MARKUP-TEST-U-11: invalid input → null', () => {
    expect(calculateMarkupFromPrice(NaN, 70)).toBeNull();
    expect(calculateMarkupFromPrice(50, undefined)).toBeNull();
  });
});

describe('markup calculator — basket (weighted average markup)', () => {
  it('MARKUP-TEST-U-12: basket cost→price mode, 3 products', () => {
    const rows = [
      { cost: 50, markupPercent: 40, quantity: 1, mode: 'cost-to-price' },
      { cost: 30, markupPercent: 60, quantity: 1, mode: 'cost-to-price' },
      { cost: 80, markupPercent: 25, quantity: 1, mode: 'cost-to-price' },
    ];
    const result = calculateBasketMarkup(rows);
    expect(result).not.toBeNull();
    expect(result.rows).toHaveLength(3);
    expect(result.rows[0].price).toBe(70);
    expect(result.rows[1].price).toBe(48);
    expect(result.rows[2].price).toBe(100);
    expect(result.totalCost).toBe(160);
    expect(result.totalPrice).toBe(218);
    expect(result.totalMarkup).toBe(58);
    expect(result.basketMarkupPercent).toBeCloseTo(36.25, 2);
  });

  it('MARKUP-TEST-U-13: basket price→markup mode', () => {
    const rows = [
      { cost: 50, price: 70, quantity: 1, mode: 'price-to-markup' },
      { cost: 30, price: 48, quantity: 1, mode: 'price-to-markup' },
    ];
    const result = calculateBasketMarkup(rows);
    expect(result).not.toBeNull();
    expect(result.rows[0].markupPercent).toBe(40);
    expect(result.rows[1].markupPercent).toBe(60);
    expect(result.totalCost).toBe(80);
    expect(result.totalPrice).toBe(118);
    expect(result.basketMarkupPercent).toBeCloseTo(47.5, 2);
  });

  it('MARKUP-TEST-U-14: basket with quantities', () => {
    const rows = [
      { cost: 10, markupPercent: 50, quantity: 5, mode: 'cost-to-price' },
      { cost: 20, markupPercent: 25, quantity: 3, mode: 'cost-to-price' },
    ];
    const result = calculateBasketMarkup(rows);
    expect(result.totalQuantity).toBe(8);
    expect(result.totalCost).toBe(110);
    expect(result.totalPrice).toBe(150);
    expect(result.totalMarkup).toBe(40);
    expect(result.basketMarkupPercent).toBeCloseTo(36.3636, 2);
  });

  it('MARKUP-TEST-U-15: basket with all cost zero → basket markup percent null', () => {
    const rows = [
      { cost: 0, price: 50, quantity: 1, mode: 'price-to-markup' },
      { cost: 0, price: 30, quantity: 1, mode: 'price-to-markup' },
    ];
    const result = calculateBasketMarkup(rows);
    expect(result).not.toBeNull();
    expect(result.basketMarkupPercent).toBeNull();
    expect(result.rows[0].markupPercent).toBeNull();
  });

  it('MARKUP-TEST-U-16: empty rows → null', () => {
    expect(calculateBasketMarkup([])).toBeNull();
  });

  it('MARKUP-TEST-U-17: invalid row data → null', () => {
    const rows = [{ cost: 'abc', markupPercent: 10, quantity: 1, mode: 'cost-to-price' }];
    expect(calculateBasketMarkup(rows)).toBeNull();
  });

  it('MARKUP-TEST-U-18: zero quantity → null', () => {
    const rows = [{ cost: 50, markupPercent: 40, quantity: 0, mode: 'cost-to-price' }];
    expect(calculateBasketMarkup(rows)).toBeNull();
  });
});
