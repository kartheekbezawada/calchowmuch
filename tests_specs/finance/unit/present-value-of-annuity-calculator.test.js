import { describe, it, expect } from 'vitest';
import { calculatePresentValueOfAnnuity } from '../../public/assets/js/core/time-value-utils.js';

describe('Present Value of Annuity - PVA-TEST-U-1: ordinary annuity', () => {
  it('should calculate PV for an ordinary annuity with annual compounding', () => {
    const result = calculatePresentValueOfAnnuity({
      payment: 500,
      discountRate: 5,
      periods: 10,
      periodType: 'years',
      compounding: 'annual',
      annuityType: 'ordinary',
    });

    expect(result).not.toBeNull();
    const expected = 500 * (1 - Math.pow(1 + 0.05, -10)) / 0.05;
    expect(result.presentValue).toBeCloseTo(expected, 6);
    expect(result.totalPeriods).toBeCloseTo(10, 6);
    expect(result.periodicRate).toBeCloseTo(0.05, 6);
    expect(result.totalPayments).toBeCloseTo(500 * 10, 6);
  });
});

describe('Present Value of Annuity - PVA-TEST-U-2: annuity due', () => {
  it('should calculate PV for an annuity due by adjusting ordinary PV', () => {
    const result = calculatePresentValueOfAnnuity({
      payment: 500,
      discountRate: 5,
      periods: 10,
      periodType: 'years',
      compounding: 'annual',
      annuityType: 'due',
    });

    expect(result).not.toBeNull();
    const ordinary = 500 * (1 - Math.pow(1 + 0.05, -10)) / 0.05;
    const expected = ordinary * (1 + 0.05);
    expect(result.presentValue).toBeCloseTo(expected, 6);
  });
});

describe('Present Value of Annuity - PVA-TEST-U-3: monthly compounding', () => {
  it('should normalize months input with monthly compounding', () => {
    const result = calculatePresentValueOfAnnuity({
      payment: 200,
      discountRate: 6,
      periods: 24,
      periodType: 'months',
      compounding: 'monthly',
      annuityType: 'ordinary',
    });

    expect(result).not.toBeNull();
    const periodicRate = 0.06 / 12;
    const expected = 200 * (1 - Math.pow(1 + periodicRate, -24)) / periodicRate;
    expect(result.presentValue).toBeCloseTo(expected, 6);
    expect(result.totalPeriods).toBeCloseTo(24, 6);
  });
});

describe('Present Value of Annuity - PVA-TEST-U-4: per-period rate', () => {
  it('should treat rate as per period when compounding is not selected', () => {
    const result = calculatePresentValueOfAnnuity({
      payment: 100,
      discountRate: 1,
      periods: 10,
      periodType: 'months',
      compounding: null,
      annuityType: 'ordinary',
    });

    expect(result).not.toBeNull();
    const periodicRate = 0.01;
    const expected = 100 * (1 - Math.pow(1 + periodicRate, -10)) / periodicRate;
    expect(result.presentValue).toBeCloseTo(expected, 6);
    expect(result.periodicRate).toBeCloseTo(periodicRate, 6);
    expect(result.totalPeriods).toBeCloseTo(10, 6);
  });
});

describe('Present Value of Annuity - PVA-TEST-U-5: edge cases', () => {
  it('should return total payments when discount rate is zero', () => {
    const result = calculatePresentValueOfAnnuity({
      payment: 150,
      discountRate: 0,
      periods: 8,
      periodType: 'years',
      compounding: 'annual',
      annuityType: 'ordinary',
    });

    expect(result).not.toBeNull();
    expect(result.presentValue).toBeCloseTo(150 * 8, 6);
  });

  it('should return null for negative inputs', () => {
    const result = calculatePresentValueOfAnnuity({
      payment: -100,
      discountRate: 4,
      periods: 5,
      periodType: 'years',
      compounding: 'annual',
      annuityType: 'ordinary',
    });

    expect(result).toBeNull();
  });
});
