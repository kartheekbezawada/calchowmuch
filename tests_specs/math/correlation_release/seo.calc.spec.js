import { expect, test } from '@playwright/test';

test.describe('math/correlation seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/statistics/correlation/', async ({ page }) => {
    await page.goto('/math/statistics/correlation/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
