import { describe, it, expect } from 'vitest';
import { calculatePresentValue } from '../../public/assets/js/core/time-value-utils.js';

describe('Present Value Calculator - PV-TEST-U-1: annual compounding', () => {
  it('should calculate present value with annual compounding', () => {
    const result = calculatePresentValue({
      futureValue: 10000,
      discountRate: 5,
      timePeriod: 3,
      periodType: 'years',
      compounding: 'annual',
    });

    expect(result).not.toBeNull();
    const expected = 10000 / Math.pow(1 + 0.05, 3);
    expect(result.presentValue).toBeCloseTo(expected, 6);
    expect(result.totalPeriods).toBeCloseTo(3, 6);
    expect(result.periodicRate).toBeCloseTo(0.05, 6);
  });
});

describe('Present Value Calculator - PV-TEST-U-2: monthly compounding', () => {
  it('should calculate present value with monthly compounding for months input', () => {
    const result = calculatePresentValue({
      futureValue: 5000,
      discountRate: 6,
      timePeriod: 24,
      periodType: 'months',
      compounding: 'monthly',
    });

    expect(result).not.toBeNull();
    const expected = 5000 / Math.pow(1 + 0.06 / 12, 24);
    expect(result.presentValue).toBeCloseTo(expected, 6);
    expect(result.totalPeriods).toBeCloseTo(24, 6);
  });
});

describe('Present Value Calculator - PV-TEST-U-3: edge cases', () => {
  it('should return future value when discount rate is zero', () => {
    const result = calculatePresentValue({
      futureValue: 1200,
      discountRate: 0,
      timePeriod: 5,
      periodType: 'years',
      compounding: 'annual',
    });

    expect(result).not.toBeNull();
    expect(result.presentValue).toBeCloseTo(1200, 6);
  });

  it('should return future value when time period is zero', () => {
    const result = calculatePresentValue({
      futureValue: 2500,
      discountRate: 4,
      timePeriod: 0,
      periodType: 'years',
      compounding: 'annual',
    });

    expect(result).not.toBeNull();
    expect(result.presentValue).toBeCloseTo(2500, 6);
    expect(result.totalPeriods).toBeCloseTo(0, 6);
  });

  it('should return null for negative inputs', () => {
    const result = calculatePresentValue({
      futureValue: -100,
      discountRate: 5,
      timePeriod: 2,
      periodType: 'years',
      compounding: 'annual',
    });

    expect(result).toBeNull();
  });
});
