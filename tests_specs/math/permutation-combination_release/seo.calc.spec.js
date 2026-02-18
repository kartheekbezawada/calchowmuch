import { expect, test } from '@playwright/test';

test.describe('math/permutation-combination seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/permutation-combination/', async ({ page }) => {
    await page.goto('/math/permutation-combination/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
