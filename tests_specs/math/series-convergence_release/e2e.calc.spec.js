import { expect, test } from '@playwright/test';

test.describe('math/series-convergence e2e scope placeholder', () => {
  test.skip('migrated test content pending for /math/calculus/series-convergence/', async ({ page }) => {
    await page.goto('/math/calculus/series-convergence/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
