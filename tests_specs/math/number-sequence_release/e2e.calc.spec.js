import { expect, test } from '@playwright/test';

test.describe('math/number-sequence e2e scope placeholder', () => {
  test.skip('migrated test content pending for /math/number-sequence/', async ({ page }) => {
    await page.goto('/math/number-sequence/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
