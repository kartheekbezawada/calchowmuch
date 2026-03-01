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

    const topNavActive = page.locator('.top-nav-link.is-active .nav-label');
    await expect(topNavActive).toHaveText('Finance');

    const leftActive = page.locator('.fin-nav-item.is-active');
    await expect(leftActive).toContainText('Future Value of Annuity');

    await setInputValue(page, '#fva-payment', 500);
    await setInputValue(page, '#fva-interest-rate', 5);
    await setInputValue(page, '#fva-periods', 10);

    await page.click('#fva-calc');

    const resultText = await page.locator('#fva-result').textContent();
    const resultValue = parseNumber(resultText);
    const ordinary = 500 * ((Math.pow(1 + 0.05, 10) - 1) / 0.05);
    expect(resultValue).toBeCloseTo(ordinary, 0);

    await page.click('[data-button-group="fva-annuity-type"] button[data-value="due"]');
    await page.click('#fva-calc');

    const dueText = await page.locator('#fva-result').textContent();
    const dueValue = parseNumber(dueText);
    expect(dueValue).toBeCloseTo(ordinary * 1.05, 0);

    await page.click('[data-button-group="fva-annuity-type"] button[data-value="ordinary"]');

    await page.click('[data-button-group="fva-compounding"] button[data-value="monthly"]');
    await page.click('[data-button-group="fva-period-type"] button[data-value="months"]');
    await setInputValue(page, '#fva-periods', 24);
    await page.click('#fva-calc');

    const updatedResultText = await page.locator('#fva-result').textContent();
    const updatedValue = parseNumber(updatedResultText);
    const expectedMonthly = 500 * ((Math.pow(1 + 0.05 / 12, 24) - 1) / (0.05 / 12));
    expect(updatedValue).toBeCloseTo(expectedMonthly, 0);

    await expect(page.locator('[data-fva="snap-payment"]').first()).not.toHaveText('N/A');
  });
});
