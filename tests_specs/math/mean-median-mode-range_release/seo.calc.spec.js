import { expect, test } from '@playwright/test';

test.describe('math/mean-median-mode-range seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/mean-median-mode-range/', async ({ page }) => {
    await page.goto('/math/mean-median-mode-range/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
