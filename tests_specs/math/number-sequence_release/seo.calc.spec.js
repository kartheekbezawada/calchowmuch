import { expect, test } from '@playwright/test';

test.describe('math/number-sequence seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/number-sequence/', async ({ page }) => {
    await page.goto('/math/number-sequence/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
