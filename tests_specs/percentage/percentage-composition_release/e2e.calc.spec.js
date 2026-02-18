import { expect, test } from '@playwright/test';

test.describe('percentage/percentage-composition e2e scope placeholder', () => {
  test.skip('migrated test content pending for /percentage-calculators/percentage-composition/', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-composition/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
