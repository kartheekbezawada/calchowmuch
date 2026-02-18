import { expect, test } from '@playwright/test';

test.describe('math/regression-analysis seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/statistics/regression-analysis/', async ({ page }) => {
    await page.goto('/math/statistics/regression-analysis/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
