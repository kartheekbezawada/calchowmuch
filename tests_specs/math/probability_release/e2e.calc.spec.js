import { expect, test } from '@playwright/test';

test.describe('math/probability e2e scope placeholder', () => {
  test.skip('migrated test content pending for /math/probability/', async ({ page }) => {
    await page.goto('/math/probability/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
