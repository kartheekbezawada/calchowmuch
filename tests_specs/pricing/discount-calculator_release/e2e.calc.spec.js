import { expect, test } from '@playwright/test';

test.describe('pricing/discount-calculator e2e scope placeholder', () => {
  test.skip('migrated test content pending for /pricing-calculators/discount-calculator/', async ({ page }) => {
    await page.goto('/pricing-calculators/discount-calculator/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
