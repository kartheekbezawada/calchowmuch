import { expect, test } from '@playwright/test';

test.describe('math/z-score e2e scope placeholder', () => {
  test.skip('migrated test content pending for /math/z-score/', async ({ page }) => {
    await page.goto('/math/z-score/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
