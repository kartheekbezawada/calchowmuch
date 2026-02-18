import { expect, test } from '@playwright/test';

test.describe('math/hypothesis-testing seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/statistics/hypothesis-testing/', async ({ page }) => {
    await page.goto('/math/statistics/hypothesis-testing/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
