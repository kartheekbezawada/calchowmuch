import { expect, test } from '@playwright/test';

test.describe('math/critical-points e2e scope placeholder', () => {
  test.skip('migrated test content pending for /math/calculus/critical-points/', async ({ page }) => {
    await page.goto('/math/calculus/critical-points/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
