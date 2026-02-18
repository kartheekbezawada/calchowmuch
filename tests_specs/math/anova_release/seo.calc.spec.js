import { expect, test } from '@playwright/test';

test.describe('math/anova seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/statistics/anova/', async ({ page }) => {
    await page.goto('/math/statistics/anova/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
