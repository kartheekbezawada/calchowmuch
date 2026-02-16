import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Future Value of Annuity Calculator', () => {
  test('FVA-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/finance/future-value-of-annuity');

    const topNavActive = page.locator('.top-nav-link.is-active .nav-label');
    await expect(topNavActive).toHaveText('Finance');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Future Value of Annuity');

    await page.fill('#fva-payment', '500');
    await page.fill('#fva-interest-rate', '5');
    await page.fill('#fva-periods', '10');

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
    await page.fill('#fva-periods', '24');
    await page.click('#fva-calc');

    const updatedResultText = await page.locator('#fva-result').textContent();
    const updatedValue = parseNumber(updatedResultText);
    const expectedMonthly = 500 * ((Math.pow(1 + 0.05 / 12, 24) - 1) / (0.05 / 12));
    expect(updatedValue).toBeCloseTo(expectedMonthly, 0);

    await expect(page.locator('[data-fva="future-value"]').first()).not.toHaveText('N/A');
  });
});
