import { expect, test } from '@playwright/test';

test.describe('Percent to Fraction/Decimal Converter', () => {
  test('PTFD-TEST-E2E-1: converts percent input with and without % sign', async ({ page }) => {
    await page.goto('/percentage-calculators/percent-to-fraction-decimal/');

    await page.fill('#ptfd-percent', '12.5%');
    await page.click('#ptfd-calc');

    await expect(page.locator('#ptfd-result')).toContainText('Decimal: 0.125');
    await expect(page.locator('#ptfd-result')).toContainText('Fraction: 1/8');

    await page.fill('#ptfd-percent', '-25');
    await page.click('#ptfd-calc');

    await expect(page.locator('#ptfd-result')).toContainText('Decimal: -0.25');
    await expect(page.locator('#ptfd-result')).toContainText('Fraction: -1/4');
  });
});
