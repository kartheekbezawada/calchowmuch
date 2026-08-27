import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

import {
  calculateUsBonusImpact,
  calculateUsTakeHome,
} from '../../../public/calculators/salary-calculators/shared/tax-engine/us-engine.js';

const ROOT = path.resolve(process.cwd(), 'public/calculators/salary-calculators/shared/tax-data/us');
const load = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));

const federal = load('federal-income-tax.json');
const fica = load('fica.json');
const payroll = load('payroll-taxes.json');
const state = (code) => load(`states/${code}.json`);

const money = (n) => Math.round(n * 100) / 100;
const run = (input, code = 'TX') =>
  calculateUsTakeHome(input, { federal, fica, state: state(code), payroll });

describe('federal income tax', () => {
  it('matches a hand calculation for 100,000 single', () => {
    // taxable = 100,000 - 16,100 = 83,900
    // 12,400@10% = 1,240 | 38,000@12% = 4,560 | 33,500@22% = 7,370  => 13,170
    const r = run({ grossAnnual: 100000, filingStatus: 'single' });
    expect(r.federalTaxableIncome).toBe(83900);
    expect(money(r.federalTax.total)).toBe(13170);
  });

  it('applies a different standard deduction and bands per filing status', () => {
    const byStatus = ['single', 'marriedFilingJointly', 'marriedFilingSeparately', 'headOfHousehold']
      .map((filingStatus) => money(run({ grossAnnual: 100000, filingStatus }).federalTax.total));
    // Joint pays least; single and MFS are identical at this income.
    expect(byStatus[1]).toBeLessThan(byStatus[0]);
    expect(byStatus[3]).toBeLessThan(byStatus[0]);
    expect(byStatus[0]).toBe(byStatus[2]);
  });

  it('puts the MFS top bracket at 384,350, NOT the 640,600 the IRS summary implies', () => {
    // The newsroom summary reads as though MFS shares Single's top threshold. Rev. Proc. 2025-32
    // Table 4 says otherwise, and getting this wrong under-taxes high MFS earners.
    const mfs = federal.filingStatuses.marriedFilingSeparately.bands.at(-1);
    const single = federal.filingStatuses.single.bands.at(-1);
    expect(mfs.from).toBe(384350);
    expect(single.from).toBe(640600);
    expect(mfs.from).toBe(federal.filingStatuses.marriedFilingJointly.bands.at(-1).from / 2);
  });

  it('throws on an unknown filing status rather than defaulting', () => {
    expect(() => run({ grossAnnual: 100000, filingStatus: 'widowed' })).toThrow(RangeError);
  });
});

describe('FICA', () => {
  it('charges 6.2% + 1.45% below the wage base', () => {
    const r = run({ grossAnnual: 100000, filingStatus: 'single' });
    expect(money(r.fica.socialSecurity)).toBe(6200);
    expect(money(r.fica.medicare)).toBe(1450);
    expect(money(r.fica.total)).toBe(7650);
  });

  it('caps Social Security at the wage base but never caps Medicare', () => {
    const r = run({ grossAnnual: 300000, filingStatus: 'single' });
    expect(money(r.fica.socialSecurity)).toBe(money(184500 * 0.062));
    expect(money(r.fica.medicare)).toBe(money(300000 * 0.0145));
  });

  it('adds Additional Medicare above 200,000 only', () => {
    expect(run({ grossAnnual: 190000, filingStatus: 'single' }).fica.additionalMedicare).toBe(0);
    expect(money(run({ grossAnnual: 300000, filingStatus: 'single' }).fica.additionalMedicare))
      .toBe(money(100000 * 0.009));
  });

  it('is charged on GROSS wages, so a 401(k) does not reduce it', () => {
    const plain = run({ grossAnnual: 100000, filingStatus: 'single' });
    const with401k = run({ grossAnnual: 100000, filingStatus: 'single', pretaxDeductions: 10000 });
    expect(money(with401k.fica.total)).toBe(money(plain.fica.total));
    // ...but it does cut income tax.
    expect(with401k.federalTax.total).toBeLessThan(plain.federalTax.total);
    expect(money(plain.federalTax.total - with401k.federalTax.total)).toBe(2200); // 10,000 @ 22%
  });
});

describe('state income tax', () => {
  it('charges nothing in a no-income-tax state', () => {
    const r = run({ grossAnnual: 100000, filingStatus: 'single' }, 'TX');
    expect(r.stateTax.total).toBe(0);
    expect(r.stateTax.structure).toBe('none');
  });

  it('treats Washington as no-tax for wages despite its capital gains tax', () => {
    expect(run({ grossAnnual: 100000, filingStatus: 'single' }, 'WA').stateTax.total).toBe(0);
  });

  it('applies a flat rate with no deduction in Pennsylvania', () => {
    const r = run({ grossAnnual: 100000, filingStatus: 'single' }, 'PA');
    expect(money(r.stateTax.total)).toBe(3070);
  });

  it('applies graduated bands in California', () => {
    const r = run({ grossAnnual: 100000, filingStatus: 'single' }, 'CA');
    expect(r.stateTax.structure).toBe('graduated');
    expect(r.stateTax.total).toBeGreaterThan(0);
    expect(r.stateTax.deductionApplied).toBe(5706);
  });

  it('produces materially different take-home across states on the same salary', () => {
    const tx = run({ grossAnnual: 100000, filingStatus: 'single' }, 'TX').netAnnual;
    const ca = run({ grossAnnual: 100000, filingStatus: 'single' }, 'CA').netAnnual;
    expect(tx).toBeGreaterThan(ca);
    expect(tx - ca).toBeGreaterThan(5000);
  });
});

