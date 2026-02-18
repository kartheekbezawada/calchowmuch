import { expect, test } from '@playwright/test';

test.describe('loans/interest-rate-change-calculator seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /loan-calculators/interest-rate-change-calculator/', async ({ page }) => {
    await page.goto('/loan-calculators/interest-rate-change-calculator/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
