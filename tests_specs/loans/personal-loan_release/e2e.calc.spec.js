import { expect, test } from '@playwright/test';

const CALCULATOR_URL = '/loan-calculators/personal-loan-calculator/';

async function setSliderValue(page, selector, value) {
  await page.locator(selector).evaluate((element, nextValue) => {
    element.value = String(nextValue);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function openAdvancedOptions(page) {
  const advancedOptions = page.locator('#calc-personal-loan details.advanced-options');
  const isOpen = await advancedOptions.evaluate((element) => element.open);
  if (!isOpen) {
    await advancedOptions.locator('summary').click();
  }
  await expect(page.locator('#pl-extra-monthly')).toBeVisible();
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
  });

  test('PL-E2E-2: calculate and reset flow updates key metrics', async ({ page }) => {
    await setSliderValue(page, '#pl-principal', 32000);
    await setSliderValue(page, '#pl-rate', 11.2);
    await setSliderValue(page, '#pl-term-years', 6);
    await openAdvancedOptions(page);
    await page.fill('#pl-setup-fee', '199');
    await page.fill('#pl-extra-monthly', '80');
    await page.click('#pl-calculate');

    await expect(page.locator('[data-pl="result-base"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-pl="result-total-interest"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-pl="result-payoff"]')).toContainText(/[0-9]/);

    await page.click('#pl-reset');
    await expect(page.locator('#pl-principal')).toHaveValue('25000');
    await expect(page.locator('#pl-extra-monthly')).toHaveValue('0');
  });

  test('PL-E2E-3: currency selector switches displayed symbols', async ({ page }) => {
    await page.selectOption('#pl-currency', 'GBP');
    await page.click('#pl-calculate');
    await expect(page.locator('[data-pl="result-base"]')).toContainText('£');

    await page.selectOption('#pl-currency', 'USD');
    await page.click('#pl-calculate');
    await expect(page.locator('[data-pl="result-base"]')).toContainText('$');
  });

  test('PL-E2E-4: chart and table render after calculation', async ({ page }) => {
    await page.click('#pl-calculate');

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
    await page.click('#pl-calculate');

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
});
