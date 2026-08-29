export const SALARY_HUB_ROUTE = '/salary-calculators/';
export const SALARY_HUB_TITLE =
  'Salary Calculators | Pay Conversion, Overtime, Raise, Bonus & Commission';
export const SALARY_HUB_DESCRIPTION =
  'Browse salary calculators to convert pay, compare overtime, model raises, estimate bonuses, and plan commission-based earnings with gross-pay assumptions.';

export const SALARY_CALCULATOR_CONFIGS = {
  'salary-calculator': {
    route: '/salary-calculators/salary-calculator/',
    h1: 'Salary Calculator',
    title: 'Salary Calculator | UK, US and Canada Take-Home Pay Calculator',
    description:
      'Work out your take-home pay after tax in the UK, the US or Canada, or convert gross pay between hourly, weekly, monthly and annual. Free, and nothing is stored.',
    runE2E: async ({ page, expect, parseNumericText }) => {
      // --- Gross Pay mode (the default) must behave exactly as it always has -----------------
      await page.click('button[data-value="hourly"]');
      // Work schedule assumptions is always open now, not a click-to-expand <details>.
      await expect(page.locator('#salary-hours-per-week')).toBeVisible();
      await page.fill('#salary-pay-amount', '25');
      await page.fill('#salary-hours-per-week', '40');
      await page.fill('#salary-weeks-per-year', '52');
      await page.fill('#salary-days-per-week', '5');
      await page.click('#salary-calc-button');

      expect(parseNumericText(await page.locator('#salary-annual-pay').textContent())).toBeCloseTo(52000, 2);
      expect(parseNumericText(await page.locator('#salary-daily-pay').textContent())).toBeCloseTo(200, 2);
      await expect(page.locator('#salary-answer-context')).toContainText('source hourly pay');

      // Gross mode is currency-neutral — this page is used outside the UK too.
      expect(await page.locator('#salary-annual-pay').textContent()).not.toContain('£');
      await expect(page.locator('#salary-region-row')).toBeHidden();
      await expect(page.locator('#salary-optional')).toBeHidden();

      // --- UK take-home mode ------------------------------------------------------------------
      await page.click('.sal-mode-btn[data-value="uk"]');
      await page.fill('#salary-pay-amount', '60000');
      await page.click('button[data-value="annual"]');
      await page.click('#salary-calc-button');

      await expect(page.locator('#salary-region-row')).toBeVisible();
      // 60,000 in England: 11,432 income tax + 3,210.60 NI => 45,357.40 take-home.
      expect(parseNumericText(await page.locator('#salary-annual-pay').textContent())).toBeCloseTo(45357.4, 1);
      expect(await page.locator('#salary-annual-pay').textContent()).toContain('£');
      await expect(page.locator('#salary-effective-rate')).toContainText('%');

      // Scotland must produce a different figure — the region selector is not cosmetic.
      const englandNet = parseNumericText(await page.locator('#salary-annual-pay').textContent());
      await page.click('#salary-region-row button[data-value="scotland"]');
      await page.click('#salary-calc-button');
      const scotlandNet = parseNumericText(await page.locator('#salary-annual-pay').textContent());
      expect(scotlandNet).not.toBeCloseTo(englandNet, 1);
      await page.click('#salary-region-row button[data-value="england"]');

      // --- explanation follows the mode -------------------------------------------------------
      // Each mode shows only its own guidance. Both country sections stay in the DOM and are
      // hidden with CSS, so the crawler and the content scorer still see all of it.
      const ukCard = page.locator('#salary-calculator-explanation .sal-uk-only').first();
      const usCard = page.locator('#salary-calculator-explanation .sal-us-only').first();
      const grossCard = page.locator('#salary-calculator-explanation .sal-gross-only').first();
      await expect(ukCard).toBeVisible();
      await expect(usCard).toBeHidden();
      await expect(grossCard).toBeHidden();

      // --- pay sheet is available WITHOUT opening `+ Pay schedule` -----------------------------
      const schedChip = page.locator('.sal-opt-chip[data-opt="sched"]');
      await expect(schedChip).toHaveAttribute('aria-pressed', 'false');
      await expect(page.locator('#salary-paysheet')).toBeVisible();
      await expect(page.locator('#salary-paysheet tbody tr')).toHaveCount(12);
      // Default first payday is the 1st of a month, not a weekday guess.
      await expect(page.locator('#salary-paysheet tbody tr:first-child td:nth-child(2)'))
        .toContainText(' 1 ');

      // --- bonus lands on exactly one payday, and that row reconciles --------------------------
      await page.click('.sal-opt-chip[data-opt="bonus"]');
      await page.fill('#salary-bonus-amount', '10000');
      await page.selectOption('#salary-bonus-month', '11');
      await page.click('#salary-calc-button');
      await expect(page.locator('#salary-paysheet tr.is-bonus')).toHaveCount(1);

      const bonusCells = await page.locator('#salary-paysheet tr.is-bonus td').allTextContents();
      const [, , g, tax, ni, other, net] = bonusCells.map(parseNumericText);
      // Gross minus every listed deduction must equal the net shown, or the row looks broken.
      expect(g - tax - ni - other).toBeCloseTo(net, 1);
      await page.click('.sal-opt-chip[data-opt="bonus"]');

      // --- USA mode ---------------------------------------------------------------------------
      await page.click('.sal-mode-btn[data-value="us"]');
      await expect(usCard).toBeVisible();
      await expect(ukCard).toBeHidden();
      await expect(page.locator('#salary-state-row')).toBeVisible();
      await expect(page.locator('#salary-filing-row')).toBeVisible();

      // USA mode defaults to Texas rather than making the visitor pick a state first.
      await expect(page.locator('#salary-state')).toHaveValue('Texas');
      await expect(page.locator('#salary-calc-error')).toBeHidden();

      await page.fill('#salary-pay-amount', '100000');
      await page.click('#salary-calc-button');
      // 100,000 single in Texas: 13,170 federal + 7,650 FICA, no state tax => 79,180.
      expect(parseNumericText(await page.locator('#salary-annual-pay').textContent()))
        .toBeCloseTo(79180, 0);
      await expect(page.locator('#salary-local-note')).toBeVisible();

      // --- Canada mode --------------------------------------------------------------------------
      await page.click('.sal-mode-btn[data-value="canada"]');
      const caCard = page.locator('#salary-calculator-explanation .sal-ca-only').first();
      await expect(caCard).toBeVisible();
      await expect(ukCard).toBeHidden();
      await expect(usCard).toBeHidden();
      await expect(page.locator('#salary-province-row')).toBeVisible();

      // Canada mode defaults to Alberta rather than making the visitor pick a province first.
      await expect(page.locator('#salary-province')).toHaveValue('Alberta');
      await expect(page.locator('#salary-calc-error')).toBeHidden();

      await page.fill('#salary-pay-amount', '60000');
      await page.click('#salary-calc-button');
      // 60,000 in Alberta - pinned against ca-engine.js's own smoke-test output.
      expect(parseNumericText(await page.locator('#salary-annual-pay').textContent()))
        .toBeCloseTo(46471.05, 1);
      expect(await page.locator('#salary-annual-pay').textContent()).not.toContain('£');

      // Quebec must produce a different figure - QPP/QPIP/the federal abatement are not cosmetic.
      const albertaNet = parseNumericText(await page.locator('#salary-annual-pay').textContent());
      await page.fill('#salary-province', 'Quebec');
      await page.click('.sal-typeahead-item[data-code="QC"]');
      await page.click('#salary-calc-button');
      const quebecNet = parseNumericText(await page.locator('#salary-annual-pay').textContent());
      expect(quebecNet).not.toBeCloseTo(albertaNet, 1);
      expect(quebecNet).toBeCloseTo(44202.1, 1);
      await page.fill('#salary-province', 'Alberta');
      await page.click('.sal-typeahead-item[data-code="AB"]');

      // --- Gross Pay mode ---------------------------------------------------------------------
      await page.click('.sal-mode-btn[data-value="gross"]');
      await expect(grossCard).toBeVisible();
      await expect(ukCard).toBeHidden();
      await expect(usCard).toBeHidden();
      await expect(caCard).toBeHidden();
      // Pay sheet still there, degraded to date + gross only.
      await expect(page.locator('#salary-paysheet')).toBeVisible();
      await expect(page.locator('#salary-paysheet thead th:visible')).toHaveCount(3);
    },
  },
  'hourly-to-salary-calculator': {
    route: '/salary-calculators/hourly-to-salary-calculator/',
    h1: 'Hourly to Salary Calculator (Gross Pay)',
    title: 'Hourly to Salary Calculator (Gross Pay) | Annual, Monthly and Weekly Pay',
    description:
      'Estimate gross annual salary from an hourly rate, then see monthly, biweekly, and weekly pay using your hours per week and paid weeks per year.',
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
    h1: 'Salary to Hourly Calculator (Gross Pay)',
    title: 'Salary to Hourly Calculator (Gross Pay) | Hourly, Weekly and Monthly Pay',
    description:
      'Convert annual gross salary into hourly, weekly, biweekly, and monthly pay using your hours worked and paid weeks per year.',
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
    title: 'Annual to Monthly Salary Calculator | UK, US and Canada Take-Home Pay',
    description:
      'Convert annual salary into monthly pay, and see UK, US or Canada take-home pay after tax on that monthly figure. Free, and nothing is stored.',
    runE2E: async ({ page, expect, parseNumericText }) => {
      // No frequency picker on this page - the input is always an annual amount, and the hero is
      // always the monthly figure (the reverse of salary-calculator, which this was forked from).
      await expect(page.locator('[data-button-group="salary-pay-frequency"]')).toHaveCount(0);

      // --- Gross Pay mode (the default) --------------------------------------------------------
      await page.fill('#salary-pay-amount', '72000');
      await page.click('#salary-calc-button');
      expect(parseNumericText(await page.locator('#salary-annual-pay').textContent())).toBeCloseTo(6000, 2);
      expect(await page.locator('#salary-annual-pay').textContent()).not.toContain('£');

      // --- UK take-home mode ------------------------------------------------------------------
      await page.click('.sal-mode-btn[data-value="uk"]');
      await page.fill('#salary-pay-amount', '60000');
      await page.click('#salary-calc-button');
      expect(parseNumericText(await page.locator('#salary-annual-pay').textContent())).toBeCloseTo(3779.78, 1);

      // --- USA mode: defaults to Texas, no click-through-an-error needed -----------------------
      await page.click('.sal-mode-btn[data-value="us"]');
      await expect(page.locator('#salary-state')).toHaveValue('Texas');
      await page.fill('#salary-pay-amount', '60000');
      await page.click('#salary-calc-button');
      expect(parseNumericText(await page.locator('#salary-annual-pay').textContent())).toBeCloseTo(4199.17, 1);

      // --- Canada mode: defaults to Alberta, Quebec must differ --------------------------------
      await page.click('.sal-mode-btn[data-value="canada"]');
      await expect(page.locator('#salary-province')).toHaveValue('Alberta');
      await page.fill('#salary-pay-amount', '60000');
      await page.click('#salary-calc-button');
      expect(parseNumericText(await page.locator('#salary-annual-pay').textContent())).toBeCloseTo(3872.59, 1);
      expect(await page.locator('#salary-annual-pay').textContent()).not.toContain('£');

      const albertaMonthly = parseNumericText(await page.locator('#salary-annual-pay').textContent());
      await page.fill('#salary-province', 'Quebec');
      await page.click('.sal-typeahead-item[data-code="QC"]');
      await page.click('#salary-calc-button');
      const quebecMonthly = parseNumericText(await page.locator('#salary-annual-pay').textContent());
      expect(quebecMonthly).not.toBeCloseTo(albertaMonthly, 1);
      expect(quebecMonthly).toBeCloseTo(3683.51, 1);
    },
  },
  'monthly-to-annual-salary-calculator': {
    route: '/salary-calculators/monthly-to-annual-salary-calculator/',
    h1: 'Monthly to Annual Salary Calculator',
    title: 'Monthly to Annual Salary Calculator | UK, US and Canada Take-Home Pay',
    description:
      'Convert monthly salary into annual pay, and see UK, US or Canada take-home pay after tax on that annual figure. Free, and nothing is stored.',
    runE2E: async ({ page, expect, parseNumericText }) => {
      // No frequency picker - the input is always a monthly amount, and the hero is always the
      // annual figure (same hero behavior as salary-calculator, just with frequency locked).
      await expect(page.locator('[data-button-group="salary-pay-frequency"]')).toHaveCount(0);

      // --- Gross Pay mode (the default) --------------------------------------------------------
      await page.fill('#salary-pay-amount', '6000');
      await page.click('#salary-calc-button');
      expect(parseNumericText(await page.locator('#salary-annual-pay').textContent())).toBeCloseTo(72000, 2);
      expect(await page.locator('#salary-annual-pay').textContent()).not.toContain('£');

      // --- UK take-home mode ------------------------------------------------------------------
      await page.click('.sal-mode-btn[data-value="uk"]');
      await page.fill('#salary-pay-amount', '5000');
      await page.click('#salary-calc-button');
      expect(parseNumericText(await page.locator('#salary-annual-pay').textContent())).toBeCloseTo(45357.40, 1);

      // --- USA mode: defaults to Texas, no click-through-an-error needed -----------------------
      await page.click('.sal-mode-btn[data-value="us"]');
      await expect(page.locator('#salary-state')).toHaveValue('Texas');
      await page.fill('#salary-pay-amount', '5000');
      await page.click('#salary-calc-button');
      expect(parseNumericText(await page.locator('#salary-annual-pay').textContent())).toBeCloseTo(50390.00, 1);

      // --- Canada mode: defaults to Alberta, Quebec must differ --------------------------------
      await page.click('.sal-mode-btn[data-value="canada"]');
      await expect(page.locator('#salary-province')).toHaveValue('Alberta');
      await page.fill('#salary-pay-amount', '5000');
      await page.click('#salary-calc-button');
      expect(parseNumericText(await page.locator('#salary-annual-pay').textContent())).toBeCloseTo(46471.05, 1);
      expect(await page.locator('#salary-annual-pay').textContent()).not.toContain('£');

      const albertaNet = parseNumericText(await page.locator('#salary-annual-pay').textContent());
      await page.fill('#salary-province', 'Quebec');
      await page.click('.sal-typeahead-item[data-code="QC"]');
      await page.click('#salary-calc-button');
      const quebecNet = parseNumericText(await page.locator('#salary-annual-pay').textContent());
      expect(quebecNet).not.toBeCloseTo(albertaNet, 1);
      expect(quebecNet).toBeCloseTo(44202.10, 1);
    },
  },
  'weekly-pay-calculator': {
    route: '/salary-calculators/weekly-pay-calculator/',
    h1: 'Weekly Pay Calculator (Gross Pay)',
    title: 'Weekly Pay Calculator (Gross Pay) | Weekly Earnings and Annualized Pay',
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
    h1: 'Bonus Calculator (Gross Pay)',
    title: 'Bonus Calculator (Gross Pay) | Bonus Amount and Total Compensation',
    description:
      'Calculate your bonus as a percentage of salary or a flat amount, then see your total gross compensation before tax — useful for comparing a percentage bonus against a fixed payout or checking how a bonus changes your total pay for the period.',
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
