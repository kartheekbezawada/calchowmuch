import { expect, test } from '@playwright/test';

test.describe('math/anova e2e scope placeholder', () => {
  test.skip('migrated test content pending for /math/statistics/anova/', async ({ page }) => {
    await page.goto('/math/statistics/anova/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
