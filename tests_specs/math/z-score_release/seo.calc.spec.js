import { expect, test } from '@playwright/test';

test.describe('math/z-score seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/z-score/', async ({ page }) => {
    await page.goto('/math/z-score/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
