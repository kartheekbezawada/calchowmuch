import { test } from '@playwright/test';
import { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';

const ROUTES = [
  '/pricing-calculators/commission-calculator/',
  '/pricing-calculators/discount-calculator/',
  '/pricing-calculators/margin-calculator/',
  '/pricing-calculators/markup-calculator/',
];

test.describe('pricing cluster cwv guard', () => {
  test('cluster routes satisfy CLS/LCP thresholds', async ({ page }) => {
    for (const route of ROUTES) {
      const metrics = await measureRouteCwv(page, route);
      assertCwv(metrics, route);
    }
  });
});
