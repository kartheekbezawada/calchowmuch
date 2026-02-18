import { expect, test } from '@playwright/test';

test.describe('percentage/percentage-decrease e2e scope placeholder', () => {
  test.skip('migrated test content pending for /percentage-calculators/percentage-decrease/', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-decrease/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
