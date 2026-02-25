import { describe, expect, it } from 'vitest';
import { calculateInvestmentReturn } from '../../../public/assets/js/core/time-value-utils.js';

function baseInput(overrides = {}) {
  return {
    initialInvestment: 1000,
    annualReturnRate: 6,
    durationYears: 10,
    compoundingFrequency: 'ANNUAL',
    regularContribution: 0,
    contributionFrequency: 'MONTHLY',
    contributionTiming: 'END_OF_PERIOD',
    inflationRate: 0,
    taxRate: 0,
    precision: 2,
    ...overrides,
  };
}

function expectValid(result) {
  expect(result).toBeTruthy();
  expect(result.isValid).toBe(true);
}

function monthlyRateFromNominal(annualRatePercent, compoundsPerYear) {
  const annual = annualRatePercent / 100;
  return Math.pow(1 + annual / compoundsPerYear, compoundsPerYear / 12) - 1;
}

function projectConstantCase({
  initialInvestment,
  annualRate,
  years,
  regularContribution = 0,
  contributionFrequency = 'MONTHLY',
  contributionTiming = 'END_OF_PERIOD',
  compoundsPerYear = 12,
}) {
  let balance = initialInvestment;
  let contributions = initialInvestment;
  const monthlyRate = monthlyRateFromNominal(annualRate, compoundsPerYear);

  const isDue = (monthInYear) => {
    if (contributionFrequency === 'MONTHLY') return true;
    if (contributionFrequency === 'QUARTERLY') return monthInYear % 3 === 0;
    return monthInYear === 12;
  };

  for (let year = 1; year <= years; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      const due = regularContribution > 0 && isDue(month);
      if (due && contributionTiming === 'BEGINNING_OF_PERIOD') {
        balance += regularContribution;
        contributions += regularContribution;
      }
      balance += balance * monthlyRate;
      if (due && contributionTiming === 'END_OF_PERIOD') {
        balance += regularContribution;
        contributions += regularContribution;
      }
    }
  }

  return {
    finalValue: balance,
    totalContributions: contributions,
    totalGain: balance - contributions,
  };
}

describe('Investment Return - validation', () => {
  it('IR-VAL-1 rejects negative initial investment', () => {
    const result = calculateInvestmentReturn(baseInput({ initialInvestment: -1 }));
    expect(result.isValid).toBe(false);
    expect(result.errors.join(' ')).toContain('initialInvestment');
  });

  it('IR-VAL-2 rejects durationYears < 1', () => {
    const result = calculateInvestmentReturn(baseInput({ durationYears: 0 }));
    expect(result.isValid).toBe(false);
    expect(result.errors.join(' ')).toContain('durationYears');
  });

  it('IR-VAL-3 rejects annual return outside range', () => {
    const result = calculateInvestmentReturn(baseInput({ annualReturnRate: 150 }));
    expect(result.isValid).toBe(false);
    expect(result.errors.join(' ')).toContain('annualReturnRate');
  });

  it('IR-VAL-4 rejects negative regular contribution', () => {
    const result = calculateInvestmentReturn(baseInput({ regularContribution: -10 }));
    expect(result.isValid).toBe(false);
    expect(result.errors.join(' ')).toContain('regularContribution');
  });

  it('IR-VAL-5 rejects invalid precision', () => {
    const result = calculateInvestmentReturn(baseInput({ precision: 20 }));
    expect(result.isValid).toBe(false);
    expect(result.errors.join(' ')).toContain('precision');
  });
});

