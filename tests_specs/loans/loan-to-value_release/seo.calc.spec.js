import { expect, test } from '@playwright/test';

test.describe('loans/loan-to-value seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /loans/loan-to-value/', async ({ page }) => {
    await page.goto('/loans/loan-to-value/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
