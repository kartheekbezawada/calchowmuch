import { expect, test } from '@playwright/test';

test.describe('loans/offset-calculator seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /loan-calculators/offset-mortgage-calculator/', async ({ page }) => {
    await page.goto('/loan-calculators/offset-mortgage-calculator/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
