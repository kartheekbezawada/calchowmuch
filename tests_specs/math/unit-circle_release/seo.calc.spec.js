import { expect, test } from '@playwright/test';

test.describe('math/unit-circle seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/trigonometry/unit-circle/', async ({ page }) => {
    await page.goto('/math/trigonometry/unit-circle/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
