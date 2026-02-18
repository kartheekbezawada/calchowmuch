import { expect, test } from '@playwright/test';

test.describe('loans/remortgage-switching seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /loans/remortgage-switching/', async ({ page }) => {
    await page.goto('/loans/remortgage-switching/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
