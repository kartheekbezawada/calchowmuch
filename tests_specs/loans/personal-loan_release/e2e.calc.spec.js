import { expect, test } from '@playwright/test';

const CALCULATOR_URL = '/loan-calculators/personal-loan-calculator/';

async function setSliderValue(page, selector, value) {
  await page.locator(selector).evaluate((element, nextValue) => {
    element.value = String(nextValue);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function setTextFieldValue(page, selector, value) {
  const field = page.locator(selector);
  await field.fill(String(value));
  await field.blur();
}

async function openAdvancedOptions(page) {
  const advancedOptions = page.locator('#calc-personal-loan details.advanced-options');
  const isOpen = await advancedOptions.evaluate((element) => element.open);
  if (!isOpen) {
    await advancedOptions.locator('summary').click();
  }
  await expect(page.locator('#pl-extra-monthly')).toBeVisible();
}

async function runCalculation(page) {
  await page.click('#pl-calculate');
  await page.waitForTimeout(150);
}

test.describe('Personal Loan calculator route contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CALCULATOR_URL);
    await expect(page.locator('.hl-cluster-panel')).toBeVisible();
    await expect(page.locator('#calc-personal-loan')).toBeVisible();
  });

  test('PL-E2E-1: single-pane route with merged calculator and explanation', async ({ page }) => {
    const panel = page.locator('.hl-cluster-panel');
    await expect(panel).toHaveCount(1);
    await expect(panel.locator('#calc-personal-loan')).toBeVisible();
    await expect(panel.locator('#loan-personal-explanation')).toBeVisible();
    await expect(panel.locator('h3:has-text("Explanation")')).toHaveCount(0);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('link[href*="theme-premium-dark.css"]')).toHaveCount(0);

    const overflow = await page.evaluate(() => {
      const panelNode = document.querySelector('.hl-cluster-panel');
      return {
        root: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        panel: panelNode ? panelNode.scrollWidth - panelNode.clientWidth : 0,
      };
    });

    expect(overflow.root).toBeLessThanOrEqual(1);
    expect(overflow.panel).toBeLessThanOrEqual(1);

    await expect(page.locator('#pl-principal-field')).toHaveValue('25000');
    await expect(page.locator('#pl-rate-field')).toHaveValue('9.5');
    await expect(page.locator('#pl-term-years-field')).toHaveValue('5');
  });

  test('PL-E2E-2: calculate and reset flow updates key metrics', async ({ page }) => {
    await setSliderValue(page, '#pl-principal', 32000);
    await setSliderValue(page, '#pl-rate', 11.2);
    await setSliderValue(page, '#pl-term-years', 6);
    await openAdvancedOptions(page);
    await page.fill('#pl-setup-fee', '199');
    await page.fill('#pl-extra-monthly', '80');
    await runCalculation(page);

    await expect(page.locator('[data-pl="result-base"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-pl="result-total-interest"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-pl="result-payoff"]')).toContainText(/[0-9]/);

    await page.click('#pl-reset');
    await expect(page.locator('#pl-principal')).toHaveValue('25000');
    await expect(page.locator('#pl-principal-field')).toHaveValue('25000');
    await expect(page.locator('#pl-rate-field')).toHaveValue('9.5');
    await expect(page.locator('#pl-term-years-field')).toHaveValue('5');
    await expect(page.locator('#pl-extra-monthly')).toHaveValue('0');
  });

  test('PL-E2E-2A: exact-value fields sync without pre-click recalculation', async ({ page }) => {
    const beforeText = await page.locator('[data-pl="result-base"]').innerText();

    await setTextFieldValue(page, '#pl-principal-field', '32000');
    await expect(page.locator('#pl-principal')).toHaveValue('32000');

    const afterEditText = await page.locator('[data-pl="result-base"]').innerText();
    expect(afterEditText.trim()).toBe(beforeText.trim());

    await runCalculation(page);

    const afterCalcText = await page.locator('[data-pl="result-base"]').innerText();
    expect(afterCalcText.trim()).not.toBe(beforeText.trim());
  });

  test('PL-E2E-3: currency selector switches displayed symbols', async ({ page }) => {
    await page.selectOption('#pl-currency', 'GBP');
    await runCalculation(page);
    await expect(page.locator('[data-pl="result-base"]')).toContainText('£');

    await page.selectOption('#pl-currency', 'USD');
    await runCalculation(page);
    await expect(page.locator('[data-pl="result-base"]')).toContainText('$');
  });

  test('PL-E2E-4: chart and table render after calculation', async ({ page }) => {
    await runCalculation(page);

    await expect(page.locator('.pl-chart-legend .pl-legend-item')).toHaveCount(2);

    const tableRowsYearly = page.locator('#pl-amortization-body tr');
    const yearlyCount = await tableRowsYearly.count();
    expect(yearlyCount).toBeGreaterThan(0);
    expect(yearlyCount).toBeLessThanOrEqual(5);
    await expect(page.locator('[data-pl-col="period"]')).toHaveText('Year');

    const chartReady = await page.locator('#pl-balance-status').innerText();
    expect(chartReady.toLowerCase()).toContain('hover');

    const canvasSize = await page.locator('#pl-balance-canvas').evaluate((el) => ({
      w: el.clientWidth,
      h: el.clientHeight,
    }));
    expect(canvasSize.w).toBeGreaterThan(100);
    expect(canvasSize.h).toBeGreaterThan(100);

    await page.click('.pl-view-toggle[data-pl-view="monthly"]');
    await expect(page.locator('[data-pl-col="period"]')).toHaveText('Month');
    const monthlyCount = await page.locator('#pl-amortization-body tr').count();
    expect(monthlyCount).toBeGreaterThan(5);
    expect(monthlyCount).toBeLessThanOrEqual(60);

    const wrapOverflow = await page.locator('.pl-table-wrap').evaluate((el) => ({
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
    }));
    expect(wrapOverflow.scrollHeight).toBeGreaterThan(wrapOverflow.clientHeight);
  });

  test('PL-E2E-5: invalid extra payment shows inline validation', async ({ page }) => {
    await openAdvancedOptions(page);
    await page.fill('#pl-extra-monthly', '9999999');
    await runCalculation(page);

    await expect(page.locator('#pl-error')).toContainText('negative first-month balance');
  });

  test('PL-E2E-6: explanation FAQ has 10 cards', async ({ page }) => {
    await expect(page.locator('#pl-section-faq .bor-faq-card')).toHaveCount(10);
  });

  test('PL-E2E-7: advanced options disclosure uses compact optional pattern', async ({ page }) => {
    const summary = page.locator('#calc-personal-loan details.advanced-options summary');
    await expect(summary.locator('.advanced-summary-title')).toHaveText('Advanced Options');
    await expect(summary.locator('.advanced-summary-subtitle')).toHaveText('Optional');
    await expect(summary.locator('.advanced-caret')).toBeVisible();
  });

  test('PL-E2E-8: mobile calculate reveals the payment summary', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#pl-calculate').scrollIntoViewIfNeeded();
    await runCalculation(page);
    await page.waitForTimeout(350);

    const resultBox = await page.locator('#pl-results').boundingBox();
    expect(resultBox).toBeTruthy();
    expect(resultBox.y).toBeLessThan(220);

    await expect(page.locator('#pl-result')).toBeFocused();
  });
});
