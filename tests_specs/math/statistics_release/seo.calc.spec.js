import { expect, test } from '@playwright/test';

test.describe('math/statistics seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/statistics/', async ({ page }) => {
    await page.goto('/math/statistics/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
