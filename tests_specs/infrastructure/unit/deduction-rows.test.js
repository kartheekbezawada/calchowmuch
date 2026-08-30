import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { deductionRows } from '../../../public/calculators/salary-calculators/shared/tax-engine/deduction-rows.js';
import { calculateUkTakeHome } from '../../../public/calculators/salary-calculators/shared/tax-engine/uk-engine.js';
import { calculateUsTakeHome } from '../../../public/calculators/salary-calculators/shared/tax-engine/us-engine.js';
import { calculateCaTakeHome } from '../../../public/calculators/salary-calculators/shared/tax-engine/ca-engine.js';

const DATA = path.resolve(
  process.cwd(),
  'public/calculators/salary-calculators/shared/tax-data'
);
const load = (rel) => JSON.parse(fs.readFileSync(path.join(DATA, rel), 'utf8'));

describe('deduction-rows mapper (spec §62)', () => {
  it('UK: Income Tax, National Insurance, then pension / student loan when present', () => {
    const taxData = {
      incomeTax: load('uk/income-tax.json'),
      nationalInsurance: load('uk/national-insurance.json'),
      studentLoans: load('uk/student-loans.json'),
      pension: load('uk/pension.json'),
    };
    const plain = deductionRows(calculateUkTakeHome({ grossAnnual: 60000 }, taxData));
    expect(plain.map((r) => r.id)).toEqual(['incomeTax', 'ni']);

    const withExtras = deductionRows(
      calculateUkTakeHome(
        { grossAnnual: 60000, pensionPercent: 5, studentLoanPlan: 'plan-2' },
        taxData
      )
    );
    expect(withExtras.map((r) => r.id)).toContain('pension');
    expect(withExtras.map((r) => r.id)).toContain('plan-2');
    for (const row of withExtras) expect(row.amount).toBeGreaterThan(0);
  });

  it('US: federal, state, Social Security, Medicare, and pre-tax when present', () => {
    const taxData = {
      federal: load('us/federal-income-tax.json'),
      fica: load('us/fica.json'),
      state: load('us/states/CA.json'),
      payroll: load('us/payroll-taxes.json'),
    };
    const rows = deductionRows(
      calculateUsTakeHome({ grossAnnual: 120000, filingStatus: 'single', pretaxDeductions: 10000 }, taxData)
    );
    const ids = rows.map((r) => r.id);
    expect(ids).toContain('federal');
    expect(ids).toContain('state');
    expect(ids).toContain('socialSecurity');
    expect(ids).toContain('medicare');
    expect(ids).toContain('pretax');
    expect(rows.find((r) => r.id === 'pretax').amount).toBe(10000);
  });

  it('CA: federal, provincial, CPP and EI', () => {
    const ca = load('ca.json');
    const rows = deductionRows(
      calculateCaTakeHome(
        { grossAnnual: 90000, province: 'ON' },
        { federal: ca.federal, cpp: ca.cpp, ei: ca.ei, province: ca.provinces.ON }
      )
    );
    const ids = rows.map((r) => r.id);
    expect(ids).toContain('federal');
    expect(ids).toContain('provincial');
    expect(ids).toContain('pensionPlan');
    expect(ids).toContain('ei');
    for (const row of rows) expect(row.amount).toBeGreaterThan(0);
  });

  it('reconciles: the summed rows equal the result total deductions (within rounding)', () => {
    const taxData = {
      incomeTax: load('uk/income-tax.json'),
      nationalInsurance: load('uk/national-insurance.json'),
      studentLoans: load('uk/student-loans.json'),
      pension: load('uk/pension.json'),
    };
    const result = calculateUkTakeHome(
      { grossAnnual: 75000, pensionPercent: 6, studentLoanPlan: 'plan-2' },
      taxData
    );
    const summed = deductionRows(result).reduce((s, r) => s + r.amount, 0);
    expect(summed).toBeCloseTo(result.totalDeductions, 6);
  });

  it('gross / null results return no rows', () => {
    expect(deductionRows(null)).toEqual([]);
    expect(deductionRows({ country: null })).toEqual([]);
  });
});
