import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Present Value of Annuity Calculator', () => {
  test('PVA-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/finance/present-value-of-annuity');

    const topNavActive = page.locator('.top-nav-link.is-active .nav-label');
    await expect(topNavActive).toHaveText('Finance');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Present Value of Annuity');

    const optionalSection = page.locator('#pva-optional-section');
    await expect(optionalSection).toHaveClass(/is-hidden/);

    await page.fill('#pva-payment', '500');
    await page.fill('#pva-discount-rate', '5');
    await page.fill('#pva-periods', '10');

    await page.click('#pva-calc');

    const resultText = await page.locator('#pva-result').textContent();
    const resultValue = parseNumber(resultText);
    const ordinary = 500 * (1 - Math.pow(1 + 0.05, -10)) / 0.05;
    expect(resultValue).toBeCloseTo(ordinary, 2);

    await page.click('[data-button-group="pva-annuity-type"] button[data-value="due"]');
    await page.click('#pva-calc');

    const dueText = await page.locator('#pva-result').textContent();
    const dueValue = parseNumber(dueText);
    expect(dueValue).toBeCloseTo(ordinary * 1.05, 2);

    await page.click('[data-button-group="pva-annuity-type"] button[data-value="ordinary"]');

    await page.click('#pva-optional-toggle');
    await expect(optionalSection).not.toHaveClass(/is-hidden/);

    await page.click('[data-button-group="pva-compounding"] button[data-value="monthly"]');
    await page.click('[data-button-group="pva-period-type"] button[data-value="months"]');
    await page.fill('#pva-periods', '24');
    await page.click('#pva-calc');

    const updatedResultText = await page.locator('#pva-result').textContent();
    const updatedValue = parseNumber(updatedResultText);
    const expectedMonthly = 500 * (1 - Math.pow(1 + 0.05 / 12, -24)) / (0.05 / 12);
    expect(updatedValue).toBeCloseTo(expectedMonthly, 2);

    await expect(page.locator('[data-pva="present-value"]').first()).not.toHaveText('N/A');
  });
});
