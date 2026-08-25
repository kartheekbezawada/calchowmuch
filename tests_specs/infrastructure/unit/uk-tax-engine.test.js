import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

import {
  calculateProgressiveTax,
  calculateTaperedAllowance,
  calculateThresholdTax,
} from '../../../public/calculators/salary-calculators/shared/tax-engine/progressive-tax.js';
import {
  PERIODS_PER_YEAR,
  fromAnnual,
  periodsPerYear,
  toAnnual,
} from '../../../public/calculators/salary-calculators/shared/tax-engine/pay-frequency.js';
import {
  calculateUkBonusImpact,
  calculateUkTakeHome,
} from '../../../public/calculators/salary-calculators/shared/tax-engine/uk-engine.js';

const DATA_ROOT = path.resolve(
  process.cwd(),
  'public/calculators/salary-calculators/shared/tax-data/uk',
);
const load = (file) => JSON.parse(fs.readFileSync(path.join(DATA_ROOT, file), 'utf8'));

const taxData = {
  incomeTax: load('income-tax.json'),
  nationalInsurance: load('national-insurance.json'),
  studentLoans: load('student-loans.json'),
  pension: load('pension.json'),
};

/** Money comparisons: to the penny. */
const money = (n) => Math.round(n * 100) / 100;

describe('calculateProgressiveTax', () => {
  const bands = [
    { id: 'a', rate: 0.2, from: 0, to: 100 },
    { id: 'b', rate: 0.4, from: 100, to: 200 },
    { id: 'c', rate: 0.45, from: 200, to: null },
  ];

  it('taxes only the portion of income falling in each band', () => {
    // 150 => 100@20% + 50@40% = 20 + 20
    expect(calculateProgressiveTax(150, bands).total).toBe(40);
  });

  it('handles income in the unbounded top band', () => {
    // 300 => 20 + 40 + 100@45%
    expect(calculateProgressiveTax(300, bands).total).toBe(105);
  });

  it('returns zero for zero, negative and non-finite income', () => {
    for (const value of [0, -500, NaN, undefined, null]) {
      expect(calculateProgressiveTax(value, bands).total).toBe(0);
    }
  });

  it('reports the marginal rate as the top band actually reached, not the top band overall', () => {
    expect(calculateProgressiveTax(50, bands).marginalRate).toBe(0.2);
    expect(calculateProgressiveTax(150, bands).marginalRate).toBe(0.4);
    expect(calculateProgressiveTax(500, bands).marginalRate).toBe(0.45);
  });

  it('gives a breakdown whose band amounts sum back to the income', () => {
    const { breakdown } = calculateProgressiveTax(250, bands);
    const summed = breakdown.reduce((total, band) => total + band.amountInBand, 0);
    expect(summed).toBe(250);
  });

  it('gives a breakdown whose tax entries sum to the total', () => {
    const { breakdown, total } = calculateProgressiveTax(250, bands);
    const summed = breakdown.reduce((sum, band) => sum + band.tax, 0);
    expect(money(summed)).toBe(money(total));
  });

  it('throws rather than silently returning zero when bands are missing', () => {
    expect(() => calculateProgressiveTax(100, [])).toThrow(TypeError);
  });
});

describe('calculateTaperedAllowance', () => {
  const pa = taxData.incomeTax.personalAllowance;

  it('gives the full allowance below the taper threshold', () => {
    expect(calculateTaperedAllowance(60000, pa).allowance).toBe(12570);
    expect(calculateTaperedAllowance(100000, pa).isTapered).toBe(false);
  });

  it('removes 1 of allowance for every 2 of income above the threshold', () => {
    // 110,000 is 10,000 over => 5,000 of allowance lost
    expect(calculateTaperedAllowance(110000, pa).allowance).toBe(7570);
  });

  it('reaches exactly zero allowance at the documented cliff', () => {
    expect(calculateTaperedAllowance(125140, pa).allowance).toBe(0);
  });

  it('never goes negative above the cliff', () => {
    expect(calculateTaperedAllowance(250000, pa).allowance).toBe(0);
  });
});

describe('calculateThresholdTax', () => {
  it('charges nothing at or below the threshold', () => {
    expect(calculateThresholdTax(25000, 29385, 0.09).total).toBe(0);
    expect(calculateThresholdTax(29385, 29385, 0.09).total).toBe(0);
  });

  it('charges the rate on income above the threshold only', () => {
    expect(money(calculateThresholdTax(39385, 29385, 0.09).total)).toBe(900);
  });
});

