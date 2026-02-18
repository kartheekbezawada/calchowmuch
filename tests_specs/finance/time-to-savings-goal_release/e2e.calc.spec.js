import { expect, test } from '@playwright/test';

test.describe('finance/time-to-savings-goal e2e scope placeholder', () => {
  test.skip('migrated test content pending for /finance/time-to-savings-goal/', async ({ page }) => {
    await page.goto('/finance/time-to-savings-goal/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
