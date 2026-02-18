import { test } from '@playwright/test';
import { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';

const ROUTES = ["/time-and-date/energy-based-nap-selector/","/time-and-date/nap-time-calculator/","/time-and-date/power-nap-calculator/"];

test.describe('sleep-and-nap cluster cwv guard', () => {
  test('cluster routes satisfy CLS/LCP thresholds', async ({ page }) => {
    for (const route of ROUTES) {
      const metrics = await measureRouteCwv(page, route);
      assertCwv(metrics, route);
    }
  });
});
