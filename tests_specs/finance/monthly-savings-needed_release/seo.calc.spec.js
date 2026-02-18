import { expect, test } from '@playwright/test';

test.describe('finance/monthly-savings-needed seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /finance/monthly-savings-needed/', async ({ page }) => {
    await page.goto('/finance/monthly-savings-needed/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
