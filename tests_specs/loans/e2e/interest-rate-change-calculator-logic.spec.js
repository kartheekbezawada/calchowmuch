import { test, expect } from '@playwright/test';

const CALCULATOR_URL = '/loans/interest-rate-change-calculator/';

async function setSliderValue(page, selector, value) {
  await page.locator(selector).evaluate((element, nextValue) => {
    element.value = String(nextValue);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function runCalculation(page) {
  await page.click('#rate-calculate');
  await page.waitForFunction(() => {
    const valueNode = document.querySelector('#rate-result .mtg-result-value');
    return valueNode && valueNode.textContent.trim() !== '';
  });
}

test.describe('Interest Rate Change calculator implementation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CALCULATOR_URL);
    await page.waitForLoadState('networkidle');
  });

  test('RATE-CHANGE-CALC-1: slider badges update live as inputs change', async ({ page }) => {
    await setSliderValue(page, '#rate-balance', 410000);
    await setSliderValue(page, '#rate-current', 4.7);
    await setSliderValue(page, '#rate-new', 6.1);
    await setSliderValue(page, '#rate-term', 30);

    await expect(page.locator('#rate-balance-display')).toContainText(/410,?000/);
    await expect(page.locator('#rate-current-display')).toContainText('4.7%');
    await expect(page.locator('#rate-new-display')).toContainText('6.1%');
    await expect(page.locator('#rate-term-display')).toContainText('30 yrs');
  });

  test('RATE-CHANGE-CALC-2: after-months slider reveals and display updates with timing toggle', async ({ page }) => {
    await expect(page.locator('#rate-change-months-row')).toHaveClass(/is-hidden/);

    await page.click('[data-button-group="rate-change-timing"] button[data-value="after"]');
    await expect(page.locator('#rate-change-months-row')).not.toHaveClass(/is-hidden/);

    await setSliderValue(page, '#rate-change-months', 24);
    await expect(page.locator('#rate-change-months-display')).toContainText('24 mo');
  });

  test('RATE-CHANGE-CALC-3: calculate fills snapshot and explanation lifetime totals', async ({ page }) => {
    await setSliderValue(page, '#rate-balance', 300000);
    await setSliderValue(page, '#rate-current', 4.8);
    await setSliderValue(page, '#rate-new', 6.0);
    await setSliderValue(page, '#rate-term', 26);

    await runCalculation(page);

    await expect(page.locator('#rate-result')).toContainText('New Monthly Payment');
    await expect(page.locator('#rate-summary')).toContainText('Total interest change');

    await expect(page.locator('[data-rate="snap-current-payment"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-rate="snap-annual-diff"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-rate="lt-baseline-interest"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-rate="lt-new-interest"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-rate="lt-interest-change"]')).toContainText(/[0-9]/);

    const donutShare = await page.locator('[data-rate="lifetime-donut"]').evaluate((element) =>
      element.style.getPropertyValue('--principal-share')
    );
    expect(donutShare).toContain('%');
  });

  test('RATE-CHANGE-CALC-4: table views both render rows and toggle visibility', async ({ page }) => {
    await runCalculation(page);

    await expect(page.locator('#rate-table-yearly-wrap')).not.toHaveClass(/is-hidden/);
    expect(await page.locator('#rate-table-yearly-body tr').count()).toBeGreaterThan(0);

    await page.click('#rate-view-monthly');
    await expect(page.locator('#rate-table-monthly-wrap')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#rate-table-yearly-wrap')).toHaveClass(/is-hidden/);
    expect(await page.locator('#rate-table-monthly-body tr').count()).toBeGreaterThan(0);
  });

  test('RATE-CHANGE-CALC-5: FAQ count and layout stability on mobile', async ({ page }) => {
    await expect(page.locator('#loan-rate-change-explanation .bor-faq-card')).toHaveCount(10);

    const panel = page.locator('.center-column > .panel').first();
    expect(await panel.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(false);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(250);
    expect(await panel.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(false);
  });
});
