import { describe, it, expect } from 'vitest';
import { calculateFutureValueOfAnnuity } from '../../public/assets/js/core/time-value-utils.js';

describe('Future Value of Annuity - FVA-TEST-U-1: ordinary annuity', () => {
  it('should calculate FV for an ordinary annuity with annual compounding', () => {
    const result = calculateFutureValueOfAnnuity({
      payment: 500,
      interestRate: 5,
      periods: 10,
      periodType: 'years',
      compounding: 'annual',
      annuityType: 'ordinary',
    });

    expect(result).not.toBeNull();
    const expected = 500 * ((Math.pow(1 + 0.05, 10) - 1) / 0.05);
    expect(result.futureValue).toBeCloseTo(expected, 6);
    expect(result.totalPeriods).toBeCloseTo(10, 6);
    expect(result.periodicRate).toBeCloseTo(0.05, 6);
    expect(result.totalPayments).toBeCloseTo(500 * 10, 6);
    expect(result.totalInterest).toBeCloseTo(expected - 5000, 2);
  });
});

describe('Future Value of Annuity - FVA-TEST-U-2: annuity due', () => {
  it('should calculate FV for an annuity due by adjusting ordinary FV', () => {
    const result = calculateFutureValueOfAnnuity({
      payment: 500,
      interestRate: 5,
      periods: 10,
      periodType: 'years',
      compounding: 'annual',
      annuityType: 'due',
    });

    expect(result).not.toBeNull();
    const ordinary = 500 * ((Math.pow(1 + 0.05, 10) - 1) / 0.05);
    const expected = ordinary * (1 + 0.05);
    expect(result.futureValue).toBeCloseTo(expected, 6);
  });
});

describe('Future Value of Annuity - FVA-TEST-U-3: monthly compounding', () => {
  it('should normalize months input with monthly compounding', () => {
    const result = calculateFutureValueOfAnnuity({
      payment: 200,
      interestRate: 6,
      periods: 24,
      periodType: 'months',
      compounding: 'monthly',
      annuityType: 'ordinary',
    });

    expect(result).not.toBeNull();
    const periodicRate = 0.06 / 12;
    const expected = 200 * ((Math.pow(1 + periodicRate, 24) - 1) / periodicRate);
    expect(result.futureValue).toBeCloseTo(expected, 6);
    expect(result.totalPeriods).toBeCloseTo(24, 6);
  });
});

describe('Future Value of Annuity - FVA-TEST-U-4: per-period rate', () => {
  it('should treat rate as per period when compounding is not selected', () => {
    const result = calculateFutureValueOfAnnuity({
      payment: 100,
      interestRate: 1,
      periods: 10,
      periodType: 'months',
      compounding: null,
      annuityType: 'ordinary',
    });

    expect(result).not.toBeNull();
    const periodicRate = 0.01;
    const expected = 100 * ((Math.pow(1 + periodicRate, 10) - 1) / periodicRate);
    expect(result.futureValue).toBeCloseTo(expected, 6);
    expect(result.periodicRate).toBeCloseTo(periodicRate, 6);
    expect(result.totalPeriods).toBeCloseTo(10, 6);
  });
});

describe('Future Value of Annuity - FVA-TEST-U-5: edge cases', () => {
  it('should return total payments when interest rate is zero', () => {
    const result = calculateFutureValueOfAnnuity({
      payment: 150,
      interestRate: 0,
      periods: 8,
      periodType: 'years',
      compounding: 'annual',
      annuityType: 'ordinary',
    });

    expect(result).not.toBeNull();
    expect(result.futureValue).toBeCloseTo(150 * 8, 6);
    expect(result.totalInterest).toBeCloseTo(0, 6);
  });

  it('should return null for negative inputs', () => {
    const result = calculateFutureValueOfAnnuity({
      payment: -100,
      interestRate: 4,
      periods: 5,
      periodType: 'years',
      compounding: 'annual',
      annuityType: 'ordinary',
    });

    expect(result).toBeNull();
  });

  it('should return null for NaN inputs', () => {
    const result = calculateFutureValueOfAnnuity({
      payment: NaN,
      interestRate: 5,
      periods: 10,
    });

    expect(result).toBeNull();
  });

  it('should return zero future value when periods is zero', () => {
    const result = calculateFutureValueOfAnnuity({
      payment: 500,
      interestRate: 5,
      periods: 0,
      periodType: 'years',
      compounding: 'annual',
      annuityType: 'ordinary',
    });

    expect(result).not.toBeNull();
    expect(result.futureValue).toBeCloseTo(0, 6);
  });
});

describe('Future Value of Annuity - FVA-TEST-U-6: quarterly compounding', () => {
  it('should handle quarterly compounding with years input', () => {
    const result = calculateFutureValueOfAnnuity({
      payment: 1000,
      interestRate: 8,
      periods: 5,
      periodType: 'years',
      compounding: 'quarterly',
      annuityType: 'ordinary',
    });

    expect(result).not.toBeNull();
    const periodicRate = 0.08 / 4;
    const totalPeriods = 5 * 4;
    const expected = 1000 * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
    expect(result.futureValue).toBeCloseTo(expected, 4);
    expect(result.totalPeriods).toBeCloseTo(totalPeriods, 6);
    expect(result.periodicRate).toBeCloseTo(periodicRate, 6);
  });
});
