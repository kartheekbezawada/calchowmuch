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

test.describe('Present Value of Annuity Calculator', () => {
  test('PVA-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/finance-calculators/present-value-of-annuity-calculator/');

    await expect(page.locator('.fi-cluster-site-header')).toBeVisible();
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveText('Present Value of Annuity Calculator');

    await page.click('#pva-calc');

    const ordinary = (500 * (1 - Math.pow(1 + 0.05, -10))) / 0.05;
    const resultValue = parseNumber(await page.locator('#pva-result').textContent());
    expect(resultValue).toBeCloseTo(ordinary, 2);

    await setInputValue(page, '#pva-payment', 650);
    await expect(page.locator('#pva-stale-note')).toBeVisible();
    expect(parseNumber(await page.locator('#pva-result').textContent())).toBeCloseTo(ordinary, 2);

    await page.click('[data-button-group="pva-annuity-type"] button[data-value="due"]');
    await page.click('#pva-calc');

    const dueValue = parseNumber(await page.locator('#pva-result').textContent());
    const dueExpected = ((650 * (1 - Math.pow(1 + 0.05, -10))) / 0.05) * 1.05;
    expect(dueValue).toBeCloseTo(dueExpected, 2);

    await page.click('[data-button-group="pva-annuity-type"] button[data-value="ordinary"]');
    await page.click('[data-button-group="pva-compounding"] button[data-value="monthly"]');
    await page.click('[data-button-group="pva-period-type"] button[data-value="months"]');
    await setInputValue(page, '#pva-periods', 24);
    expect(parseNumber(await page.locator('#pva-result').textContent())).toBeCloseTo(dueExpected, 2);

    await page.click('#pva-calc');

    const updatedValue = parseNumber(await page.locator('#pva-result').textContent());
    const expectedMonthly = (650 * (1 - Math.pow(1 + 0.05 / 12, -24))) / (0.05 / 12);
    expect(updatedValue).toBeCloseTo(expectedMonthly, 2);

    await expect(page.locator('[data-pva="snap-payment"]').first()).not.toHaveText('—');
  });
});
