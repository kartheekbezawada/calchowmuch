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

    const topNavActive = page.locator('.top-nav-link.is-active .nav-label');
    await expect(topNavActive).toHaveText('Finance');

    const leftActive = page.locator('.fin-nav-item.is-active');
    await expect(leftActive).toContainText('Future Value (FV)');

    await setInputValue(page, '#fv-present-value', 10000);
    await setInputValue(page, '#fv-interest-rate', 5);
    await setInputValue(page, '#fv-time-period', 3);

    await page.click('#fv-calc');

    const resultText = await page.locator('#fv-result').textContent();
    const resultValue = parseNumber(resultText);
    const expected = 10000 * Math.pow(1 + 0.05, 3);
    expect(resultValue).toBeCloseTo(expected, 2);

    await page.click('[data-button-group="fv-compounding"] button[data-value="monthly"]');
    await page.click('[data-button-group="fv-period-type"] button[data-value="months"]');
    await setInputValue(page, '#fv-time-period', 24);
    await setInputValue(page, '#fv-regular-contribution', 100);
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
