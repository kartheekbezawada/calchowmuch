import { expect, test } from '@playwright/test';

test.describe('math/quadratic-equation e2e scope placeholder', () => {
  test.skip('migrated test content pending for /math/algebra/quadratic-equation/', async ({ page }) => {
    await page.goto('/math/algebra/quadratic-equation/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
