import { expect, test } from '@playwright/test';

test.describe('math/factoring e2e scope placeholder', () => {
  test.skip('migrated test content pending for /math/algebra/factoring/', async ({ page }) => {
    await page.goto('/math/algebra/factoring/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
