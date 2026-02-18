import { expect, test } from '@playwright/test';

test.describe('math/sample-size e2e scope placeholder', () => {
  test.skip('migrated test content pending for /math/sample-size/', async ({ page }) => {
    await page.goto('/math/sample-size/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
