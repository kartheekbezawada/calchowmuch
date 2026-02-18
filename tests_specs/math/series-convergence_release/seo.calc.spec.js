import { expect, test } from '@playwright/test';

test.describe('math/series-convergence seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/calculus/series-convergence/', async ({ page }) => {
    await page.goto('/math/calculus/series-convergence/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
