import { test } from '@playwright/test';
import { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';

const ROUTES = ["/credit-card-calculators/balance-transfer-credit-card-calculator/","/credit-card-calculators/credit-card-consolidation-calculator/","/credit-card-calculators/credit-card-minimum-payment-calculator/"];

test.describe('credit-cards cluster cwv guard', () => {
  test('cluster routes satisfy CLS/LCP thresholds', async ({ page }) => {
    for (const route of ROUTES) {
      const metrics = await measureRouteCwv(page, route);
      assertCwv(metrics, route);
    }
  });
});