describe('Investment Return - lump sum correctness', () => {
  it('IR-LUMP-1 1000 at 10% for 1 year annual => 1100', () => {
    const result = calculateInvestmentReturn(
      baseInput({ annualReturnRate: 10, durationYears: 1, compoundingFrequency: 'ANNUAL' })
    );
    expectValid(result);
    expect(result.summary.finalValue).toBeCloseTo(1100, 2);
    expect(result.summary.totalContributions).toBeCloseTo(1000, 2);
    expect(result.summary.totalGain).toBeCloseTo(100, 2);
  });

  it('IR-LUMP-2 1000 at 10% for 2 years annual => 1210', () => {
    const result = calculateInvestmentReturn(
      baseInput({ annualReturnRate: 10, durationYears: 2, compoundingFrequency: 'ANNUAL' })
    );
    expectValid(result);
    expect(result.summary.finalValue).toBeCloseTo(1210, 2);
  });

  it('IR-LUMP-3 monthly compounding sanity check', () => {
    const result = calculateInvestmentReturn(
      baseInput({ annualReturnRate: 12, durationYears: 1, compoundingFrequency: 'MONTHLY' })
    );
    expectValid(result);
    const expected = 1000 * Math.pow(1 + 0.12 / 12, 12);
    expect(result.summary.finalValue).toBeCloseTo(expected, 2);
  });

  it('IR-LUMP-4 zero return preserves principal', () => {
    const result = calculateInvestmentReturn(baseInput({ annualReturnRate: 0, durationYears: 10 }));
    expectValid(result);
    expect(result.summary.finalValue).toBeCloseTo(1000, 2);
    expect(result.summary.totalGain).toBeCloseTo(0, 2);
  });

  it('IR-LUMP-5 negative return decreases balance', () => {
    const result = calculateInvestmentReturn(
      baseInput({ annualReturnRate: -10, durationYears: 1, compoundingFrequency: 'ANNUAL' })
    );
    expectValid(result);
    expect(result.summary.finalValue).toBeCloseTo(900, 2);
    expect(result.summary.totalGain).toBeCloseTo(-100, 2);
  });
});

describe('Investment Return - contributions correctness', () => {
  it('IR-CONTRIB-1 contributions only with zero return', () => {
    const result = calculateInvestmentReturn(
      baseInput({
        initialInvestment: 0,
        annualReturnRate: 0,
        durationYears: 1,
        regularContribution: 100,
        contributionFrequency: 'MONTHLY',
      })
    );
    expectValid(result);
    expect(result.summary.totalContributions).toBeCloseTo(1200, 2);
    expect(result.summary.finalValue).toBeCloseTo(1200, 2);
    expect(result.summary.totalGain).toBeCloseTo(0, 2);
  });

  it('IR-CONTRIB-2 beginning timing exceeds end timing', () => {
    const common = {
      initialInvestment: 1000,
      annualReturnRate: 6,
      durationYears: 5,
      regularContribution: 100,
      contributionFrequency: 'MONTHLY',
      compoundingFrequency: 'MONTHLY',
    };
    const end = calculateInvestmentReturn(baseInput({ ...common, contributionTiming: 'END_OF_PERIOD' }));
    const beginning = calculateInvestmentReturn(
      baseInput({ ...common, contributionTiming: 'BEGINNING_OF_PERIOD' })
    );
    expectValid(end);
    expectValid(beginning);
    expect(beginning.summary.finalValue).toBeGreaterThan(end.summary.finalValue);
  });

  it('IR-CONTRIB-3 benchmark for monthly contribution + monthly compounding', () => {
    const input = baseInput({
      initialInvestment: 1000,
      annualReturnRate: 6,
      durationYears: 10,
      compoundingFrequency: 'MONTHLY',
      regularContribution: 100,
      contributionFrequency: 'MONTHLY',
      contributionTiming: 'END_OF_PERIOD',
    });
    const result = calculateInvestmentReturn(input);
    expectValid(result);

    const expected = projectConstantCase({
      initialInvestment: 1000,
      annualRate: 6,
      years: 10,
      regularContribution: 100,
      contributionFrequency: 'MONTHLY',
      contributionTiming: 'END_OF_PERIOD',
      compoundsPerYear: 12,
    });

    expect(result.summary.totalContributions).toBeCloseTo(expected.totalContributions, 2);
    expect(result.summary.finalValue).toBeCloseTo(expected.finalValue, 2);
    expect(result.summary.totalGain).toBeCloseTo(expected.totalGain, 2);
  });

  it('IR-CONTRIB-4 annual contributions applied once per year', () => {
    const result = calculateInvestmentReturn(
      baseInput({
        initialInvestment: 1000,
        annualReturnRate: 0,
        durationYears: 3,
        regularContribution: 500,
        contributionFrequency: 'ANNUAL',
      })
    );
    expectValid(result);
    expect(result.yearlyBreakdown[0].contributions).toBeCloseTo(500, 2);
    expect(result.yearlyBreakdown[1].contributions).toBeCloseTo(500, 2);
    expect(result.yearlyBreakdown[2].contributions).toBeCloseTo(500, 2);
  });

  it('IR-CONTRIB-5 quarterly contributions match deterministic projection', () => {
    const input = baseInput({
      initialInvestment: 2000,
      annualReturnRate: 5,
      durationYears: 4,
      compoundingFrequency: 'QUARTERLY',
      regularContribution: 250,
      contributionFrequency: 'QUARTERLY',
      contributionTiming: 'END_OF_PERIOD',
    });
    const result = calculateInvestmentReturn(input);
    expectValid(result);

    const expected = projectConstantCase({
      initialInvestment: 2000,
      annualRate: 5,
      years: 4,
      regularContribution: 250,
      contributionFrequency: 'QUARTERLY',
      contributionTiming: 'END_OF_PERIOD',
      compoundsPerYear: 4,
    });

    expect(result.summary.finalValue).toBeCloseTo(expected.finalValue, 2);
  });
});

