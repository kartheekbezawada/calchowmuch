import { expect, test } from '@playwright/test';

test.describe('percentage/what-percent-is-x-of-y e2e scope placeholder', () => {
  test.skip('migrated test content pending for /percentage-calculators/percentage-finder-calculator/', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-finder-calculator/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
