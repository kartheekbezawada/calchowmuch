import { expect, test } from '@playwright/test';

test.describe('percentage/markup-calculator e2e scope placeholder', () => {
  test.skip('migrated test content pending for /percentage-calculators/markup-calculator/', async ({ page }) => {
    await page.goto('/percentage-calculators/markup-calculator/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
