import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text ?? '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Monthly Savings Needed Calculator', () => {
  test('MSN-TEST-E2E-1: route renders in finance shell and calculates monthly target', async ({ page }) => {
    await page.goto('/finance-calculators/monthly-savings-needed-calculator/');

    await expect(page.locator('h1')).toHaveText('Monthly Savings Needed Calculator');
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);

    await page.fill('#msn-goal', '25000');
    await page.fill('#msn-current', '5000');
    await page.fill('#msn-years', '3');
    await page.fill('#msn-months', '0');
    await page.fill('#msn-rate', '3');
    await page.click('#msn-calc');

    const resultValue = parseNumber(await page.locator('#msn-result').textContent());
    expect(resultValue).toBeGreaterThan(0);

    await expect(page.locator('[data-msn="snap-monthly"]')).not.toHaveText('');
    await expect(page.locator('[data-msn="snap-balance"]')).not.toHaveText('');
  });
});
