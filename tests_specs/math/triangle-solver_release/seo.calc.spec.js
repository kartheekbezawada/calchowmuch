import { expect, test } from '@playwright/test';

test.describe('math/triangle-solver seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/trigonometry/triangle-solver/', async ({ page }) => {
    await page.goto('/math/trigonometry/triangle-solver/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
