import { expect, test } from '@playwright/test';

test.describe('math/quadratic-equation seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/algebra/quadratic-equation/', async ({ page }) => {
    await page.goto('/math/algebra/quadratic-equation/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
