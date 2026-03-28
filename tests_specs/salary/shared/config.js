export const SALARY_HUB_ROUTE = '/salary-calculators/';
export const SALARY_HUB_TITLE =
  'Salary Calculators | Pay Conversion, Overtime, Bonus and Raise Tools';
export const SALARY_HUB_DESCRIPTION =
  'Explore salary calculators for hourly to salary conversion, annual and monthly pay, overtime, raises, bonuses, and commission estimates.';

export const SALARY_CALCULATOR_CONFIGS = {
  'salary-calculator': {
    route: '/salary-calculators/salary-calculator/',
    h1: 'Salary Calculator',
    title: 'Salary Calculator | Convert Hourly, Daily, Weekly, Monthly and Annual Pay',
    description:
      'Convert a salary or pay rate across hourly, daily, weekly, biweekly, monthly, and annual amounts using your work schedule assumptions.',
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
      'Convert an hourly wage into annual salary, monthly pay, biweekly pay, and weekly pay using your hours worked and weeks per year.',
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
      'Convert annual salary into hourly pay, weekly pay, biweekly pay, and monthly pay using your hours worked and weeks per year.',
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
    title: 'Annual to Monthly Salary Calculator | Convert Yearly Pay to Monthly',
    description:
      'Convert annual salary into monthly pay, with optional biweekly and weekly estimates based on your yearly income.',
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
      'Convert monthly salary into annual pay, with optional biweekly and weekly estimates based on your monthly income.',
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
    title: 'Weekly Pay Calculator | Estimate Weekly Earnings From Hours and Rate',
    description:
      'Estimate weekly pay from your hourly rate and hours worked, with optional support for regular and overtime hour splits.',
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
    title: 'Overtime Pay Calculator | Estimate Extra Pay From Overtime Hours',
    description:
      'Estimate overtime pay from your hourly rate, overtime hours, and overtime multiplier, with optional total-pay output.',
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
    title: 'Raise Calculator | Calculate New Salary After a Pay Raise',
    description:
      'Calculate a new salary after a raise using either a percentage increase or a flat raise amount.',
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
    title: 'Bonus Calculator | Calculate Bonus as Amount or Percentage of Salary',
    description:
      'Calculate a bonus as a percentage of salary or as a flat amount, and estimate total compensation.',
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
    h1: 'Commission Calculator',
    title: 'Commission Calculator | Calculate Earnings From Sales Commission',
    description:
      'Calculate commission earnings from sales and commission rate, with optional total earnings when base pay is included.',
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
      'Compare current salary, new salary, inflation rate, and years between pay points to see whether a raise keeps up with inflation.',
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
