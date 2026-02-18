import { expect, test } from '@playwright/test';

test.describe('math/hypothesis-testing e2e scope placeholder', () => {
  test.skip('migrated test content pending for /math/statistics/hypothesis-testing/', async ({ page }) => {
    await page.goto('/math/statistics/hypothesis-testing/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
