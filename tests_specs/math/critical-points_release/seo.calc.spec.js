import { expect, test } from '@playwright/test';

test.describe('math/critical-points seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/calculus/critical-points/', async ({ page }) => {
    await page.goto('/math/calculus/critical-points/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
