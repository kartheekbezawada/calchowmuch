import { expect, test } from '@playwright/test';

test.describe('loans/home-loan seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /loan-calculators/mortgage-calculator/', async ({ page }) => {
    await page.goto('/loan-calculators/mortgage-calculator/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
