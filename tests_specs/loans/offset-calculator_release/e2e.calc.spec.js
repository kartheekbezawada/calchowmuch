import { test, expect } from '@playwright/test';

const CALCULATOR_URL = '/loan-calculators/offset-mortgage-calculator/';

async function setSliderValue(page, selector, value) {
  await page.locator(selector).evaluate((element, nextValue) => {
    element.value = String(nextValue);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function fillStandardInputs(page) {
  await setSliderValue(page, '#off-balance', 320000);
  await setSliderValue(page, '#off-rate', 5.8);
  await setSliderValue(page, '#off-term', 28);
  await setSliderValue(page, '#off-savings', 45000);
  await setSliderValue(page, '#off-contribution', 300);
}

async function runCalculation(page) {
  await page.click('#off-calculate');
  await page.waitForFunction(() => {
    const value = document.querySelector('#off-result .mtg-result-value');
    return value && value.textContent.trim() !== '';
  });
}

function parseNumber(text) {
  const value = Number(String(text).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(value) ? value : 0;
}

test.describe('Offset Calculator Home-Loan Visual Standard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CALCULATOR_URL);
    await expect(page.locator('.hl-cluster-panel')).toHaveCount(1);
    await expect(page.locator('#calc-offset-calculator')).toBeVisible();
  });

  test('OFFSET-HYBRID-1: renders as single pane without shell Explanation heading', async ({ page }) => {
    const centerPanels = page.locator('.hl-cluster-panel');

    await expect(centerPanels).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);

    const panel = centerPanels.first();
    await expect(panel.locator('#calc-offset-calculator')).toBeVisible();
    await expect(panel.locator('#loan-offset-explanation')).toBeVisible();
    await expect(panel.locator('h3:has-text("Explanation")')).toHaveCount(0);
  });

  test('OFFSET-HYBRID-2: slider displays update live and mode toggle remains available', async ({ page }) => {
    await setSliderValue(page, '#off-balance', 350000);
    await setSliderValue(page, '#off-rate', 6.2);
    await setSliderValue(page, '#off-term', 30);
    await setSliderValue(page, '#off-savings', 60000);
    await setSliderValue(page, '#off-contribution', 450);

    await expect(page.locator('#off-balance-display')).toContainText(/350,?000/);
    await expect(page.locator('#off-rate-display')).toContainText('6.2%');
    await expect(page.locator('#off-term-display')).toContainText('30 yrs');
    await expect(page.locator('#off-savings-display')).toContainText(/60,?000/);
    await expect(page.locator('#off-contribution-display')).toContainText(/450/);

    await expect(page.locator('[data-button-group="off-mode"] button[data-value="full"]')).toBeVisible();
    await expect(page.locator('[data-button-group="off-mode"] button[data-value="partial"]')).toBeVisible();
  });

  test('OFFSET-HYBRID-3: calculate populates result, summary, and snapshot values', async ({ page }) => {
    await fillStandardInputs(page);
    await runCalculation(page);

    await expect(page.locator('#off-result')).toContainText('Monthly Payment');
    await expect(page.locator('#off-result .mtg-result-value')).toContainText(/[0-9]/);
    await expect(page.locator('#off-summary')).toContainText('Interest saved');

    await expect(page.locator('[data-off="balance"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-off="effective-balance"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-off="payment"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-off="interest-saved-preview"]')).toContainText(/[0-9]/);
  });

  test('OFFSET-HYBRID-4: partial mode changes effective balance relative to full mode', async ({ page }) => {
    await setSliderValue(page, '#off-balance', 300000);
    await setSliderValue(page, '#off-savings', 40000);
    await setSliderValue(page, '#off-contribution', 200);
    await runCalculation(page);

    const fullEffective = parseNumber(await page.locator('[data-off="effective-balance"]').innerText());

    await page.click('[data-button-group="off-mode"] button[data-value="partial"]');
    await page.waitForTimeout(100);

    const partialEffective = parseNumber(await page.locator('[data-off="effective-balance"]').innerText());
    expect(partialEffective).toBeGreaterThan(fullEffective);
  });

  test('OFFSET-HYBRID-5: donut and lifetime totals populate from offset data', async ({ page }) => {
    await fillStandardInputs(page);
    await runCalculation(page);

    const donutShare = await page.locator('[data-off="lifetime-donut"]').evaluate((el) =>
      el.style.getPropertyValue('--principal-share')
    );
    expect(donutShare).toContain('%');

    await expect(page.locator('[data-off="interest-saved-share"]')).toContainText('%');
    await expect(page.locator('[data-off="interest-remaining-share"]')).toContainText('%');
    await expect(page.locator('[data-off="interest-base"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-off="interest-offset"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-off="interest-saved"]')).toContainText(/[0-9]/);
  });

  test('OFFSET-HYBRID-6: monthly/yearly table toggle works and headers are sticky', async ({ page }) => {
    await fillStandardInputs(page);
    await runCalculation(page);

    await expect(page.locator('#off-table-monthly-wrap')).toHaveClass(/is-hidden/);
    await expect(page.locator('#off-table-yearly-wrap')).not.toHaveClass(/is-hidden/);
    expect(await page.locator('#off-table-yearly-body tr').count()).toBeGreaterThan(0);

    await page.click('#off-view-monthly');
    await expect(page.locator('#off-table-monthly-wrap')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#off-table-yearly-wrap')).toHaveClass(/is-hidden/);
    expect(await page.locator('#off-table-monthly-body tr').count()).toBeGreaterThan(0);

    const stickyHeader = page.locator('#off-table-monthly thead th').first();
    await expect(stickyHeader).toHaveCSS('position', 'sticky');
    await expect(stickyHeader).toHaveCSS('top', '0px');
  });

  test('OFFSET-HYBRID-7: FAQ section contains 10 cards', async ({ page }) => {
    await expect(page.locator('#loan-offset-explanation .bor-faq-card')).toHaveCount(10);
    await expect(page.locator('#loan-offset-explanation .bor-faq-number').first()).toHaveText('01');
    await expect(page.locator('#loan-offset-explanation .bor-faq-number').last()).toHaveText('10');
  });

  test('OFFSET-HYBRID-8: output text excludes currency symbols', async ({ page }) => {
    await fillStandardInputs(page);
    await runCalculation(page);

    await expect(page.locator('#off-result')).not.toContainText(/[£$€₹¥]/);
    await expect(page.locator('#off-summary')).not.toContainText(/[£$€₹¥]/);
    await expect(page.locator('#loan-offset-explanation')).not.toContainText(/[£$€₹¥]/);
  });

  test('OFFSET-HYBRID-9: no horizontal overflow on desktop and mobile', async ({ page }) => {
    const panel = page.locator('.hl-cluster-panel').first();
    expect(await panel.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(false);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(250);
    expect(await panel.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(false);
  });

  test('OFFSET-HYBRID-10: validation error appears for zero balance', async ({ page }) => {
    await page.locator('#off-balance').evaluate((element) => {
      element.min = '0';
      element.value = '0';
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.click('#off-calculate');

    await expect(page.locator('#off-result')).toContainText('greater than 0');
  });
});

test.describe('Offset calculator route contract', () => {
  test('ISS-OFFSET-HOMELOAN-VISUAL: single-pane route and interaction contract', async ({ page }) => {
    await page.goto('/loan-calculators/offset-mortgage-calculator/');

    const centerPanels = page.locator('.hl-cluster-panel');
    await expect(centerPanels).toHaveCount(1);

    const panel = centerPanels.first();
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(panel.locator('#calc-offset-calculator')).toBeVisible();
    await expect(panel.locator('#loan-offset-explanation')).toBeVisible();
    await expect(panel.locator('h3:has-text("Explanation")')).toHaveCount(0);

    await expect(page.locator('#off-balance')).toHaveAttribute('type', 'range');
    await expect(page.locator('#off-rate')).toHaveAttribute('type', 'range');
    await expect(page.locator('#off-term')).toHaveAttribute('type', 'range');
    await expect(page.locator('#off-savings')).toHaveAttribute('type', 'range');
    await expect(page.locator('#off-contribution')).toHaveAttribute('type', 'range');

    await page.locator('#off-calculate').click();
    await page.waitForFunction(() => {
      const node = document.querySelector('#off-result .mtg-result-value');
      return node && node.textContent.trim() !== '';
    });

    await expect(page.locator('#off-result')).toContainText('Monthly Payment');
    await expect(page.locator('[data-off="effective-balance"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-off="interest-saved"]')).toContainText(/[0-9]/);

    await expect(page.locator('#off-table-monthly-wrap')).toHaveClass(/is-hidden/);
    await expect(page.locator('#off-table-yearly-wrap')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#off-table-yearly-body tr')).not.toHaveCount(0);

    await page.locator('#off-view-monthly').click();
    await expect(page.locator('#off-table-monthly-wrap')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#off-table-monthly-body tr')).not.toHaveCount(0);

    await expect(page.locator('#loan-offset-explanation .bor-faq-card')).toHaveCount(10);
    await expect(page.locator('#loan-offset-explanation')).not.toContainText(/[£$€₹¥]/);
  });
});
