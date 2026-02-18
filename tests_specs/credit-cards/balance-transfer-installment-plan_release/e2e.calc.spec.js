import { expect, test } from '@playwright/test';

test.describe('credit-cards/balance-transfer-installment-plan e2e scope placeholder', () => {
  test.skip('migrated test content pending for /loans/balance-transfer-installment-plan/', async ({ page }) => {
    await page.goto('/loans/balance-transfer-installment-plan/');
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
