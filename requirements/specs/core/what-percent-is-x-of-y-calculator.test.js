import { describe, expect, it } from 'vitest';

import { calculateWhatPercentIsXOfY } from '../../../public/assets/js/core/math.js';

describe('calculateWhatPercentIsXOfY', () => {
  it('standard: 25 is 12.5% of 200', () => {
    const result = calculateWhatPercentIsXOfY(25, 200);
    expect(result.part).toBe(25);
    expect(result.whole).toBe(200);
    expect(result.percent).toBe(12.5);
  });

  it('50 out of 200 is 25%', () => {
    const result = calculateWhatPercentIsXOfY(50, 200);
    expect(result.percent).toBe(25);
  });

  it('X equals Y: 100%', () => {
    const result = calculateWhatPercentIsXOfY(100, 100);
    expect(result.percent).toBe(100);
  });

  it('X greater than Y: result > 100%', () => {
    const result = calculateWhatPercentIsXOfY(300, 200);
    expect(result.percent).toBe(150);
  });

  it('X is 0: result is 0%', () => {
    const result = calculateWhatPercentIsXOfY(0, 200);
    expect(result.percent).toBe(0);
  });

  it('Y is 0: returns null (division by zero)', () => {
    const result = calculateWhatPercentIsXOfY(25, 0);
    expect(result).toBeNull();
  });

  it('both zero: returns null', () => {
    const result = calculateWhatPercentIsXOfY(0, 0);
    expect(result).toBeNull();
  });

  it('decimal values: 1.5 of 6 is 25%', () => {
    const result = calculateWhatPercentIsXOfY(1.5, 6);
    expect(result.percent).toBe(25);
  });

  it('small decimals: 0.125 of 1 is 12.5%', () => {
    const result = calculateWhatPercentIsXOfY(0.125, 1);
    expect(result.percent).toBe(12.5);
  });

  it('negative X: negative percentage', () => {
    const result = calculateWhatPercentIsXOfY(-25, 200);
    expect(result.percent).toBe(-12.5);
  });

  it('negative Y: negative percentage', () => {
    const result = calculateWhatPercentIsXOfY(25, -200);
    expect(result.percent).toBe(-12.5);
  });

  it('both negative: positive percentage', () => {
    const result = calculateWhatPercentIsXOfY(-25, -200);
    expect(result.percent).toBe(12.5);
  });

  it('large values: 500000 of 1000000 is 50%', () => {
    const result = calculateWhatPercentIsXOfY(500000, 1000000);
    expect(result.percent).toBe(50);
  });

  it('string inputs that parse to numbers', () => {
    const result = calculateWhatPercentIsXOfY('25', '200');
    expect(result.part).toBe(25);
    expect(result.whole).toBe(200);
    expect(result.percent).toBe(12.5);
  });

  it('invalid input: non-numeric part → null', () => {
    expect(calculateWhatPercentIsXOfY('abc', 200)).toBeNull();
  });

  it('invalid input: non-numeric whole → null', () => {
    expect(calculateWhatPercentIsXOfY(25, 'xyz')).toBeNull();
  });

  it('invalid input: NaN → null', () => {
    expect(calculateWhatPercentIsXOfY(NaN, 200)).toBeNull();
  });

  it('invalid input: undefined → null', () => {
    expect(calculateWhatPercentIsXOfY(undefined, 200)).toBeNull();
  });

  it('invalid input: Infinity → null', () => {
    expect(calculateWhatPercentIsXOfY(Infinity, 200)).toBeNull();
  });
});
