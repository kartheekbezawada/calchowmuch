import { expect, test } from '@playwright/test';

test.describe('math/log-scale seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/log/log-scale/', async ({ page }) => {
    await page.goto('/math/log/log-scale/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
