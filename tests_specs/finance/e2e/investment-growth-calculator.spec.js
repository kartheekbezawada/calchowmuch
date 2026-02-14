import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Investment Growth Calculator', () => {
  test('IG-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/finance/investment-growth');

    const topNavActive = page.locator('.top-nav-link.is-active .nav-label');
    await expect(topNavActive).toHaveText('Finance');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Investment Growth');

    const optionalSection = page.locator('#ig-optional-section');
    await expect(optionalSection).toHaveClass(/is-hidden/);

    await page.fill('#ig-initial', '10000');
    await page.fill('#ig-return', '7');
    await page.fill('#ig-time', '10');
    await page.click('[data-button-group="ig-compounding"] button[data-value="monthly"]');
    await page.click('#ig-calc');

    const resultText = await page.locator('#ig-result').textContent();
    expect(resultText).toContain('Future Value');
    const resultValue = parseNumber(resultText);
    const expected = 10000 * Math.pow(1 + 0.07 / 12, 120);
    expect(resultValue).toBeCloseTo(expected, 0);

    await page.click('#ig-optional-toggle');
    await expect(optionalSection).not.toHaveClass(/is-hidden/);

    await page.fill('#ig-contribution', '200');
    await page.click('#ig-calc');

    const contribResultText = await page.locator('#ig-result').textContent();
    const contribValue = parseNumber(contribResultText);
    expect(contribValue).toBeGreaterThan(expected);

    await page.fill('#ig-inflation', '3');
    await page.click('#ig-calc');

    const detailText = await page.locator('#ig-result-detail').textContent();
    expect(detailText).toContain('Inflation-Adjusted Value');

    await expect(page.locator('[data-ig="future-value"]').first()).not.toHaveText('N/A');
  });
});
