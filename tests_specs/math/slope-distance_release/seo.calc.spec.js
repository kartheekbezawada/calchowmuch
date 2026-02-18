import { expect, test } from '@playwright/test';

test.describe('math/slope-distance seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/algebra/slope-distance/', async ({ page }) => {
    await page.goto('/math/algebra/slope-distance/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
