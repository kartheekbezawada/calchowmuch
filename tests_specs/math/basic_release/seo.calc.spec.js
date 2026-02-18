import { expect, test } from '@playwright/test';

test.describe('math/basic seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/basic/', async ({ page }) => {
    await page.goto('/math/basic/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
