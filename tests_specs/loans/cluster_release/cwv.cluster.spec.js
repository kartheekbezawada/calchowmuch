import { test } from '@playwright/test';
import { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';

const ROUTES = ["/loan-calculators/buy-to-let-mortgage-calculator/","/car-loan-calculators/car-loan-calculator/","/car-loan-calculators/hire-purchase-calculator/"];

test.describe('loans cluster cwv guard', () => {
  test('cluster routes satisfy CLS/LCP thresholds', async ({ page }) => {
    for (const route of ROUTES) {
      const metrics = await measureRouteCwv(page, route);
      assertCwv(metrics, route);
    }
  });
});
