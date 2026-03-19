import { test } from '@playwright/test';
import { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';

const ROUTES = [
  '/car-loan-calculators/car-loan-calculator/',
  '/car-loan-calculators/pcp-calculator/',
  '/car-loan-calculators/car-lease-calculator/',
];

test.describe('auto-loans cluster cwv guard', () => {
  test('cluster routes satisfy CLS/LCP thresholds', async ({ page }) => {
    for (const route of ROUTES) {
      const metrics = await measureRouteCwv(page, route);
      assertCwv(metrics, route);
    }
  });
});