describe('pay-frequency normalisation', () => {
  it('treats 4-weekly as 13 periods, not 12 redistributed', () => {
    expect(PERIODS_PER_YEAR.fourWeekly).toBe(13);
  });

  it('computes 4-weekly pay as annual/13, not via a rounded monthly figure (spec §47)', () => {
    // `monthly * 12 / 13` is algebraically identical to `annual / 13`, so the spec's warning is
    // really about ROUNDING: derive 4-weekly from a monthly figure that has already been rounded
    // for display and the answer drifts. 55,000 is chosen because it does not divide cleanly by 12.
    const annual = 55000;
    const roundedMonthly = money(annual / 12); // 4583.33, what the UI shows
    const viaRoundedMonthly = (roundedMonthly * 12) / 13;

    expect(fromAnnual(annual).fourWeekly).toBe(annual / 13);
    // Proves the two paths genuinely differ, so this test is not vacuous.
    expect(viaRoundedMonthly).not.toBe(annual / 13);
    expect(fromAnnual(annual).fourWeekly).not.toBe(viaRoundedMonthly);
  });

  it('keeps full precision internally and rounds only at the edge (spec §10)', () => {
    // 13 periods of the internal 4-weekly figure must reconstitute the annual salary exactly.
    const annual = 55000;
    expect(fromAnnual(annual).fourWeekly * 13).toBeCloseTo(annual, 9);
  });

  it('round-trips an amount through toAnnual and back', () => {
    const perPeriod = fromAnnual(52000).weekly;
    expect(money(toAnnual(perPeriod, 'weekly'))).toBe(52000);
  });

  it('uses the schedule for hourly and daily, which have no fixed period count', () => {
    expect(toAnnual(20, 'hourly', { hoursPerWeek: 37.5, weeksPerYear: 52 })).toBe(39000);
    expect(toAnnual(200, 'daily', { daysPerWeek: 5, weeksPerYear: 52 })).toBe(52000);
  });

  it('falls back to defaults for zero or nonsense schedule values', () => {
    expect(toAnnual(20, 'hourly', { hoursPerWeek: 0, weeksPerYear: -5 })).toBe(20 * 40 * 52);
  });

  it('throws on an unknown frequency instead of guessing', () => {
    expect(() => toAnnual(100, 'fortnightly')).toThrow(RangeError);
  });

  it('reports schedule-dependent period counts', () => {
    expect(periodsPerYear('hourly', { hoursPerWeek: 40, weeksPerYear: 52 })).toBe(2080);
    expect(periodsPerYear('monthly')).toBe(12);
  });
});

describe('calculateUkTakeHome — England, the reference case', () => {
  // The figures the design mockup shows. If the engine and the mockup ever disagree, one of
  // them is lying to the user, so this is pinned deliberately.
  const result = calculateUkTakeHome(
    { grossAnnual: 60000, region: 'england', pensionPercent: 5, pensionReliefMethod: 'net-pay-arrangement' },
    taxData,
  );

  it('applies the full personal allowance', () => {
    expect(result.personalAllowance.allowance).toBe(12570);
  });

  it('charges income tax of 11,432 on a 60,000 salary before pension relief is considered', () => {
    const noPension = calculateUkTakeHome({ grossAnnual: 60000, region: 'england' }, taxData);
    // 37,700 @ 20% = 7,540; 9,730 @ 40% = 3,892
    expect(money(noPension.incomeTax.total)).toBe(11432);
  });

  it('charges National Insurance of 3,210.60', () => {
    // 37,700 @ 8% = 3,016; 9,730 @ 2% = 194.60
    expect(money(result.nationalInsurance.total)).toBe(3210.6);
  });

  it('reduces taxable income by the pension contribution under a net pay arrangement', () => {
    // 3,000 contribution taken off before tax => 1,200 less higher-rate tax
    expect(money(result.incomeTax.total)).toBe(10232);
  });

  it('does NOT reduce National Insurance under a net pay arrangement', () => {
    const noPension = calculateUkTakeHome({ grossAnnual: 60000, region: 'england' }, taxData);
    expect(money(result.nationalInsurance.total)).toBe(money(noPension.nationalInsurance.total));
  });

  it('reconciles: gross minus every deduction equals net', () => {
    const sum = result.incomeTax.total
      + result.nationalInsurance.total
      + result.studentLoans.total
      + result.pension.takeHomeCost;
    expect(money(result.gross - sum)).toBe(money(result.netAnnual));
    expect(money(result.totalDeductions)).toBe(money(sum));
  });

  it('reports effective and marginal rate as different numbers', () => {
    expect(result.marginalRate).toBe(0.4);
    expect(result.effectiveRate).toBeLessThan(result.marginalRate);
  });
});

