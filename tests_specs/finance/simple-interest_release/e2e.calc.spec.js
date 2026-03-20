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

test.describe('Simple Interest Calculator', () => {
  test('SI-TEST-E2E-1: user journey and calculation output', async ({ page }) => {
    await page.goto('/finance-calculators/simple-interest-calculator/');

    await expect(page.locator('.fi-cluster-site-header')).toBeVisible();
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveText('Simple Interest Calculator');

    await page.click('#si-calc');

    expect(parseNumber(await page.locator('#si-result').textContent())).toBeCloseTo(1800, 3);
    expect(parseNumber(await page.locator('[data-si="metric-ending-amount"]').textContent())).toBeCloseTo(11800, 3);

    await setInputValue(page, '#si-principal', 15000);
    await expect(page.locator('#si-stale-note')).toBeVisible();
    expect(parseNumber(await page.locator('#si-result').textContent())).toBeCloseTo(1800, 3);

    await page.click('[data-button-group="si-basis"] button[data-value="per-month"]');
    await page.click('[data-button-group="si-time-unit"] button[data-value="months"]');
    await setInputValue(page, '#si-time', 6);
    expect(parseNumber(await page.locator('#si-result').textContent())).toBeCloseTo(1800, 3);
    await page.click('#si-calc');

    const monthlyInterestText = await page.locator('#si-result').textContent();
    expect(parseNumber(monthlyInterestText)).toBeCloseTo(5400, 3);

    await expect(page.locator('[data-si="ending-amount"]').first()).not.toHaveText('N/A');
  });
});
