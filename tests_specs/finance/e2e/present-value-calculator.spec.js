import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Present Value Calculator', () => {
  test('PV-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/finance/present-value');

    const topNavActive = page.locator('.top-nav-link.is-active .nav-label');
    await expect(topNavActive).toHaveText('Finance');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Present Value (PV)');

    const optionalSection = page.locator('#pv-optional-section');
    await expect(optionalSection).toHaveClass(/is-hidden/);

    await page.fill('#pv-future-value', '10000');
    await page.fill('#pv-discount-rate', '5');
    await page.fill('#pv-time-period', '3');

    await page.click('#pv-calc');

    const resultText = await page.locator('#pv-result').textContent();
    const resultValue = parseNumber(resultText);
    const expected = 10000 / Math.pow(1 + 0.05, 3);
    expect(resultValue).toBeCloseTo(expected, 2);

    await page.click('#pv-optional-toggle');
    await expect(optionalSection).not.toHaveClass(/is-hidden/);

    await page.click('[data-button-group="pv-compounding"] button[data-value="monthly"]');
    await page.click('[data-button-group="pv-period-type"] button[data-value="months"]');
    await page.fill('#pv-time-period', '24');
    await page.click('#pv-calc');

    const updatedResultText = await page.locator('#pv-result').textContent();
    const updatedValue = parseNumber(updatedResultText);
    const expectedMonthly = 10000 / Math.pow(1 + 0.05 / 12, 24);
    expect(updatedValue).toBeCloseTo(expectedMonthly, 2);

    await expect(page.locator('[data-pv="present-value"]').first()).not.toHaveText('—');
  });
});
