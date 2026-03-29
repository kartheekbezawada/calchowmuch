import { describe, expect, it } from 'vitest';
import { calculateInvestmentPlan } from '../../../public/assets/js/core/time-value-utils.js';

describe('Investment Calculator - validation', () => {
  it('INV-VAL-1 rejects negative initial investment', () => {
    const result = calculateInvestmentPlan({ initialInvestment: -1, years: 10 });
    expect(result.isValid).toBe(false);
    expect(result.errors.join(' ')).toContain('initialInvestment');
  });

  it('INV-VAL-2 rejects unsupported comparison mode', () => {
    const result = calculateInvestmentPlan({
      initialInvestment: 1000,
      annualReturnRate: 7,
      years: 10,
      comparisonContributionMode: 'bad-mode',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.join(' ')).toContain('comparisonContributionMode');
  });
});

describe('Investment Calculator - lump sum projection', () => {
  it('INV-LUMP-1 matches compound growth for a lump sum', () => {
    const result = calculateInvestmentPlan({
      initialInvestment: 10000,
      annualReturnRate: 7,
      years: 10,
      recurringContribution: 0,
      compounding: 'monthly',
      inflationRate: 0,
      comparisonContributionMode: 'lump-sum-only',
    });

    expect(result.isValid).toBe(true);
    const expected = 10000 * Math.pow(1 + 0.07 / 12, 120);
    expect(result.main.endingValue).toBeCloseTo(expected, 2);
    expect(result.main.totalContributions).toBeCloseTo(10000, 2);
    expect(result.main.totalGains).toBeCloseTo(expected - 10000, 2);
    expect(result.comparison.compoundEndingValue).toBeCloseTo(expected, 2);
    expect(result.chart.nominalValues[0]).toBe(10000);
  });

  it('INV-LUMP-2 simple growth stays below compound growth over time', () => {
    const result = calculateInvestmentPlan({
      initialInvestment: 10000,
      annualReturnRate: 7,
      years: 20,
      recurringContribution: 0,
      compounding: 'annual',
      inflationRate: 0,
      comparisonContributionMode: 'lump-sum-only',
    });

    expect(result.isValid).toBe(true);
    expect(result.comparison.compoundEndingValue).toBeGreaterThan(
      result.comparison.simpleEndingValue
    );
    expect(result.comparison.compoundingUplift).toBeGreaterThan(0);
  });
});

describe('Investment Calculator - recurring contribution comparison', () => {
  it('INV-COMP-1 includes recurring contributions in the main scenario', () => {
    const result = calculateInvestmentPlan({
      initialInvestment: 10000,
      annualReturnRate: 7,
      years: 10,
      recurringContribution: 200,
      compounding: 'monthly',
      inflationRate: 0,
      comparisonContributionMode: 'include-recurring-contributions',
    });

    expect(result.isValid).toBe(true);
    expect(result.main.totalContributions).toBeCloseTo(10000 + 200 * 120, 2);
    expect(result.comparison.compoundEndingValue).toBeGreaterThan(
      result.comparison.simpleEndingValue
    );
    expect(result.table).toHaveLength(11);
  });

  it('INV-COMP-2 zero return collapses simple and compound outcomes', () => {
    const result = calculateInvestmentPlan({
      initialInvestment: 5000,
      annualReturnRate: 0,
      years: 5,
      recurringContribution: 100,
      compounding: 'monthly',
      inflationRate: 0,
      comparisonContributionMode: 'include-recurring-contributions',
    });

    expect(result.isValid).toBe(true);
    expect(result.main.endingValue).toBeCloseTo(5000 + 100 * 60, 2);
    expect(result.main.totalGains).toBeCloseTo(0, 2);
    expect(result.comparison.simpleEndingValue).toBeCloseTo(
      result.comparison.compoundEndingValue,
      2
    );
  });
});

describe('Investment Calculator - inflation interpretation', () => {
  it('INV-INF-1 reduces real value when inflation is positive', () => {
    const result = calculateInvestmentPlan({
      initialInvestment: 12000,
      annualReturnRate: 7,
      years: 15,
      recurringContribution: 150,
      compounding: 'monthly',
      inflationRate: 3,
      comparisonContributionMode: 'include-recurring-contributions',
    });

    expect(result.isValid).toBe(true);
    expect(result.main.realValue).toBeLessThan(result.main.endingValue);
    expect(result.chart.realValues[result.chart.realValues.length - 1]).toBe(result.main.realValue);
  });
});