describe('calculateUkTakeHome — pension relief methods change the arithmetic', () => {
  const base = { grossAnnual: 60000, region: 'england', pensionPercent: 5 };

  const netPay = calculateUkTakeHome({ ...base, pensionReliefMethod: 'net-pay-arrangement' }, taxData);
  const sacrifice = calculateUkTakeHome({ ...base, pensionReliefMethod: 'salary-sacrifice' }, taxData);
  const atSource = calculateUkTakeHome({ ...base, pensionReliefMethod: 'relief-at-source' }, taxData);

  it('salary sacrifice reduces NI, net pay arrangement does not', () => {
    expect(sacrifice.nationalInsurance.total).toBeLessThan(netPay.nationalInsurance.total);
    // 3,000 sacrificed at the 2% band above the UEL
    expect(money(netPay.nationalInsurance.total - sacrifice.nationalInsurance.total)).toBe(60);
  });

  it('salary sacrifice leaves more take-home than net pay for the same percentage', () => {
    expect(sacrifice.netAnnual).toBeGreaterThan(netPay.netAnnual);
  });

  it('relief at source does not reduce taxable income', () => {
    const noPension = calculateUkTakeHome({ grossAnnual: 60000, region: 'england' }, taxData);
    expect(money(atSource.incomeTax.total)).toBe(money(noPension.incomeTax.total));
  });

  it('relief at source only costs the employee 80% of the contribution from net pay', () => {
    expect(money(atSource.pension.takeHomeCost)).toBe(2400);
    expect(money(netPay.pension.takeHomeCost)).toBe(3000);
  });
});

describe('calculateUkTakeHome — Scotland diverges from the rest of the UK', () => {
  const england = calculateUkTakeHome({ grossAnnual: 60000, region: 'england' }, taxData);
  const scotland = calculateUkTakeHome({ grossAnnual: 60000, region: 'scotland' }, taxData);

  it('produces a different income tax figure for the same salary', () => {
    expect(scotland.incomeTax.total).not.toBe(england.incomeTax.total);
  });

  it('charges a Scottish higher-rate taxpayer more than an English one at 60,000', () => {
    expect(scotland.incomeTax.total).toBeGreaterThan(england.incomeTax.total);
  });

  it('uses the Scottish band set and reports it', () => {
    expect(scotland.region.bandSet).toBe('scotland');
    expect(england.region.bandSet).toBe('rUK');
  });

  it('applies the same National Insurance — NI is not devolved', () => {
    expect(money(scotland.nationalInsurance.total)).toBe(money(england.nationalInsurance.total));
  });

  it('throws on an unknown region rather than silently defaulting', () => {
    expect(() => calculateUkTakeHome({ grossAnnual: 60000, region: 'cornwall' }, taxData)).toThrow(RangeError);
  });
});

describe('calculateUkTakeHome — the 100k personal allowance taper', () => {
  it('flags that the user is inside the taper', () => {
    const result = calculateUkTakeHome({ grossAnnual: 110000, region: 'england' }, taxData);
    expect(result.isInAllowanceTaper).toBe(true);
    expect(result.personalAllowance.allowance).toBe(7570);
  });

  it('creates an effective marginal rate above 40% across the taper', () => {
    const at100k = calculateUkTakeHome({ grossAnnual: 100000, region: 'england' }, taxData);
    const at101k = calculateUkTakeHome({ grossAnnual: 101000, region: 'england' }, taxData);
    const extraTax = at101k.incomeTax.total - at100k.incomeTax.total;
    // 1,000 more gross costs 400 of higher-rate tax plus 200 on the 500 of allowance lost
    expect(money(extraTax)).toBe(600);
  });

  it('gives no allowance at all above the cliff', () => {
    const result = calculateUkTakeHome({ grossAnnual: 130000, region: 'england' }, taxData);
    expect(result.personalAllowance.allowance).toBe(0);
    expect(result.isInAllowanceTaper).toBe(false);
  });
});

