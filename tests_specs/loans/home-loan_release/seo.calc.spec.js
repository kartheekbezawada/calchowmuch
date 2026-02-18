import { expect, test } from '@playwright/test';

test.describe('loans/home-loan seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /loans/home-loan/', async ({ page }) => {
    await page.goto('/loans/home-loan/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
