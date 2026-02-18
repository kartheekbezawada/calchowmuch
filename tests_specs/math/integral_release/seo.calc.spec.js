import { expect, test } from '@playwright/test';

test.describe('math/integral seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/calculus/integral/', async ({ page }) => {
    await page.goto('/math/calculus/integral/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
