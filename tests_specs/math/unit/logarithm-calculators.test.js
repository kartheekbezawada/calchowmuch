import { describe, it, expect } from 'vitest';
import {
  calculateNaturalLog,
  calculateLogBase,
  logProductRule,
  logQuotientRule,
  logPowerRule,
  solveSimpleExponential,
  convertLogScaleValue,
} from '../../public/assets/js/core/logarithm.js';

// LOG-TEST-U-1: Natural log precision
describe('LOG-TEST-U-1: Natural log calculations', () => {
  it('returns 0 for ln(1)', () => {
    expect(calculateNaturalLog(1)).toBeCloseTo(0, 8);
  });
  it('approximates ln(e) as 1', () => {
    expect(calculateNaturalLog(Math.E)).toBeCloseTo(1, 8);
  });
  it('rejects non-positive arguments', () => {
    expect(calculateNaturalLog(0)).toBeNull();
    expect(calculateNaturalLog(-5)).toBeNull();
  });
});

// LOG-TEST-U-2: Common log computations
describe('LOG-TEST-U-2: Log base conversions', () => {
  it('computes log base 10 of 1000 as 3', () => {
    expect(calculateLogBase(1000, 10)).toBeCloseTo(3, 8);
  });
  it('computes log base 2 of 8 as 3', () => {
    expect(calculateLogBase(8, 2)).toBeCloseTo(3, 8);
  });
  it('returns null when base equals 1', () => {
    expect(calculateLogBase(5, 1)).toBeNull();
  });
});

// LOG-TEST-U-3: Logarithm properties
describe('LOG-TEST-U-3: Product, quotient, power rules', () => {
  it('applies product rule correctly', () => {
    const value = logProductRule(10, 2, 50); // log10(100) = 2
    expect(value).toBeCloseTo(2, 8);
  });
  it('applies quotient rule correctly', () => {
    const quotient = logQuotientRule(10, 100, 4); // log10(25)
    expect(quotient).toBeCloseTo(Math.log10(25), 8);
  });
  it('applies power rule correctly', () => {
    const power = logPowerRule(2, 3, 4); // log2(81) = log2(3^4)
    expect(power).toBeCloseTo(4 * Math.log2(3), 8);
  });
});

// LOG-TEST-U-4: Exponential equations
describe('LOG-TEST-U-4: Exponential equation solving', () => {
  it('solves x for 2^x = 16', () => {
    const result = solveSimpleExponential({ base: 2, target: 16, multiplier: 1, shift: 0 });
    expect(result).toBeCloseTo(4, 8);
  });
  it('handles shifted equations', () => {
    const result = solveSimpleExponential({ base: 3, target: 27, multiplier: 2, shift: 1 });
    expect(result).toBeCloseTo((Math.log(27) / Math.log(3) - 1) / 2, 8);
  });
});

// LOG-TEST-U-5: Log scale conversions
describe('LOG-TEST-U-5: Log scale converter', () => {
  it('converts to decibels', () => {
    const decibel = convertLogScaleValue({ type: 'decibel', amplitude: 2, reference: 1 });
    expect(decibel).toBeCloseTo(20 * Math.log10(2), 8);
  });
  it('converts to pH', () => {
    const ph = convertLogScaleValue({ type: 'ph', concentration: 1e-6 });
    expect(ph).toBeCloseTo(6, 8);
  });
  it('converts to Richter magnitude', () => {
    const mag = convertLogScaleValue({ type: 'richter', magnitude: 32, reference: 1 });
    expect(mag).toBeCloseTo(Math.log10(32), 8);
  });
});
