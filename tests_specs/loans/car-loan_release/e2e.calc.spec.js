import { expect, test } from '@playwright/test';

test.describe('loans/car-loan e2e scope placeholder', () => {
  test.skip('migrated test content pending for /car-loan-calculators/car-loan-calculator/', async ({ page }) => {
    await page.goto('/car-loan-calculators/car-loan-calculator/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
