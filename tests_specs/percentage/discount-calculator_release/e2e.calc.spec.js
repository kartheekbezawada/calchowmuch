import { expect, test } from '@playwright/test';

test.describe('percentage/discount-calculator e2e scope placeholder', () => {
  test.skip('migrated test content pending for /percentage-calculators/discount-calculator/', async ({ page }) => {
    await page.goto('/percentage-calculators/discount-calculator/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
