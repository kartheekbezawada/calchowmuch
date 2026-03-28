import { test } from '@playwright/test';
import { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';

const ROUTES = [
  '/percentage-calculators/percent-change-calculator/',
  '/percentage-calculators/percentage-increase-calculator/',
  '/percentage-calculators/percentage-composition-calculator/',
];

test.describe('percentage cluster cwv guard', () => {
  test('cluster routes satisfy CLS/LCP thresholds', async ({ page }) => {
    for (const route of ROUTES) {
      const metrics = await measureRouteCwv(page, route);
      assertCwv(metrics, route);
    }
  });
});
