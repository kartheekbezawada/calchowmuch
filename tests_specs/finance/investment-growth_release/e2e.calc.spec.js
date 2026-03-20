import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Investment Growth Calculator', () => {
  test('IG-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/finance-calculators/investment-growth-calculator/');

    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveText('Investment Growth Calculator');

    await page.fill('#ig-initial', '10000');
    await page.fill('#ig-return', '7');
    await page.fill('#ig-years', '10');
    await page.fill('#ig-contribution', '0');
    await page.click('[data-button-group="ig-compounding"] button[data-value="monthly"]');
    await page.click('#ig-calc');

    const resultText = await page.locator('#ig-result').textContent();
    const resultValue = parseNumber(resultText);
    const expected = 10000 * Math.pow(1 + 0.07 / 12, 120);
    expect(resultValue).toBeCloseTo(expected, 0);

    await page.fill('#ig-contribution', '200');
    await page.click('#ig-calc');

    const contribResultText = await page.locator('#ig-result').textContent();
    const contribValue = parseNumber(contribResultText);
    expect(contribValue).toBeGreaterThan(expected);

    await page.fill('#ig-inflation', '3');
    await page.click('#ig-calc');

    const detailText = await page.locator('#ig-result-detail').textContent();
    expect(detailText).toContain('Inflation Adjusted');
  });
});
