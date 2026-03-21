import { describe, expect, it } from 'vitest';
import {
  calculateInflationAdjustment,
  formatCpiMonth,
} from '../../../public/assets/js/core/inflation-utils.js';
import {
  buildInflationChartModel,
  buildInflationScenarioRows,
  normalizeScenarioHorizonYears,
} from '../../../public/calculators/finance-calculators/inflation-calculator/module.js';

describe('Inflation Calculator - INF-TEST-U-1: baseline math', () => {
  it('returns the original amount when both months are the same', () => {
    const result = calculateInflationAdjustment({
      amount: 1000,
      fromMonth: '2024-12',
      toMonth: '2024-12',
    });

    expect(result.error).toBeUndefined();
    expect(result.equivalentValue).toBeCloseTo(1000, 2);
    expect(result.absoluteChange).toBeCloseTo(0, 2);
    expect(result.cumulativeInflationRate).toBeCloseTo(0, 8);
    expect(result.annualizedInflationRate).toBeCloseTo(0, 8);
    expect(result.monthSpan).toBe(0);
  });

  it('translates a known historical amount using official CPI values', () => {
    const result = calculateInflationAdjustment({
      amount: 1000,
      fromMonth: '2000-01',
      toMonth: '2025-12',
    });

    expect(result.error).toBeUndefined();
    expect(result.startCpi).toBeCloseTo(168.8, 4);
    expect(result.endCpi).toBeCloseTo(324.054, 4);
    expect(result.monthSpan).toBe(311);
    expect(result.inflationFactor).toBeCloseTo(1.9197511848, 8);
    expect(result.equivalentValue).toBeCloseTo(1919.7511848, 6);
    expect(result.cumulativeInflationRate).toBeCloseTo(0.9197511848, 8);
    expect(result.annualizedInflationRate).toBeCloseTo(0.0254844171, 8);
  });
});

describe('Inflation Calculator - INF-TEST-U-2: validation', () => {
  it('fails when amount is zero or negative', () => {
    const result = calculateInflationAdjustment({
      amount: 0,
      fromMonth: '2000-01',
      toMonth: '2025-12',
    });

    expect(result.error).toBe('Amount must be greater than 0.');
  });

  it('fails when end month is earlier than start month', () => {
    const result = calculateInflationAdjustment({
      amount: 1000,
      fromMonth: '2025-12',
      toMonth: '2025-09',
    });

    expect(result.error).toBe('End month must be the same as or later than start month.');
  });

  it('fails when a CPI month is unavailable in the official series', () => {
    const result = calculateInflationAdjustment({
      amount: 1000,
      fromMonth: '2025-09',
      toMonth: '2025-10',
    });

    expect(result.error).toBe('CPI data is unavailable for one of the selected months.');
  });
});

describe('Inflation Calculator - INF-TEST-U-3: formatting helpers', () => {
  it('formats CPI months for display', () => {
    expect(formatCpiMonth('2000-01')).toBe('January 2000');
    expect(formatCpiMonth('2025-12')).toBe('December 2025');
  });
});

describe('Inflation Calculator - INF-TEST-U-4: education scenario helpers', () => {
  it('normalizes scenario horizon to at least one year', () => {
    expect(normalizeScenarioHorizonYears(0)).toBe(1);
    expect(normalizeScenarioHorizonYears(6)).toBe(1);
    expect(normalizeScenarioHorizonYears(18)).toBeCloseTo(1.5, 8);
  });

  it('builds low, medium, and high inflation scenario rows from the current amount and span', () => {
    const scenarios = buildInflationScenarioRows({
      amount: 1000,
      monthSpan: 120,
    });

    expect(scenarios).toHaveLength(3);
    expect(scenarios[0].id).toBe('low');
    expect(scenarios[1].id).toBe('medium');
    expect(scenarios[2].id).toBe('high');
    expect(scenarios[0].futureValue).toBeCloseTo(1218.994, 3);
    expect(scenarios[1].futureValue).toBeCloseTo(1628.895, 3);
    expect(scenarios[2].futureValue).toBeCloseTo(2158.925, 3);
  });

  it('builds chart data for value and impact views with an active preset', () => {
    const chartModel = buildInflationChartModel({
      amount: 1000,
      monthSpan: 18,
      activePresetId: 'high',
    });

    expect(chartModel.horizonYears).toBeCloseTo(1.5, 8);
    expect(chartModel.valueLines).toHaveLength(3);
    expect(chartModel.activePreset?.id).toBe('high');
    expect(chartModel.impactPoints.at(-1)?.y).toBeGreaterThan(0);
    expect(chartModel.valueLines[0].points[0]).toEqual({
      x: 0,
      y: 1000,
      label: 'Low inflation, year 0: 1,000.00',
    });
  });
});
