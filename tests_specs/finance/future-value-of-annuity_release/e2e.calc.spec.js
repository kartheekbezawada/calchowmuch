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

test.describe('Future Value of Annuity Calculator', () => {
  test('FVA-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/finance-calculators/future-value-of-annuity-calculator/');

    await expect(page.locator('.fi-cluster-site-header')).toBeVisible();
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveText('Future Value of Annuity Calculator');

    await page.click('#fva-calc');

    const ordinary = 500 * ((Math.pow(1 + 0.05, 10) - 1) / 0.05);
    const resultValue = parseNumber(await page.locator('#fva-result').textContent());
    expect(resultValue).toBeCloseTo(ordinary, 0);

    await setInputValue(page, '#fva-payment', 650);
    await expect(page.locator('#fva-stale-note')).toBeVisible();
    expect(parseNumber(await page.locator('#fva-result').textContent())).toBeCloseTo(ordinary, 0);

    await page.click('[data-button-group="fva-annuity-type"] button[data-value="due"]');
    await page.click('#fva-calc');

    const dueValue = parseNumber(await page.locator('#fva-result').textContent());
    const dueExpected = (650 * ((Math.pow(1 + 0.05, 10) - 1) / 0.05)) * 1.05;
    expect(dueValue).toBeCloseTo(dueExpected, 0);

    await page.click('[data-button-group="fva-annuity-type"] button[data-value="ordinary"]');
    await page.click('[data-button-group="fva-compounding"] button[data-value="monthly"]');
    await page.click('[data-button-group="fva-period-type"] button[data-value="months"]');
    await setInputValue(page, '#fva-periods', 24);
    expect(parseNumber(await page.locator('#fva-result').textContent())).toBeCloseTo(dueExpected, 0);

    await page.click('#fva-calc');

    const updatedValue = parseNumber(await page.locator('#fva-result').textContent());
    const expectedMonthly = 650 * ((Math.pow(1 + 0.05 / 12, 24) - 1) / (0.05 / 12));
    expect(updatedValue).toBeCloseTo(expectedMonthly, 0);

    await expect(page.locator('[data-fva="snap-payment"]').first()).not.toHaveText('—');
  });
});
