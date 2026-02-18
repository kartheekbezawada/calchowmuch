import { expect, test } from '@playwright/test';

test.describe('math/fraction-calculator seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/fraction-calculator/', async ({ page }) => {
    await page.goto('/math/fraction-calculator/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
