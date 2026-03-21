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

test.describe('Future Value Calculator', () => {
  test('FV-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/finance-calculators/future-value-calculator/');

    await expect(page.locator('.fi-cluster-site-header')).toBeVisible();
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveText('Future Value Calculator');

    await setInputValue(page, '#fv-present-value', 10000);
    await setInputValue(page, '#fv-interest-rate', 5);
    await setInputValue(page, '#fv-time-period', 3);

    await page.click('#fv-calc');

    const resultText = await page.locator('#fv-result').textContent();
    const resultValue = parseNumber(resultText);
    const expected = 10000 * Math.pow(1 + 0.05, 3);
    expect(resultValue).toBeCloseTo(expected, 2);

    await setInputValue(page, '#fv-regular-contribution', 100);
    await expect(page.locator('#fv-stale-note')).toBeVisible();
    expect(parseNumber(await page.locator('#fv-result').textContent())).toBeCloseTo(expected, 2);

    await page.click('[data-button-group="fv-compounding"] button[data-value="monthly"]');
    await page.click('[data-button-group="fv-period-type"] button[data-value="months"]');
    await setInputValue(page, '#fv-time-period', 24);
    expect(parseNumber(await page.locator('#fv-result').textContent())).toBeCloseTo(expected, 2);

    await page.click('#fv-calc');
    const updatedResultText = await page.locator('#fv-result').textContent();
    const updatedValue = parseNumber(updatedResultText);
    const periodicRate = 0.05 / 12;
    const n = 24;
    const expectedMonthly =
      10000 * Math.pow(1 + periodicRate, n) +
      100 * ((Math.pow(1 + periodicRate, n) - 1) / periodicRate);
    expect(updatedValue).toBeCloseTo(expectedMonthly, 2);

    await expect(page.locator('[data-fv="snap-pv"]').first()).not.toHaveText('—');
  });
});
