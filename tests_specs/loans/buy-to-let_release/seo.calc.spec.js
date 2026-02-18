import { expect, test } from '@playwright/test';

test.describe('loans/buy-to-let seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /loan-calculators/buy-to-let-mortgage-calculator/', async ({ page }) => {
    await page.goto('/loan-calculators/buy-to-let-mortgage-calculator/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
