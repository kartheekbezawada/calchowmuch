import { expect, test } from '@playwright/test';

const ROUTES = ["/loans/balance-transfer-installment-plan/","/loans/credit-card-consolidation/","/loans/credit-card-minimum-payment/"];

test.describe('credit-cards cluster e2e smoke', () => {
  test('cluster representative routes load and show H1', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      await expect(page.locator('h1').first()).toBeVisible();
    }
  });
});
