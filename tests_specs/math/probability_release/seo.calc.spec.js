import { expect, test } from '@playwright/test';

test.describe('math/probability seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/probability/', async ({ page }) => {
    await page.goto('/math/probability/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
