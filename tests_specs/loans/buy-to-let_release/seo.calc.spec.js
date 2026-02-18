import { expect, test } from '@playwright/test';

test.describe('loans/buy-to-let seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /loans/buy-to-let/', async ({ page }) => {
    await page.goto('/loans/buy-to-let/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
