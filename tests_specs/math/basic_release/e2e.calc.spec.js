import { expect, test } from '@playwright/test';

test.describe('math/basic e2e scope placeholder', () => {
  test.skip('migrated test content pending for /math/basic/', async ({ page }) => {
    await page.goto('/math/basic/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
