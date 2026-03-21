import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

async function setInputValue(page, selector, value) {
  await page.$eval(
    selector,
    (element, nextValue) => {
      const input = /** @type {HTMLInputElement} */ (element);
      input.value = String(nextValue);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    value
  );
}

test.describe('Inflation Calculator', () => {
  test('INF-TEST-E2E-1: user journey, valid result, and validation states', async ({ page }) => {
    await page.goto('/finance-calculators/inflation-calculator/');

    await expect(page.locator('.fi-cluster-site-header')).toBeVisible();
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveText('Inflation Calculator');

    const baselineValue = parseNumber(await page.locator('#inf-result').textContent());
    expect(baselineValue).toBeCloseTo(1919.75, 1);

    await setInputValue(page, '#inf-amount', 1200);
    await setInputValue(page, '#inf-from-month', '2000-01');
    await setInputValue(page, '#inf-to-month', '2025-12');
    await expect(page.locator('#inf-stale-note')).toBeVisible();
    expect(parseNumber(await page.locator('#inf-result').textContent())).toBeCloseTo(baselineValue, 2);

    await page.click('#inf-calc');
    await expect(page.locator('#inf-stale-note')).toBeHidden();
    expect(parseNumber(await page.locator('#inf-result').textContent())).toBeCloseTo(2303.7, 1);
    await expect(page.locator('[data-inf="snap-to"]')).toHaveText('December 2025');

    await setInputValue(page, '#inf-to-month', '2025-10');
    await page.click('#inf-calc');
    await expect(page.locator('#inf-result')).toContainText('CPI data is unavailable');
    await expect(page.locator('[data-inf="metric-factor"]')).toHaveText('—');

    await setInputValue(page, '#inf-from-month', '2025-12');
    await setInputValue(page, '#inf-to-month', '2025-09');
    await page.click('#inf-calc');
    await expect(page.locator('#inf-result')).toContainText(
      'End month must be the same as or later than start month.'
    );
    await expect(page.locator('[data-inf="metric-change"]')).toHaveText('—');
  });
});
