import { expect, test } from '@playwright/test';

test.describe('math/standard-deviation seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/standard-deviation/', async ({ page }) => {
    await page.goto('/math/standard-deviation/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
