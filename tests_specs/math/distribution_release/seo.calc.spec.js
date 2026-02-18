import { expect, test } from '@playwright/test';

test.describe('math/distribution seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/statistics/distribution/', async ({ page }) => {
    await page.goto('/math/statistics/distribution/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
