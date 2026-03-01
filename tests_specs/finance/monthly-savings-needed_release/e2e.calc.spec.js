import { expect, test } from '@playwright/test';

test.describe('finance/monthly-savings-needed e2e scope placeholder', () => {
  test.skip('migrated test content pending for /finance-calculators/monthly-savings-needed-calculator/', async ({ page }) => {
    await page.goto('/finance-calculators/monthly-savings-needed-calculator/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
