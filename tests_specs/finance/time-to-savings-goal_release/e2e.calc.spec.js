import { expect, test } from '@playwright/test';

test.describe('finance/time-to-savings-goal e2e scope placeholder', () => {
  test.skip('migrated test content pending for /finance-calculators/time-to-savings-goal-calculator/', async ({ page }) => {
    await page.goto('/finance-calculators/time-to-savings-goal-calculator/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
