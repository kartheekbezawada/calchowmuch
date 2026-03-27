import { test } from '@playwright/test';
import { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';
import { SALARY_CALCULATOR_CONFIGS, SALARY_HUB_ROUTE } from '../shared/config.js';

const ROUTES = [SALARY_HUB_ROUTE, ...Object.values(SALARY_CALCULATOR_CONFIGS).map((config) => config.route)];

test.describe('salary cluster cwv guard', () => {
  test('cluster routes satisfy CLS/LCP thresholds', async ({ page }) => {
    for (const route of ROUTES) {
      const metrics = await measureRouteCwv(page, route);
      assertCwv(metrics, route);
    }
  });
});
