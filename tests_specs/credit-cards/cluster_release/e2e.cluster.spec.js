import { expect, test } from '@playwright/test';

const ROUTES = ["/credit-card-calculators/balance-transfer-credit-card-calculator/","/credit-card-calculators/credit-card-consolidation-calculator/","/credit-card-calculators/credit-card-minimum-payment-calculator/"];

test.describe('credit-cards cluster e2e smoke', () => {
  test('cluster representative routes load and show H1', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      await expect(page.locator('h1').first()).toBeVisible();
    }
  });
});
