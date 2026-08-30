export const SALARY_HUB_ROUTE = '/salary-calculators/';
export const SALARY_HUB_TITLE =
  'Salary Calculators | Take-Home Pay, Overtime, Raise & Bonus';
export const SALARY_HUB_DESCRIPTION =
  'Four calculators for what you earn: take-home pay after tax in the UK, US and Canada (with pay converted between periods), plus overtime, raise and bonus tools.';

export const SALARY_CALCULATOR_CONFIGS = {
  'salary-calculator': {
    route: '/salary-calculators/salary-calculator/',
    h1: 'Salary Calculator',
    title: 'Salary Calculator | UK, US and Canada Take-Home Pay Calculator',
    description:
      'Work out your take-home pay after tax in the UK, the US or Canada, with a full deductions breakdown and pay-date sheet. Free, and nothing is stored.',
    runE2E: async ({ page, expect, parseNumericText }) => {
      // --- baseline: opens on Annual 100,000, calculation gated behind the button --------------
      await expect(page.locator('button[data-value="annual"]')).toHaveAttribute('aria-pressed', 'true');
      expect(parseNumericText(await page.locator('#salary-annual-pay').textContent())).toBeCloseTo(100000, 2);
      await expect(page.locator('#salary-summary-panel')).toBeVisible();
      await expect(page.locator('#salary-summary-panel .sal-summary-figure')).toContainText('100,000');
      await expect(page.locator('#salary-dirty-chip')).toHaveCount(0);
      await expect(page.locator('.sal-answer-top #salary-copy-summary')).toBeVisible();

      // Editing the salary without pressing Calculate must not move the figure.
      await page.fill('#salary-pay-amount', '55000');
      expect(parseNumericText(await page.locator('#salary-annual-pay').textContent())).toBeCloseTo(100000, 2);
      await expect(page.locator('#salary-stale-hint')).toBeVisible();
      await page.click('#salary-calc-button');
      expect(parseNumericText(await page.locator('#salary-annual-pay').textContent())).toBeCloseTo(55000, 2);
      await expect(page.locator('#salary-stale-hint')).toBeHidden();

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
      await expect(page.locator('#salary-answer-context')).toContainText('source hourly gross salary');
      await expect(page.locator('#salary-fourweekly-pay')).toBeVisible();

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
      await page.click('#salary-calc-button');

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

      // --- Deductions section is visible and itemised (spec §62) ------------------------------
      await expect(page.locator('#salary-deductions')).toBeVisible();
      const deductionLabels = await page
        .locator('#salary-deductions .sal-deduction-row span:first-child')
        .allTextContents();
      expect(deductionLabels).toContain('Income Tax');
      expect(deductionLabels).toContain('National Insurance');

      // --- Optional Extra Payments: an overtime block raises gross and take-home (spec §63-§64) -
      const netBefore = parseNumericText(await page.locator('#salary-annual-pay').textContent());
      await page.click('.sal-opt-chip[data-opt="overtime"]');
      await page.selectOption('#salary-ot-method', 'hourly');
      await page.fill('#salary-ot-rate', '30');
      await page.fill('#salary-ot-hours', '10');
      await page.selectOption('#salary-ot-frequency', 'monthly');
      await page.click('#salary-calc-button');
      const netAfter = parseNumericText(await page.locator('#salary-annual-pay').textContent());
      expect(netAfter).toBeGreaterThan(netBefore);
      await page.click('.sal-opt-chip[data-opt="overtime"]');

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
    title: 'Raise Calculator | New Salary, Raise Percentage and Value After Inflation',
    description:
      'Work out your new salary after a raise, compare a percentage raise with a flat amount, and check whether the increase actually beats inflation in real terms.',
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
};

export const SALARY_CALCULATOR_IDS = Object.keys(SALARY_CALCULATOR_CONFIGS);
