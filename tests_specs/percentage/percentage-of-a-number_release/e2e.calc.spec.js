import { expect, test } from '@playwright/test';

test.describe('Find Percentage of a Number Calculator', () => {
  test('PON-TEST-E2E-1: computes X% of Y for positive and negative inputs', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-of-a-number-calculator/');

    await page.fill('#pon-percent', '20');
    await page.fill('#pon-number', '50');
    await page.click('#pon-calc');

    await expect(page.locator('#pon-result')).toContainText('Result: 10.00');
    await expect(page.locator('#pon-result-detail')).toContainText('(20.00 / 100) x 50.00 = 10.00');

    await page.fill('#pon-percent', '-10');
    await page.fill('#pon-number', '200');
    await page.click('#pon-calc');

    await expect(page.locator('#pon-result')).toContainText('Result: -20.00');
  });
});
