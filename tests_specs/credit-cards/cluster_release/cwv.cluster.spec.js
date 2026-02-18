import { test } from '@playwright/test';
import { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';

const ROUTES = ["/loans/balance-transfer-installment-plan/","/loans/credit-card-consolidation/","/loans/credit-card-minimum-payment/"];

test.describe('credit-cards cluster cwv guard', () => {
  test('cluster routes satisfy CLS/LCP thresholds', async ({ page }) => {
    for (const route of ROUTES) {
      const metrics = await measureRouteCwv(page, route);
      assertCwv(metrics, route);
    }
  });
});
