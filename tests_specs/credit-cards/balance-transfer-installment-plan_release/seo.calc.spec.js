import { expect, test } from '@playwright/test';

test.describe('credit-cards/balance-transfer-installment-plan seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /loans/balance-transfer-installment-plan/', async ({ page }) => {
    await page.goto('/loans/balance-transfer-installment-plan/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