describe('Investment Return - inflation behavior', () => {
  it('IR-INF-1 inflation off keeps real fields null', () => {
    const result = calculateInvestmentReturn(baseInput({ inflationRate: 0 }));
    expectValid(result);
    expect(result.summary.realFinalValue).toBeNull();
    expect(result.summary.realCAGR).toBeNull();
  });

  it('IR-INF-2 positive inflation reduces real outputs', () => {
    const result = calculateInvestmentReturn(baseInput({ annualReturnRate: 7, inflationRate: 3 }));
    expectValid(result);
    expect(result.summary.realFinalValue).toBeLessThan(result.summary.finalValue);
    expect(result.summary.realCAGR).toBeLessThan(result.summary.nominalCAGR);
  });

  it('IR-INF-3 negative inflation increases real value', () => {
    const result = calculateInvestmentReturn(baseInput({ annualReturnRate: 5, inflationRate: -1 }));
    expectValid(result);
    expect(result.summary.realFinalValue).toBeGreaterThan(result.summary.finalValue);
  });
});

describe('Investment Return - tax behavior', () => {
  it('IR-TAX-1 no tax keeps total tax paid at zero', () => {
    const result = calculateInvestmentReturn(baseInput({ taxRate: 0 }));
    expectValid(result);
    expect(result.summary.totalTaxPaid).toBeCloseTo(0, 2);
    expect(result.yearlyBreakdown.every((row) => row.taxPaid === 0)).toBe(true);
  });

  it('IR-TAX-2 tax reduces final value vs no-tax scenario', () => {
    const noTax = calculateInvestmentReturn(baseInput({ annualReturnRate: 8, durationYears: 8, taxRate: 0 }));
    const withTax = calculateInvestmentReturn(
      baseInput({ annualReturnRate: 8, durationYears: 8, taxRate: 20 })
    );
    expectValid(noTax);
    expectValid(withTax);
    expect(withTax.summary.finalValue).toBeLessThan(noTax.summary.finalValue);
    expect(withTax.summary.totalTaxPaid).toBeGreaterThan(0);
  });

  it('IR-TAX-3 carryforward losses offset future taxable gains', () => {
    const result = calculateInvestmentReturn(
      baseInput({
        initialInvestment: 1000,
        annualReturnRate: 0,
        durationYears: 2,
        taxRate: 20,
        variableAnnualReturns: [-20, 50],
        compoundingFrequency: 'ANNUAL',
      })
    );
    expectValid(result);
    expect(result.summary.totalTaxPaid).toBeCloseTo(40, 2);
    expect(result.metadata.carryforwardLoss).toBeCloseTo(0, 2);
  });
});

