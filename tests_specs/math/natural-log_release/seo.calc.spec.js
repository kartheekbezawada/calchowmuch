import { expect, test } from '@playwright/test';

test.describe('math/natural-log seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/log/natural-log/', async ({ page }) => {
    await page.goto('/math/log/natural-log/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
