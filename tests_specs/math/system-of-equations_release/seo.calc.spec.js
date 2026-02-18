import { expect, test } from '@playwright/test';

test.describe('math/system-of-equations seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/algebra/system-of-equations/', async ({ page }) => {
    await page.goto('/math/algebra/system-of-equations/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