describe('Investment Return - invariants and breakdown integrity', () => {
  it('IR-INV-1 yearly breakdown length equals durationYears', () => {
    const result = calculateInvestmentReturn(baseInput({ durationYears: 12 }));
    expectValid(result);
    expect(result.yearlyBreakdown).toHaveLength(12);
    expect(result.yearlyBreakdown[0].year).toBe(1);
    expect(result.yearlyBreakdown[11].year).toBe(12);
  });

  it('IR-INV-2 monthly breakdown length equals years*12', () => {
    const years = 15;
    const result = calculateInvestmentReturn(baseInput({ durationYears: years }));
    expectValid(result);
    expect(result.monthlyBreakdown).toHaveLength(years * 12);
  });

  it('IR-INV-3 yearly accounting identity holds', () => {
    const result = calculateInvestmentReturn(baseInput({ annualReturnRate: 7, taxRate: 12 }));
    expectValid(result);

    result.yearlyBreakdown.forEach((row) => {
      const lhs = row.endingBalance;
      const rhs = row.startingBalance + row.contributions + row.interestEarned - row.taxPaid;
      expect(lhs).toBeCloseTo(rhs, 1);
    });
  });

  it('IR-INV-4 year-to-year continuity holds', () => {
    const result = calculateInvestmentReturn(baseInput({ annualReturnRate: 7, taxRate: 12 }));
    expectValid(result);

    for (let i = 0; i < result.yearlyBreakdown.length - 1; i += 1) {
      expect(result.yearlyBreakdown[i + 1].startingBalance).toBeCloseTo(
        result.yearlyBreakdown[i].endingBalance,
        1
      );
    }
  });

  it('IR-INV-5 summary gain identity holds', () => {
    const result = calculateInvestmentReturn(baseInput({ annualReturnRate: 7, regularContribution: 80 }));
    expectValid(result);
    expect(result.summary.totalGain).toBeCloseTo(
      result.summary.finalValue - result.summary.totalContributions,
      2
    );
  });
});

describe('Investment Return - precision and determinism', () => {
  it('IR-PREC-1 precision=0 rounds currencies to whole numbers', () => {
    const result = calculateInvestmentReturn(baseInput({ precision: 0, annualReturnRate: 6.1234 }));
    expectValid(result);
    expect(Number.isInteger(result.summary.finalValue)).toBe(true);
    expect(Number.isInteger(result.summary.totalContributions)).toBe(true);
    expect(Number.isInteger(result.summary.totalGain)).toBe(true);
  });

  it('IR-PREC-2 precision=4 preserves additional decimals', () => {
    const result = calculateInvestmentReturn(baseInput({ precision: 4, annualReturnRate: 0.1 }));
    expectValid(result);
    expect(result.summary.finalValue.toString()).toMatch(/\./);
  });

  it('IR-PREC-3 negative gains retain negative sign after rounding', () => {
    const result = calculateInvestmentReturn(baseInput({ annualReturnRate: -3.3333, precision: 2 }));
    expectValid(result);
    expect(result.summary.totalGain).toBeLessThan(0);
  });

  it('IR-DET-1 repeated calculations are deterministic for output fields', () => {
    const input = baseInput({
      annualReturnRate: 7,
      durationYears: 20,
      regularContribution: 150,
      contributionFrequency: 'MONTHLY',
      taxRate: 15,
      inflationRate: 2,
      variableAnnualReturns: Array.from({ length: 20 }, (_, i) => (i % 2 === 0 ? 8 : 6)),
    });

    const a = calculateInvestmentReturn(input);
    const b = calculateInvestmentReturn(input);
    expectValid(a);
    expectValid(b);

    expect(a.summary).toEqual(b.summary);
    expect(a.yearlyBreakdown).toEqual(b.yearlyBreakdown);
    expect(a.monthlyBreakdown).toEqual(b.monthlyBreakdown);
  });

  it('IR-SCALE-1 long horizon remains finite', () => {
    const result = calculateInvestmentReturn(
      baseInput({ durationYears: 60, compoundingFrequency: 'DAILY', annualReturnRate: 5 })
    );
    expectValid(result);
    expect(Number.isFinite(result.summary.finalValue)).toBe(true);
    expect(Number.isFinite(result.summary.totalGain)).toBe(true);
  });
});
