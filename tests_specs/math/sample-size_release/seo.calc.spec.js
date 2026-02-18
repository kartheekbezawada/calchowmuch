import { expect, test } from '@playwright/test';

test.describe('math/sample-size seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/sample-size/', async ({ page }) => {
    await page.goto('/math/sample-size/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
