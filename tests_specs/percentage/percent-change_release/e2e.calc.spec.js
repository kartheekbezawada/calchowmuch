import { expect, test } from '@playwright/test';

test.describe('Percent Change Calculator', () => {
  test('PCHG-TEST-E2E-1: signed percent, amount, direction, and zero-origin guard', async ({ page }) => {
    await page.goto('/percentage-calculators/percent-change-calculator/');

    await page.fill('#pct-change-a', '50');
    await page.fill('#pct-change-b', '60');
    await page.click('#pct-change-calc');
    await expect(page.locator('#pct-change-result')).toContainText('Percent Change: +20.00%');
    await expect(page.locator('#pct-change-result-detail')).toContainText('Direction: Increase');

    await page.fill('#pct-change-a', '100');
    await page.fill('#pct-change-b', '80');
    await page.click('#pct-change-calc');
    await expect(page.locator('#pct-change-result')).toContainText('Percent Change: -20.00%');
    await expect(page.locator('#pct-change-result-detail')).toContainText('Direction: Decrease');

    await page.fill('#pct-change-a', '0');
    await page.fill('#pct-change-b', '80');
    await page.click('#pct-change-calc');
    await expect(page.locator('#pct-change-result')).toContainText('undefined when original value (A) is 0');
  });
});
