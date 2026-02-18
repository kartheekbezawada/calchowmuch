import { expect, test } from '@playwright/test';

test.describe('finance/time-to-savings-goal seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /finance/time-to-savings-goal/', async ({ page }) => {
    await page.goto('/finance/time-to-savings-goal/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
