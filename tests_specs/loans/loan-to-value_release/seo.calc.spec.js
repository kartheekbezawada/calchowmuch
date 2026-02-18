import { expect, test } from '@playwright/test';

test.describe('loans/loan-to-value seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /loan-calculators/ltv-calculator/', async ({ page }) => {
    await page.goto('/loan-calculators/ltv-calculator/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
