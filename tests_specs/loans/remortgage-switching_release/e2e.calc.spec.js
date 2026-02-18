import { test, expect } from '@playwright/test';

const CALCULATOR_URL = '/loans/remortgage-switching/';

async function setNumberValue(page, selector, value) {
  await page.locator(selector).evaluate((element, nextValue) => {
    element.value = String(nextValue);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function setSliderValue(page, selector, value) {
  await page.locator(selector).evaluate((element, nextValue) => {
    element.value = String(nextValue);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function fillStandardInputs(page) {
  await setNumberValue(page, '#remo-balance', 220000);
  await setNumberValue(page, '#remo-current-rate', 6);
  await setNumberValue(page, '#remo-term', 20);
  await setNumberValue(page, '#remo-new-rate', 4.95);
  await setNumberValue(page, '#remo-new-term', 20);
  await setSliderValue(page, '#remo-horizon-years', 5);
}

async function runCalculation(page) {
  await page.click('#remo-calculate');
  await page.waitForFunction(() => {
    const monthly = document.querySelector('#remo-metric-monthly');
    return monthly && monthly.textContent.trim() !== '' && monthly.textContent.trim() !== '--';
  });
}

test.describe('Remortgage / Switching Hybrid Requirements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CALCULATOR_URL);
    await page.waitForLoadState('networkidle');
  });

  test('REMO-HYBRID-1: renders as single pane without Explanation heading', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    const centerPanels = page.locator('.center-column > .panel');

    await expect(centerPanels).toHaveCount(1);
    await expect(centerPanels.first()).toHaveClass(/panel-span-all/);

    const singlePanel = centerPanels.first();
    await expect(singlePanel.locator('#calc-remortgage-switching')).toBeVisible();
    await expect(singlePanel.locator('#loan-remortgage-explanation')).toBeVisible();
    await expect(singlePanel.locator('h3:has-text("Explanation")')).toHaveCount(0);

    const calcPanel = singlePanel.locator('#calc-remortgage-switching');
    await expect(calcPanel.locator('.remo-ui > .helper')).toHaveCount(0);
    await expect(calcPanel.locator('.remo-form-panel .helper')).toHaveCount(0);
    await expect(calcPanel.locator('.remo-form-panel .remo-group-label', { hasText: 'New Deal' })).toHaveCount(0);
    await expect(calcPanel.locator('.remo-form-panel .remo-group-label', { hasText: 'Comparison Horizon' })).toHaveCount(0);

    await expect(page.locator('#remo-table-monthly-wrap')).toHaveClass(/is-hidden/);
    await expect(page.locator('#remo-table-yearly-wrap')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#remo-table-yearly-body tr')).toHaveCount(5);
    await expect(page.locator('#remo-metric-monthly')).toContainText(/[0-9]/);
    await expect(page.locator('#remo-metric-total')).toContainText(/[0-9]/);
  });

  test('REMO-HYBRID-2: removes Additional Fees and uses horizon slider with yearly ticks', async ({ page }) => {
    await expect(page.locator('[data-button-group="remo-fees-toggle"]')).toHaveCount(0);
    await expect(page.locator('#remo-fees-options')).toHaveCount(0);
    await expect(page.locator('#remo-new-fees')).toHaveCount(0);
    await expect(page.locator('#remo-exit-fees')).toHaveCount(0);
    await expect(page.locator('#remo-legal-fees')).toHaveCount(0);

    const horizon = page.locator('#remo-horizon-years');
    await expect(horizon).toHaveAttribute('min', '2');
    await expect(horizon).toHaveAttribute('max', '10');
    await expect(horizon).toHaveAttribute('step', '1');

    await expect(page.locator('.remo-horizon-tick-row span')).toHaveCount(9);
    await expect(page.locator('#remo-horizon-display')).toHaveText(/5 years/i);
  });

  test('REMO-HYBRID-3: calculates and fills all snapshot metrics', async ({ page }) => {
    await fillStandardInputs(page);
    await runCalculation(page);

    await expect(page.locator('#remo-metric-monthly')).toContainText(/[0-9]/);
    await expect(page.locator('#remo-metric-annual')).toContainText(/[0-9]/);
    await expect(page.locator('#remo-metric-break-even')).toContainText(/Month|Not within horizon/);
    await expect(page.locator('#remo-metric-total')).toContainText(/[0-9]/);
    await expect(page.locator('#remo-exp-summary')).toContainText(/Over 5 years/);
  });

  test('REMO-HYBRID-4: output text and table values contain no currency symbols', async ({ page }) => {
    await fillStandardInputs(page);
    await runCalculation(page);

    const metricMonthly = await page.locator('#remo-metric-monthly').innerText();
    const metricAnnual = await page.locator('#remo-metric-annual').innerText();
    const metricTotal = await page.locator('#remo-metric-total').innerText();

    expect(metricMonthly).not.toMatch(/[£$€₹¥]/);
    expect(metricAnnual).not.toMatch(/[£$€₹¥]/);
    expect(metricTotal).not.toMatch(/[£$€₹¥]/);

    const firstTableRow = page.locator('#remo-table-monthly-body tr').first();
    await expect(firstTableRow).toContainText(/[0-9]/);
    expect(await firstTableRow.innerText()).not.toMatch(/[£$€₹¥]/);
  });

  test('REMO-HYBRID-5: horizon slider updates display and monthly row count', async ({ page }) => {
    await fillStandardInputs(page);

    await setSliderValue(page, '#remo-horizon-years', 2);
    await expect(page.locator('#remo-horizon-display')).toHaveText(/2 years/i);
    await runCalculation(page);
    const rowsAtTwoYears = await page.locator('#remo-table-monthly-body tr').count();
    expect(rowsAtTwoYears).toBe(24);

    await setSliderValue(page, '#remo-horizon-years', 10);
    await expect(page.locator('#remo-horizon-display')).toHaveText(/10 years/i);
    await runCalculation(page);
    const rowsAtTenYears = await page.locator('#remo-table-monthly-body tr').count();
    expect(rowsAtTenYears).toBe(120);
  });

  test('REMO-HYBRID-6: table toggle switches monthly and yearly views', async ({ page }) => {
    await fillStandardInputs(page);
    await setSliderValue(page, '#remo-horizon-years', 5);
    await runCalculation(page);

    await expect(page.locator('#remo-table-monthly-wrap')).toHaveClass(/is-hidden/);
    await expect(page.locator('#remo-table-yearly-wrap')).not.toHaveClass(/is-hidden/);
    expect(await page.locator('#remo-table-yearly-body tr').count()).toBe(5);

    await page.click('#remo-view-monthly');
    await expect(page.locator('#remo-table-monthly-wrap')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#remo-table-yearly-wrap')).toHaveClass(/is-hidden/);
  });

  test('REMO-HYBRID-7: validation rejects invalid values with errors', async ({ page }) => {
    await setNumberValue(page, '#remo-balance', 0);
    await page.click('#remo-calculate');
    await expect(page.locator('#remo-error')).toContainText('greater than 0');

    await setNumberValue(page, '#remo-balance', 220000);
    await setNumberValue(page, '#remo-new-term', 0);
    await page.click('#remo-calculate');
    await expect(page.locator('#remo-error')).toContainText('at least 1 year');
  });

  test('REMO-HYBRID-8: FAQ section has 10 Signal Arc style cards', async ({ page }) => {
    const faqCards = page.locator('#loan-remortgage-explanation .remo-faq-card');
    await expect(faqCards).toHaveCount(10);

    await expect(page.locator('.remo-faq-number').first()).toHaveText('01');
    await expect(page.locator('.remo-faq-number').last()).toHaveText('10');
  });

  test('REMO-HYBRID-9: heading is centered and layout has no horizontal overflow', async ({ page }) => {
    const titleAlign = await page.locator('#calculator-title').evaluate((el) => getComputedStyle(el).textAlign);
    expect(titleAlign).toBe('center');

    const panel = page.locator('.center-column > .panel').first();
    expect(await panel.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(false);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(250);
    expect(await panel.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(false);
  });

  test('REMO-HYBRID-10: layout remains stable after calculate and table view switching', async ({ page }) => {
    const initialBox = await page.locator('#calc-remortgage-switching').boundingBox();

    await fillStandardInputs(page);
    await runCalculation(page);

    const afterCalcBox = await page.locator('#calc-remortgage-switching').boundingBox();
    expect(afterCalcBox?.width).toBe(initialBox?.width);

    await page.click('#remo-view-yearly');
    const afterToggleBox = await page.locator('#calc-remortgage-switching').boundingBox();
    expect(afterToggleBox?.width).toBe(initialBox?.width);
  });
});

test.describe('Remortgage / Switching Hybrid', () => {
  test('ISS-REMORT-HYBRID: single-pane ownership and interaction contract', async ({ page }) => {
    await page.goto('/loans/remortgage-switching');

    const centerPanels = page.locator('.center-column > .panel');
    await expect(centerPanels).toHaveCount(1);

    const panel = centerPanels.first();
    await expect(panel).toHaveClass(/panel-span-all/);
    await expect(panel.locator('#calc-remortgage-switching')).toBeVisible();
    await expect(panel.locator('#loan-remortgage-explanation')).toBeVisible();

    // Explanation heading is removed in single-pane generation.
    await expect(panel.locator('h3:has-text("Explanation")')).toHaveCount(0);

    // Fees UI removed.
    await expect(page.locator('[data-button-group="remo-fees-toggle"]')).toHaveCount(0);
    await expect(page.locator('#remo-new-fees')).toHaveCount(0);
    await expect(page.locator('#remo-exit-fees')).toHaveCount(0);
    await expect(page.locator('#remo-legal-fees')).toHaveCount(0);

    // Horizon slider contract.
    const horizon = page.locator('#remo-horizon-years');
    await expect(horizon).toHaveAttribute('min', '2');
    await expect(horizon).toHaveAttribute('max', '10');
    await expect(horizon).toHaveAttribute('step', '1');
    await expect(page.locator('.remo-horizon-tick-row span')).toHaveCount(9);

    // Defaults should render immediately (yearly is default).
    await expect(page.locator('#remo-metric-total')).toContainText(/[0-9]/);
    await expect(page.locator('#remo-table-monthly-wrap')).toHaveClass(/is-hidden/);
    await expect(page.locator('#remo-table-yearly-wrap')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#remo-table-yearly-body tr')).toHaveCount(5);

    // Explicit calculate remains available and stable.
    await page.locator('#remo-calculate').click();
    await page.waitForFunction(() => {
      const metric = document.querySelector('#remo-metric-monthly');
      return metric && metric.textContent.trim() !== '' && metric.textContent.trim() !== '--';
    });

    // View toggle switches wrapped tables.
    await page.locator('#remo-view-monthly').click();
    await expect(page.locator('#remo-table-monthly-wrap')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#remo-table-yearly-wrap')).toHaveClass(/is-hidden/);
    await expect(page.locator('#remo-table-monthly-body tr')).toHaveCount(60);

    // FAQ contract (10 cards).
    await expect(page.locator('#loan-remortgage-explanation .remo-faq-card')).toHaveCount(10);

    // Currency symbol prohibition.
    await expect(page.locator('#loan-remortgage-explanation')).not.toContainText(/[£$€₹¥]/);
  });
});
