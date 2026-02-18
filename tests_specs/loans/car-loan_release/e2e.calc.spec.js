import { expect, test } from '@playwright/test';

test.describe('loans/car-loan e2e scope placeholder', () => {
  test.skip('migrated test content pending for /loans/car-loan/', async ({ page }) => {
    await page.goto('/loans/car-loan/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
