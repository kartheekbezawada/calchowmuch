import { expect, test } from '@playwright/test';

test.describe('Percentage Increase Calculator', () => {
  test('PINC-TEST-E2E-1: calculates increase and handles zero-origin guard', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-increase/');

    await page.fill('#pct-inc-x', '80');
    await page.fill('#pct-inc-y', '100');
    await page.click('#pct-inc-calc');

    await expect(page.locator('#pct-inc-result')).toContainText('Percentage Increase: 25.00%');
    await expect(page.locator('#pct-inc-result-detail')).toContainText('Increase Amount: 20.00');

    await page.fill('#pct-inc-x', '0');
    await page.fill('#pct-inc-y', '100');
    await page.click('#pct-inc-calc');

    await expect(page.locator('#pct-inc-result')).toContainText('undefined when original value (X) is 0');
  });
});
