import { expect, test } from '@playwright/test';

test.describe('loans/offset-calculator seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /loans/offset-calculator/', async ({ page }) => {
    await page.goto('/loans/offset-calculator/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
