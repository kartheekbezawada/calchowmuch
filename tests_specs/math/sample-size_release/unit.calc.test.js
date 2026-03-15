import { describe, expect, it } from 'vitest';
import {
  applyFinitePopulationCorrection,
  calculateMeanSampleSize,
  calculateProportionSampleSize,
  generateSensitivityTable,
  validateSampleSizeInputs,
} from '../../../public/calculators/math/sample-size/engine.js';

describe('math/sample-size engine', () => {
  it('calculates an infinite-population proportion sample size and rounds up', () => {
    const result = calculateProportionSampleSize({
      z: 1.96,
      margin: 5,
      proportion: 50,
      populationSize: '',
    });

    expect(result.ok).toBe(true);
    expect(result.n0).toBeCloseTo(384.16, 2);
    expect(result.correctedN).toBeNull();
    expect(result.requiredSampleSize).toBe(385);
  });

  it('applies finite-population correction for a proportion study', () => {
    const corrected = applyFinitePopulationCorrection(384.16, 1200);
    const result = calculateProportionSampleSize({
      z: 1.96,
      margin: 5,
      proportion: 50,
      populationSize: 1200,
    });

    expect(corrected).toBeCloseTo(291.1847, 4);
    expect(result.ok).toBe(true);
    expect(result.correctedN).toBeCloseTo(291.1847, 4);
    expect(result.requiredSampleSize).toBe(292);
  });

  it('calculates an infinite-population mean sample size and rounds up', () => {
    const result = calculateMeanSampleSize({
      z: 1.96,
      margin: 2,
      sigma: 8,
      populationSize: '',
    });

    expect(result.ok).toBe(true);
    expect(result.n0).toBeCloseTo(61.4656, 4);
    expect(result.correctedN).toBeNull();
    expect(result.requiredSampleSize).toBe(62);
  });

  it('applies finite-population correction for a mean study', () => {
    const result = calculateMeanSampleSize({
      z: 1.96,
      margin: 1.5,
      sigma: 6,
      populationSize: 180,
    });

    expect(result.ok).toBe(true);
    expect(result.correctedN).toBeCloseTo(46.0099, 4);
    expect(result.requiredSampleSize).toBe(47);
  });

  it('returns field-specific validation errors for invalid planning inputs', () => {
    expect(
      validateSampleSizeInputs({ mode: 'proportion', z: 1.96, margin: 0, proportion: 50 })
    ).toMatchObject({
      valid: false,
      errors: { margin: 'Margin of error must be greater than 0%.' },
    });

    expect(
      validateSampleSizeInputs({ mode: 'proportion', z: 1.96, margin: 5, proportion: 140 })
    ).toMatchObject({
      valid: false,
      errors: { proportion: 'Estimated proportion must be between 0% and 100%.' },
    });

    expect(
      validateSampleSizeInputs({ mode: 'mean', z: 1.96, margin: 2, sigma: 0 })
    ).toMatchObject({
      valid: false,
      errors: { sigma: 'Population standard deviation must be greater than 0.' },
    });

    expect(
      validateSampleSizeInputs({
        mode: 'mean',
        z: 1.96,
        margin: 2,
        sigma: 8,
        populationSize: 0,
      })
    ).toMatchObject({
      valid: false,
      errors: { population: 'Population size must be at least 1 if provided.' },
    });
  });

  it('builds a sensitivity table with the active planning margin highlighted', () => {
    const result = calculateProportionSampleSize({
      z: 1.96,
      margin: 5,
      proportion: 50,
      populationSize: 1200,
    });
    const rows = generateSensitivityTable(result);

    expect(rows).toHaveLength(7);
    expect(rows.find((row) => row.isActive)).toMatchObject({
      margin: 5,
      finalRounded: 292,
    });
  });
});
