import { expect, test } from '@playwright/test';

test.describe('percentage/what-percent-is-x-of-y e2e scope placeholder', () => {
  test.skip('migrated test content pending for /percentage-calculators/what-percent-is-x-of-y/', async ({ page }) => {
    await page.goto('/percentage-calculators/what-percent-is-x-of-y/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
