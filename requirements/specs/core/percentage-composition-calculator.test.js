import { describe, expect, it } from 'vitest';

import { calculatePercentageComposition } from '../../../public/assets/js/core/math.js';

describe('calculatePercentageComposition', () => {
  describe('Calculated Total mode (no known total)', () => {
    it('standard: 3 items totaling 1000', () => {
      const result = calculatePercentageComposition([
        { name: 'A', value: 300 },
        { name: 'B', value: 200 },
        { name: 'C', value: 500 },
      ]);
      expect(result.total).toBe(1000);
      expect(result.sumItems).toBe(1000);
      expect(result.useKnownTotal).toBe(false);
      expect(result.items[0].percent).toBe(30);
      expect(result.items[1].percent).toBe(20);
      expect(result.items[2].percent).toBe(50);
      expect(result.remainingValue).toBe(0);
      expect(result.remainderPercent).toBe(0);
    });

    it('single item: 100% share', () => {
      const result = calculatePercentageComposition([{ name: 'Only', value: 250 }]);
      expect(result.items[0].percent).toBe(100);
      expect(result.total).toBe(250);
    });

    it('equal items: equal shares', () => {
      const result = calculatePercentageComposition([
        { value: 100 },
        { value: 100 },
        { value: 100 },
        { value: 100 },
      ]);
      expect(result.items.length).toBe(4);
      result.items.forEach((item) => {
        expect(item.percent).toBe(25);
      });
    });

    it('decimal values', () => {
      const result = calculatePercentageComposition([{ value: 33.33 }, { value: 66.67 }]);
      expect(result.total).toBeCloseTo(100);
      expect(result.items[0].percent).toBeCloseTo(33.33);
      expect(result.items[1].percent).toBeCloseTo(66.67);
    });

    it('all zeros: returns null', () => {
      const result = calculatePercentageComposition([{ value: 0 }, { value: 0 }]);
      expect(result).toBeNull();
    });

    it('default item names', () => {
      const result = calculatePercentageComposition([{ value: 50 }, { value: 50 }]);
      expect(result.items[0].name).toBe('Item 1');
      expect(result.items[1].name).toBe('Item 2');
    });
  });

  describe('Known Total mode', () => {
    it('items less than total: positive remainder', () => {
      const result = calculatePercentageComposition([{ value: 200 }, { value: 300 }], 1000);
      expect(result.total).toBe(1000);
      expect(result.sumItems).toBe(500);
      expect(result.useKnownTotal).toBe(true);
      expect(result.remainingValue).toBe(500);
      expect(result.remainderPercent).toBe(50);
      expect(result.items[0].percent).toBe(20);
      expect(result.items[1].percent).toBe(30);
    });

    it('items equal total: zero remainder', () => {
      const result = calculatePercentageComposition([{ value: 400 }, { value: 600 }], 1000);
      expect(result.remainingValue).toBe(0);
      expect(result.remainderPercent).toBe(0);
    });

    it('items exceed total: negative remainder', () => {
      const result = calculatePercentageComposition([{ value: 600 }, { value: 500 }], 1000);
      expect(result.remainingValue).toBe(-100);
      expect(result.remainderPercent).toBe(-10);
    });

    it('known total zero: returns null', () => {
      const result = calculatePercentageComposition([{ value: 100 }], 0);
      expect(result).toBeNull();
    });

    it('totalPercent sums correctly with remainder', () => {
      const result = calculatePercentageComposition([{ value: 200 }, { value: 300 }], 1000);
      expect(result.totalPercent).toBeCloseTo(100);
    });
  });

  describe('Edge cases', () => {
    it('empty array: returns null', () => {
      expect(calculatePercentageComposition([])).toBeNull();
    });

    it('null input: returns null', () => {
      expect(calculatePercentageComposition(null)).toBeNull();
    });

    it('invalid item value: returns null', () => {
      expect(calculatePercentageComposition([{ value: 'abc' }])).toBeNull();
    });

    it('NaN item value: returns null', () => {
      expect(calculatePercentageComposition([{ value: NaN }])).toBeNull();
    });

    it('invalid known total: returns null', () => {
      expect(calculatePercentageComposition([{ value: 100 }], 'abc')).toBeNull();
    });

    it('large values', () => {
      const result = calculatePercentageComposition([{ value: 5000000 }, { value: 5000000 }]);
      expect(result.items[0].percent).toBe(50);
      expect(result.total).toBe(10000000);
    });

    it('string values that parse to numbers', () => {
      const result = calculatePercentageComposition([
        { name: 'X', value: '300' },
        { name: 'Y', value: '700' },
      ]);
      expect(result.items[0].percent).toBe(30);
      expect(result.items[1].percent).toBe(70);
    });
  });
});