describe('calculateUkTakeHome — student loans', () => {
  it('deducts nothing below the plan threshold', () => {
    const result = calculateUkTakeHome({ grossAnnual: 20000, region: 'england', studentLoanPlan: 'plan-2' }, taxData);
    expect(result.studentLoans.total).toBe(0);
  });

  it('deducts 9% of income above the Plan 2 threshold', () => {
    const result = calculateUkTakeHome({ grossAnnual: 40000, region: 'england', studentLoanPlan: 'plan-2' }, taxData);
    expect(money(result.studentLoans.total)).toBe(money((40000 - 29385) * 0.09));
  });

  it('applies an undergraduate plan and a postgraduate loan at the same time', () => {
    const result = calculateUkTakeHome(
      { grossAnnual: 40000, region: 'england', studentLoanPlan: 'plan-2', hasPostgraduateLoan: true },
      taxData,
    );
    expect(result.studentLoans.entries).toHaveLength(2);
    const expected = (40000 - 29385) * 0.09 + (40000 - 21000) * 0.06;
    expect(money(result.studentLoans.total)).toBe(money(expected));
  });

  it('does not double-count when the selected plan IS the postgraduate loan', () => {
    const result = calculateUkTakeHome(
      { grossAnnual: 40000, region: 'england', studentLoanPlan: 'postgraduate', hasPostgraduateLoan: true },
      taxData,
    );
    expect(result.studentLoans.entries).toHaveLength(1);
  });

  it('throws on an unknown plan', () => {
    expect(() => calculateUkTakeHome({ grossAnnual: 40000, studentLoanPlan: 'plan-9' }, taxData)).toThrow(RangeError);
  });
});

describe('calculateUkBonusImpact', () => {
  const impact = calculateUkBonusImpact(
    { grossAnnual: 60000, bonus: 10000, region: 'england' },
    taxData,
  );

  it('reports net bonus as the difference between take-home with and without it', () => {
    expect(money(impact.netBonus)).toBe(
      money(impact.withBonus.netAnnual - impact.withoutBonus.netAnnual),
    );
  });

  it('is not simply bonus times the marginal rate', () => {
    // At 60k -> 70k the whole bonus sits in the 40% band and above the NI upper limit,
    // so the naive 40% answer misses the 2% NI entirely.
    const naive = 10000 * 0.4;
    expect(money(impact.deductedFromBonus)).not.toBe(money(naive));
    expect(money(impact.deductedFromBonus)).toBe(money(10000 * 0.42));
  });

  it('captures the allowance taper, where the naive method is most wrong', () => {
    const taperImpact = calculateUkBonusImpact(
      { grossAnnual: 100000, bonus: 10000, region: 'england' },
      taxData,
    );
    // 40% band + 2% NI + 20% from losing 5,000 of allowance = 62% of the bonus
    expect(money(taperImpact.effectiveBonusRate * 100)).toBe(62);
  });
});

describe('tax-data integrity', () => {
  it.each(['income-tax.json', 'national-insurance.json', 'student-loans.json', 'pension.json'])(
    '%s carries the mandatory versioning metadata (spec §11.1)',
    (file) => {
      const data = load(file);
      for (const key of ['country', 'dataset', 'taxYear', 'effectiveFrom', 'effectiveTo', 'source']) {
        expect(data[key]).toBeTruthy();
      }
      expect(data).toHaveProperty('lastVerified');
    },
  );

  it('has contiguous income tax bands in every band set', () => {
    for (const set of Object.values(taxData.incomeTax.bandSets)) {
      set.bands.forEach((band, i) => {
        if (i < set.bands.length - 1) {
          expect(band.to).toBe(set.bands[i + 1].from);
        } else {
          expect(band.to).toBeNull();
        }
      });
    }
  });

  it('maps every region to a band set that exists', () => {
    for (const region of Object.values(taxData.incomeTax.regions)) {
      expect(taxData.incomeTax.bandSets[region.bandSet]).toBeDefined();
    }
  });
});
