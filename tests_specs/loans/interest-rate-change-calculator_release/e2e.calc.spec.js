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

test.describe('Interest Rate Change calculator route contract', () => {
  test('RATE-CHANGE-E2E-1: single-pane route with slider inputs and timing toggle behavior', async ({ page }) => {
    await page.goto(CALCULATOR_URL);

    const centerPanels = page.locator('.center-column > .panel');
    await expect(centerPanels).toHaveCount(1);

    const panel = centerPanels.first();
    await expect(panel).toHaveClass(/panel-span-all/);
    await expect(panel.locator('#calc-interest-rate-change')).toBeVisible();
    await expect(panel.locator('#loan-rate-change-explanation')).toBeVisible();
    await expect(panel.locator('h3:has-text("Explanation")')).toHaveCount(0);

    await expect(page.locator('#rate-balance')).toHaveAttribute('type', 'range');
    await expect(page.locator('#rate-current')).toHaveAttribute('type', 'range');
    await expect(page.locator('#rate-new')).toHaveAttribute('type', 'range');
    await expect(page.locator('#rate-term')).toHaveAttribute('type', 'range');
    await expect(page.locator('#rate-change-months')).toHaveAttribute('type', 'range');

    await expect(page.locator('#rate-change-months-row')).toHaveClass(/is-hidden/);
    await page.click('[data-button-group="rate-change-timing"] button[data-value="after"]');
    await expect(page.locator('#rate-change-months-row')).not.toHaveClass(/is-hidden/);
    await page.click('[data-button-group="rate-change-timing"] button[data-value="immediate"]');
    await expect(page.locator('#rate-change-months-row')).toHaveClass(/is-hidden/);
  });

  test('RATE-CHANGE-E2E-2: calculation populates cards, summary, and yearly table by default', async ({ page }) => {
    await page.goto(CALCULATOR_URL);

    await setSliderValue(page, '#rate-balance', 350000);
    await setSliderValue(page, '#rate-current', 5.2);
    await setSliderValue(page, '#rate-new', 6.4);
    await setSliderValue(page, '#rate-term', 28);

    await page.click('[data-button-group="rate-change-timing"] button[data-value="after"]');
    await setSliderValue(page, '#rate-change-months', 18);

    await runCalculation(page);

    await expect(page.locator('#rate-result')).toContainText('New Monthly Payment');
    await expect(page.locator('#rate-summary')).toContainText('Monthly difference');
    await expect(page.locator('[data-rate="snap-current-payment"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-rate="snap-new-payment"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-rate="snap-interest-change"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-rate="snap-timing"]')).toContainText('After');

    await expect(page.locator('#rate-table-monthly-wrap')).toHaveClass(/is-hidden/);
    await expect(page.locator('#rate-table-yearly-wrap')).not.toHaveClass(/is-hidden/);
    expect(await page.locator('#rate-table-yearly-body tr').count()).toBeGreaterThan(0);

    await expect(page.locator('#rate-result')).not.toContainText(/[£$€₹¥]/);
    await expect(page.locator('#rate-summary')).not.toContainText(/[£$€₹¥]/);
    await expect(page.locator('#loan-rate-change-explanation')).not.toContainText(/[£$€₹¥]/);
  });

  test('RATE-CHANGE-E2E-3: monthly/yearly table toggle, sticky headers, FAQ count, and no overflow', async ({ page }) => {
    await page.goto(CALCULATOR_URL);
    await runCalculation(page);

    await expect(page.locator('#rate-table-yearly-wrap')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#rate-table-monthly-wrap')).toHaveClass(/is-hidden/);

    await page.click('#rate-view-monthly');
    await expect(page.locator('#rate-table-monthly-wrap')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#rate-table-yearly-wrap')).toHaveClass(/is-hidden/);
    expect(await page.locator('#rate-table-monthly-body tr').count()).toBeGreaterThan(0);

    const stickyHeader = page.locator('#rate-table-monthly thead th').first();
    await expect(stickyHeader).toHaveCSS('position', 'sticky');
    await expect(stickyHeader).toHaveCSS('top', '0px');

    await expect(page.locator('#loan-rate-change-explanation .bor-faq-card')).toHaveCount(10);

    const hasDesktopOverflow = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth > root.clientWidth;
    });
    expect(hasDesktopOverflow).toBe(false);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(250);

    const hasMobileOverflow = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth > root.clientWidth;
    });
    expect(hasMobileOverflow).toBe(false);
  });
});