describe('state payroll taxes (Bucket A)', () => {
  it('charges CA SDI on all wages, with no cap', () => {
    const r = run({ grossAnnual: 100000, filingStatus: 'single' }, 'CA');
    expect(money(r.statePayrollTaxes.total)).toBe(1300);
  });

  it('charges NJ TDI and FLI as separate line items', () => {
    const r = run({ grossAnnual: 100000, filingStatus: 'single' }, 'NJ');
    expect(r.statePayrollTaxes.entries).toHaveLength(2);
    expect(money(r.statePayrollTaxes.total)).toBe(420);
  });

  it('caps NJ contributions at the wage base', () => {
    const r = run({ grossAnnual: 300000, filingStatus: 'single' }, 'NJ');
    expect(money(r.statePayrollTaxes.total)).toBe(money(171100 * (0.0019 + 0.0023)));
  });

  it('flags a state whose programme is known but not yet modelled', () => {
    const r = run({ grossAnnual: 100000, filingStatus: 'single' }, 'OR');
    expect(r.statePayrollTaxes.hasUnmodelledProgram).toBe(true);
    expect(r.assumptions.join(' ')).toMatch(/not yet modelled/);
  });

  it('charges nothing in a state with no programme at all', () => {
    const r = run({ grossAnnual: 100000, filingStatus: 'single' }, 'TX');
    expect(r.statePayrollTaxes.total).toBe(0);
    expect(r.statePayrollTaxes.hasUnmodelledProgram).toBe(false);
  });
});

describe('result integrity', () => {
  it('reconciles gross minus every deduction to net', () => {
    const r = run({ grossAnnual: 120000, filingStatus: 'single', pretaxDeductions: 8000 }, 'CA');
    const sum = r.federalTax.total + r.fica.total + r.stateTax.total
      + r.statePayrollTaxes.total + r.pretaxDeductions;
    expect(money(sum)).toBe(money(r.totalDeductions));
    expect(money(r.gross - sum)).toBe(money(r.netAnnual));
  });

  it('reports federal and state marginal rates separately, never merged silently', () => {
    const r = run({ grossAnnual: 100000, filingStatus: 'single' }, 'CA');
    expect(r.marginalRate).toBe(0.22);
    expect(r.stateMarginalRate).toBeGreaterThan(0);
    expect(money(r.combinedMarginalRate)).toBe(money(r.marginalRate + r.stateMarginalRate));
    expect(r.effectiveRate).toBeLessThan(r.combinedMarginalRate);
  });

  it('always flags that local income tax is excluded (B2)', () => {
    for (const code of ['CA', 'NY', 'TX', 'PA']) {
      expect(run({ grossAnnual: 100000, filingStatus: 'single' }, code).localTaxExcluded).toBe(true);
    }
  });
});

describe('bonus impact', () => {
  it('is the difference between two full results, not bonus times marginal rate', () => {
    const impact = calculateUsBonusImpact(
      { grossAnnual: 100000, bonus: 10000, filingStatus: 'single' },
      { federal, fica, state: state('TX'), payroll }
    );
    expect(money(impact.netBonus))
      .toBe(money(impact.withBonus.netAnnual - impact.withoutBonus.netAnnual));
    // 22% federal + 1.45% Medicare + 6.2% SS (still under the wage base) = 29.65%
    expect(money(impact.effectiveBonusRate * 100)).toBe(29.65);
  });

  it('captures Social Security dropping out above the wage base', () => {
    // At 250,000 the whole bonus sits above the SS wage base, so no SS is charged on it -
    // a marginal-rate calculation using a flat FICA figure would get this wrong.
    const impact = calculateUsBonusImpact(
      { grossAnnual: 250000, bonus: 10000, filingStatus: 'single' },
      { federal, fica, state: state('TX'), payroll }
    );
    expect(impact.withBonus.fica.socialSecurity)
      .toBe(impact.withoutBonus.fica.socialSecurity);
  });
});

describe('tax-data integrity', () => {
  it('has all 51 jurisdictions', () => {
    const files = fs.readdirSync(path.join(ROOT, 'states')).filter((f) => f.endsWith('.json'));
    expect(files).toHaveLength(51);
  });

  it('gives every state file contiguous bands and an unbounded top band', () => {
    for (const file of fs.readdirSync(path.join(ROOT, 'states'))) {
      const data = load(`states/${file}`);
      for (const status of Object.values(data.filingStatuses || {})) {
        status.bands.forEach((band, i) => {
          if (i < status.bands.length - 1) expect(band.to).toBe(status.bands[i + 1].from);
          else expect(band.to).toBeNull();
        });
      }
    }
  });

  it('marks the nine no-income-tax states plus Washington as `none`', () => {
    const none = ['AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WY', 'WA'];
    for (const code of none) expect(state(code).taxStructure).toBe('none');
  });

  it('carries §11.1 metadata on every US file', () => {
    const files = ['federal-income-tax.json', 'fica.json', 'payroll-taxes.json',
      ...fs.readdirSync(path.join(ROOT, 'states')).map((f) => `states/${f}`)];
    for (const f of files) {
      const d = load(f);
      for (const key of ['country', 'dataset', 'taxYear', 'effectiveFrom', 'effectiveTo', 'source']) {
        expect(d[key], `${f} missing ${key}`).toBeTruthy();
      }
      expect(d.verification.status, `${f} status`).toMatch(/^(verified|aggregated-source)$/);
    }
  });
});
