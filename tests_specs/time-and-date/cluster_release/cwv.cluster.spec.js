import { test } from '@playwright/test';
import { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';

const ROUTES = ["/time-and-date/age-calculator/","/time-and-date/birthday-day-of-week/","/time-and-date/countdown-timer-generator/"];

test.describe('time-and-date cluster cwv guard', () => {
  test('cluster routes satisfy CLS/LCP thresholds', async ({ page }) => {
    for (const route of ROUTES) {
      const metrics = await measureRouteCwv(page, route);
      assertCwv(metrics, route);
    }
  });
});
