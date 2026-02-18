import { expect, test } from '@playwright/test';

test.describe('math/exponential-equations seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/log/exponential-equations/', async ({ page }) => {
    await page.goto('/math/log/exponential-equations/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
