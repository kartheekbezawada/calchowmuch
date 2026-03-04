import { test } from '@playwright/test';
import { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';

const ROUTES = ["/finance-calculators/compound-interest-calculator/","/finance-calculators/effective-annual-rate-calculator/","/finance-calculators/future-value-of-annuity-calculator/"];

test.describe('finance cluster cwv guard', () => {
  test('cluster routes satisfy CLS/LCP thresholds', async ({ page }) => {
    for (const route of ROUTES) {
      const metrics = await measureRouteCwv(page, route);
      assertCwv(metrics, route);
    }
  });
});
