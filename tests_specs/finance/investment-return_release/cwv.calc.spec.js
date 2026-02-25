import { test } from '@playwright/test';
import { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';

const ROUTE = '/finance-calculators/investment-return-calculator/';

test.describe('finance/investment-return cwv guard', () => {
  test('calculator route satisfies CLS/LCP thresholds', async ({ page }) => {
    const metrics = await measureRouteCwv(page, ROUTE);
    assertCwv(metrics, ROUTE);
  });
});
