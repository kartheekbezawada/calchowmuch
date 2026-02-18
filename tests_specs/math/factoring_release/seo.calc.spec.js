import { expect, test } from '@playwright/test';

test.describe('math/factoring seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/algebra/factoring/', async ({ page }) => {
    await page.goto('/math/algebra/factoring/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
