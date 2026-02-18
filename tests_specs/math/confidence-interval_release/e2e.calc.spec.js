import { expect, test } from '@playwright/test';

test.describe('math/confidence-interval e2e scope placeholder', () => {
  test.skip('migrated test content pending for /math/confidence-interval/', async ({ page }) => {
    await page.goto('/math/confidence-interval/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
