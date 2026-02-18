import { expect, test } from '@playwright/test';

test.describe('math/percentage-increase e2e scope placeholder', () => {
  test.skip('migrated test content pending for /percentage-calculators/percentage-increase/', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-increase/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
