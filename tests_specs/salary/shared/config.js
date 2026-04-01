export const SALARY_HUB_ROUTE = '/salary-calculators/';
export const SALARY_HUB_TITLE =
  'Salary Calculators | Pay Conversion, Overtime, Raise, Bonus & Commission';
export const SALARY_HUB_DESCRIPTION =
  'Browse salary calculators to convert pay, compare overtime, model raises, estimate bonuses, and plan commission-based earnings with gross-pay assumptions.';

export const SALARY_CALCULATOR_CONFIGS = {
  'salary-calculator': {
    route: '/salary-calculators/salary-calculator/',
    h1: 'Salary Calculator',
    title: 'Salary Calculator | Convert Hourly, Daily, Weekly, Monthly and Annual Pay',
    description:
      'Convert gross pay across hourly, daily, weekly, biweekly, monthly, and annual views using your work schedule assumptions.',
    runE2E: async ({ page, expect, parseNumericText }) => {
      await page.click('button[data-value="hourly"]');
      await page.click('#salary-assumptions summary');
      await page.fill('#salary-pay-amount', '25');
      await page.fill('#salary-hours-per-week', '40');
      await page.fill('#salary-weeks-per-year', '52');
      await page.fill('#salary-days-per-week', '5');
      await page.click('#salary-calc-button');

      expect(parseNumericText(await page.locator('#salary-annual-pay').textContent())).toBeCloseTo(52000, 2);
      expect(parseNumericText(await page.locator('#salary-daily-pay').textContent())).toBeCloseTo(200, 2);
      await expect(page.locator('#salary-answer-context')).toContainText('from hourly pay');
    },
  },
  'hourly-to-salary-calculator': {
    route: '/salary-calculators/hourly-to-salary-calculator/',
    h1: 'Hourly to Salary Calculator',
    title: 'Hourly to Salary Calculator | Convert Hourly Pay to Annual Salary',
    description:
      'Convert hourly pay into annual salary, monthly pay, biweekly pay, and weekly earnings using hours worked and weeks per year.',
    runE2E: async ({ page, expect, parseNumericText }) => {
      await page.fill('#hourly-rate', '25');
      await page.fill('#hourly-hours-per-week', '40');
      await page.fill('#hourly-weeks-per-year', '52');
      await page.click('#hourly-calc-button');

      expect(parseNumericText(await page.locator('#hourly-annual-result').textContent())).toBeCloseTo(52000, 2);
      expect(parseNumericText(await page.locator('#hourly-monthly-result').textContent())).toBeCloseTo(4333.33, 2);
    },
  },
  'salary-to-hourly-calculator': {
    route: '/salary-calculators/salary-to-hourly-calculator/',
    h1: 'Salary to Hourly Calculator',
    title: 'Salary to Hourly Calculator | Convert Annual Salary to Hourly Pay',
    description:
      'Convert annual salary into hourly pay, weekly pay, biweekly pay, and monthly earnings using your hours worked and weeks per year.',
    runE2E: async ({ page, expect, parseNumericText }) => {
      await page.fill('#salary-annual-input', '52000');
      await page.fill('#salary-hours-input', '40');
      await page.fill('#salary-weeks-input', '52');
      await page.click('#salary-to-hourly-button');

      expect(parseNumericText(await page.locator('#salary-hourly-result').textContent())).toBeCloseTo(25, 2);
      expect(parseNumericText(await page.locator('#salary-weekly-result').textContent())).toBeCloseTo(1000, 2);
    },
  },
  'annual-to-monthly-salary-calculator': {
    route: '/salary-calculators/annual-to-monthly-salary-calculator/',
    h1: 'Annual to Monthly Salary Calculator',
    title: 'Annual to Monthly Salary Calculator | Convert Yearly Pay to Monthly Income',
    description:
      'Convert annual salary into monthly income, then compare biweekly and weekly gross pay from your yearly amount.',
    runE2E: async ({ page, expect, parseNumericText }) => {
      await page.fill('#annual-salary-input', '72000');
      await page.fill('#annual-weeks-input', '52');
      await page.click('#annual-to-monthly-button');

      expect(parseNumericText(await page.locator('#annual-monthly-result').textContent())).toBeCloseTo(6000, 2);
      expect(parseNumericText(await page.locator('#annual-weekly-result').textContent())).toBeCloseTo(1384.62, 2);
    },
  },
  'monthly-to-annual-salary-calculator': {
    route: '/salary-calculators/monthly-to-annual-salary-calculator/',
    h1: 'Monthly to Annual Salary Calculator',
    title: 'Monthly to Annual Salary Calculator | Convert Monthly Pay to Yearly Salary',
    description:
      'Convert monthly salary into annual pay, then compare biweekly and weekly gross pay from your monthly amount.',
    runE2E: async ({ page, expect, parseNumericText }) => {
      await page.fill('#monthly-salary-input', '5000');
      await page.fill('#monthly-weeks-input', '52');
      await page.click('#monthly-to-annual-button');

      expect(parseNumericText(await page.locator('#monthly-annual-result').textContent())).toBeCloseTo(60000, 2);
      expect(parseNumericText(await page.locator('#monthly-weekly-result').textContent())).toBeCloseTo(1153.85, 2);
    },
  },
  'weekly-pay-calculator': {
    route: '/salary-calculators/weekly-pay-calculator/',
    h1: 'Weekly Pay Calculator',
    title: 'Weekly Pay Calculator | Weekly Earnings From Hours, Rate and Overtime',
    description:
      'Estimate weekly gross pay from hourly rate, regular hours, overtime hours, and overtime multiplier, then annualize the result.',
    runE2E: async ({ page, expect, parseNumericText }) => {
      await page.fill('#weekly-hourly-rate', '25');
      await page.click('button[data-value="split"]');
      await page.fill('#weekly-regular-hours', '40');
      await page.fill('#weekly-overtime-hours', '5');
      await page.fill('#weekly-overtime-multiplier', '1.5');
      await page.fill('#weekly-weeks-per-year', '52');
      await page.click('#weekly-pay-button');

      expect(parseNumericText(await page.locator('#weekly-pay-result').textContent())).toBeCloseTo(1187.5, 2);
      expect(parseNumericText(await page.locator('#weekly-annualized-pay').textContent())).toBeCloseTo(61750, 2);
      await expect(page.locator('#weekly-pay-context')).toContainText('regular hours');
    },
  },
  'overtime-pay-calculator': {
    route: '/salary-calculators/overtime-pay-calculator/',
    h1: 'Overtime Pay Calculator',
    title: 'Overtime Pay Calculator | Extra Pay and Total Gross Earnings',
    description:
      'Estimate overtime pay from hourly rate, overtime hours, and multiplier, then compare overtime-only pay with total gross earnings.',
    runE2E: async ({ page, expect, parseNumericText }) => {
      await page.fill('#overtime-hourly-rate', '25');
      await page.fill('#overtime-hours', '10');
      await page.fill('#overtime-multiplier', '1.5');
      await page.fill('#overtime-base-pay', '1000');
      await page.click('#overtime-pay-button');

      expect(parseNumericText(await page.locator('#overtime-pay-result').textContent())).toBeCloseTo(375, 2);
      expect(parseNumericText(await page.locator('#overtime-total-pay').textContent())).toBeCloseTo(1375, 2);
    },
  },
  'raise-calculator': {
    route: '/salary-calculators/raise-calculator/',
    h1: 'Raise Calculator',
    title: 'Raise Calculator | New Salary, Raise Amount and Raise Percentage',
    description:
      'Calculate a new salary after a raise, compare raise amount versus raise percentage, and estimate the gross-pay impact.',
    runE2E: async ({ page, expect, parseNumericText }) => {
      await page.fill('#raise-current-salary', '60000');
      await page.click('button[data-value="amount"]');
      await page.fill('#raise-amount', '4000');
      await page.click('#raise-button');

      expect(parseNumericText(await page.locator('#raise-new-salary').textContent())).toBeCloseTo(64000, 2);
      expect(parseNumericText(await page.locator('#raise-amount-output').textContent())).toBeCloseTo(4000, 2);
      await expect(page.locator('#raise-percent-output')).toContainText('6.67%');
    },
  },
  'bonus-calculator': {
    route: '/salary-calculators/bonus-calculator/',
    h1: 'Bonus Calculator',
    title: 'Bonus Calculator | Bonus Amount, Bonus Percentage and Total Pay',
    description:
      'Calculate a bonus as a percentage of salary or a flat amount, then estimate total gross compensation.',
    runE2E: async ({ page, expect, parseNumericText }) => {
      await page.fill('#bonus-salary-amount', '60000');
      await page.click('button[data-value="amount"]');
      await page.fill('#bonus-amount', '8000');
      await page.click('#bonus-button');

      expect(parseNumericText(await page.locator('#bonus-amount-output').textContent())).toBeCloseTo(8000, 2);
      expect(parseNumericText(await page.locator('#bonus-total-compensation').textContent())).toBeCloseTo(68000, 2);
      await expect(page.locator('#bonus-percent-output')).toContainText('13.33%');
    },
  },
  'commission-calculator': {
    route: '/salary-calculators/commission-calculator/',
    h1: 'Commission Earnings Calculator',
    title: 'Commission Earnings Calculator | Sales Commission Pay & Base Pay',
    description:
      'Calculate commission earnings from sales, rate, or a known payout amount, then add base pay to estimate gross total earnings.',
    runE2E: async ({ page, expect, parseNumericText }) => {
      await page.fill('#commission-sales-amount', '50000');
      await page.click('button[data-value="amount"]');
      await page.fill('#commission-amount', '4000');
      await page.fill('#commission-base-pay', '3000');
      await page.click('#commission-button');

      expect(parseNumericText(await page.locator('#commission-earned-output').textContent())).toBeCloseTo(4000, 2);
      expect(parseNumericText(await page.locator('#commission-total-earnings').textContent())).toBeCloseTo(7000, 2);
      await expect(page.locator('#commission-effective-rate')).toContainText('8%');
    },
  },
  'inflation-adjusted-salary-calculator': {
    route: '/salary-calculators/inflation-adjusted-salary-calculator/',
    h1: 'Inflation Adjusted Salary Calculator',
    title: 'Inflation Adjusted Salary Calculator | Real Raise vs Inflation',
    description:
      'Compare current salary, new salary, inflation rate, and years between pay points to see whether a raise beats inflation in real terms.',
    runE2E: async ({ page, expect, parseNumericText }) => {
      await page.fill('#inflation-salary-current', '60000');
      await page.fill('#inflation-salary-new', '66000');
      await page.fill('#inflation-salary-rate', '3');
      await page.fill('#inflation-salary-years', '2');
      await page.click('#inflation-salary-button');

      expect(parseNumericText(await page.locator('#inflation-salary-required').textContent())).toBeCloseTo(63654, 0);
      expect(parseNumericText(await page.locator('#inflation-salary-real-gap').textContent())).toBeCloseTo(2346, 0);
      await expect(page.locator('#inflation-salary-note')).toContainText('beats inflation');
    },
  },
};

export const SALARY_CALCULATOR_IDS = Object.keys(SALARY_CALCULATOR_CONFIGS);
