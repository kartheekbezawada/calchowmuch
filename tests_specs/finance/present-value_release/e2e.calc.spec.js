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

test.describe('Present Value Calculator', () => {
  test('PV-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/finance-calculators/present-value-calculator/');

    await expect(page.locator('.fi-cluster-site-header')).toBeVisible();
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveText('Present Value Calculator');

    const baselineResult = parseNumber(await page.locator('#pv-result').textContent());

    await setInputValue(page, '#pv-future-value', 10000);
    await setInputValue(page, '#pv-discount-rate', 5);
    await setInputValue(page, '#pv-time-period', 3);

    await page.click('#pv-calc');

    const resultText = await page.locator('#pv-result').textContent();
    const resultValue = parseNumber(resultText);
    const expected = 10000 / Math.pow(1 + 0.05, 3);
    expect(resultValue).toBeCloseTo(expected, 2);

    await setInputValue(page, '#pv-time-period', 4);
    await expect(page.locator('#pv-stale-note')).toBeVisible();
    expect(parseNumber(await page.locator('#pv-result').textContent())).toBeCloseTo(expected, 2);

    await page.click('[data-button-group="pv-compounding"] button[data-value="monthly"]');
    await page.click('[data-button-group="pv-period-type"] button[data-value="months"]');
    await setInputValue(page, '#pv-time-period', 24);
    expect(parseNumber(await page.locator('#pv-result').textContent())).toBeCloseTo(expected, 2);

    await page.click('#pv-calc');
    const updatedResultText = await page.locator('#pv-result').textContent();
    const updatedValue = parseNumber(updatedResultText);
    const expectedMonthly = 10000 / Math.pow(1 + 0.05 / 12, 24);
    expect(updatedValue).toBeCloseTo(expectedMonthly, 2);

    expect(baselineResult).toBeGreaterThan(0);
    await expect(page.locator('[data-pv="snap-fv"]').first()).not.toHaveText('—');
  });
});
