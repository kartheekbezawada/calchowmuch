import { expect, test } from '@playwright/test';

test.describe('credit-cards/balance-transfer-installment-plan seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /credit-card-calculators/balance-transfer-credit-card-calculator/', async ({ page }) => {
    await page.goto('/credit-card-calculators/balance-transfer-credit-card-calculator/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
