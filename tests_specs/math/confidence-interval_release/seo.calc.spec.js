import { expect, test } from '@playwright/test';

test.describe('math/confidence-interval seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/confidence-interval/', async ({ page }) => {
    await page.goto('/math/confidence-interval/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
