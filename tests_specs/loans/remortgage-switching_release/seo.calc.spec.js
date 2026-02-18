import { expect, test } from '@playwright/test';

test.describe('loans/remortgage-switching seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /loan-calculators/remortgage-calculator/', async ({ page }) => {
    await page.goto('/loan-calculators/remortgage-calculator/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
