import { expect, test } from '@playwright/test';

test.describe('pricing/markup-calculator e2e scope placeholder', () => {
  test.skip('migrated test content pending for /pricing-calculators/markup-calculator/', async ({ page }) => {
    await page.goto('/pricing-calculators/markup-calculator/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
