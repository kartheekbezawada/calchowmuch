import { expect, test } from '@playwright/test';

test.describe('math/common-log seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/log/common-log/', async ({ page }) => {
    await page.goto('/math/log/common-log/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
