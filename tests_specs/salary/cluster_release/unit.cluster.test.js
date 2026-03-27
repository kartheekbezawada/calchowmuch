import { describe, expect, it } from 'vitest';
import {
  buildSalaryMetadata,
  calculateBonus,
  calculateRaise,
  calculateSalaryCommission,
  calculateWeeklyPay,
  convertAnnualPay,
  toAnnualPay,
} from '../../../public/calculators/salary-calculators/shared/salary-utils.js';

describe('salary cluster shared helpers', () => {
  it('SALARY-CLUSTER-U-1: annual pay conversion supports hourly and monthly inputs', () => {
    expect(
      toAnnualPay({ amount: 25, frequency: 'hourly', hoursPerWeek: 40, weeksPerYear: 52, daysPerWeek: 5 })
    ).toBeCloseTo(52000, 8);
    expect(
      toAnnualPay({ amount: 5000, frequency: 'monthly', hoursPerWeek: 40, weeksPerYear: 52, daysPerWeek: 5 })
    ).toBeCloseTo(60000, 8);
  });

  it('SALARY-CLUSTER-U-2: annual pay breakdown exposes hourly, daily, weekly, and monthly outputs', () => {
    const result = convertAnnualPay({ annualPay: 52000, hoursPerWeek: 40, weeksPerYear: 52, daysPerWeek: 5 });

    expect(result).not.toBeNull();
    expect(result.monthlyPay).toBeCloseTo(4333.333333, 6);
    expect(result.weeklyPay).toBeCloseTo(1000, 8);
    expect(result.dailyPay).toBeCloseTo(200, 8);
    expect(result.hourlyPay).toBeCloseTo(25, 8);
  });

  it('SALARY-CLUSTER-U-3: weekly, raise, bonus, and commission helpers cover core earnings modes', () => {
    const weekly = calculateWeeklyPay({ mode: 'split', hourlyRate: 25, regularHours: 40, overtimeHours: 5, overtimeMultiplier: 1.5, weeksPerYear: 52 });
    expect(weekly?.weeklyPay).toBeCloseTo(1187.5, 8);

    const raise = calculateRaise({ currentSalary: 60000, mode: 'amount', raiseAmount: 4000 });
    expect(raise?.newSalary).toBeCloseTo(64000, 8);

    const bonus = calculateBonus({ salaryAmount: 60000, mode: 'percent', bonusPercent: 10 });
    expect(bonus?.bonusAmount).toBeCloseTo(6000, 8);

    const commission = calculateSalaryCommission({ salesAmount: 50000, mode: 'rate', commissionRate: 8, basePay: 3000 });
    expect(commission?.commissionAmount).toBeCloseTo(4000, 8);
    expect(commission?.totalEarnings).toBeCloseTo(7000, 8);
  });

  it('SALARY-CLUSTER-U-4: metadata builder emits breadcrumb and software application entries', () => {
    const metadata = buildSalaryMetadata({
      title: 'Salary Calculator | Example',
      description: 'Example description',
      canonical: 'https://calchowmuch.com/salary-calculators/salary-calculator/',
      name: 'Salary Calculator',
      appDescription: 'Example app description',
      featureList: ['Example feature'],
      faqSchema: { '@type': 'FAQPage', mainEntity: [] },
    });

    const graph = metadata.structuredData['@graph'];
    expect(graph.some((node) => node['@type'] === 'WebPage')).toBeTruthy();
    expect(graph.some((node) => node['@type'] === 'SoftwareApplication')).toBeTruthy();
    expect(graph.some((node) => node['@type'] === 'BreadcrumbList')).toBeTruthy();
    expect(metadata.pageSchema.calculatorFAQ).toBe(true);
  });

  it('SALARY-CLUSTER-U-5: shared helpers reject invalid inputs', () => {
    expect(
      toAnnualPay({ amount: -1, frequency: 'annual', hoursPerWeek: 40, weeksPerYear: 52, daysPerWeek: 5 })
    ).toBeNull();
    expect(calculateRaise({ currentSalary: 0, mode: 'percent', raisePercent: 5 })).toBeNull();
    expect(calculateBonus({ salaryAmount: 60000, mode: 'amount', bonusAmount: -1 })).toBeNull();
    expect(calculateSalaryCommission({ salesAmount: 0, mode: 'rate', commissionRate: 8 })).toBeNull();
  });
});
