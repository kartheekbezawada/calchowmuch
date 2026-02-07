import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Future Value Calculator', () => {
  test('FV-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/finance/future-value');

    const topNavActive = page.locator('.top-nav-link.is-active .nav-label');
    await expect(topNavActive).toHaveText('Finance');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Future Value (FV)');

    const optionalSection = page.locator('#fv-optional-section');
    await expect(optionalSection).toHaveClass(/is-hidden/);

    await page.fill('#fv-present-value', '10000');
    await page.fill('#fv-interest-rate', '5');
    await page.fill('#fv-time-period', '3');

    await page.click('#fv-calc');

    const resultText = await page.locator('#fv-result').textContent();
    const resultValue = parseNumber(resultText);
    const expected = 10000 * Math.pow(1 + 0.05, 3);
    expect(resultValue).toBeCloseTo(expected, 2);

    await page.click('#fv-optional-toggle');
    await expect(optionalSection).not.toHaveClass(/is-hidden/);

    await page.click('[data-button-group="fv-compounding"] button[data-value="monthly"]');
    await page.click('[data-button-group="fv-period-type"] button[data-value="months"]');
    await page.fill('#fv-time-period', '24');
    await page.fill('#fv-regular-contribution', '100');
    await page.click('#fv-calc');

    const updatedResultText = await page.locator('#fv-result').textContent();
    const updatedValue = parseNumber(updatedResultText);
    const periodicRate = 0.05 / 12;
    const n = 24;
    const expectedMonthly =
      10000 * Math.pow(1 + periodicRate, n) +
      100 * ((Math.pow(1 + periodicRate, n) - 1) / periodicRate);
    expect(updatedValue).toBeCloseTo(expectedMonthly, 2);

    await expect(page.locator('[data-fv="future-value"]').first()).not.toHaveText('—');
  });
});
