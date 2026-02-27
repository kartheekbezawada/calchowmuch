import { test } from '@playwright/test';
import { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';

const ROUTE = '/loan-calculators/remortgage-calculator/';

test.describe('loans/remortgage-switching cwv guard', () => {
  test('calculator route satisfies CLS/LCP thresholds', async ({ page }) => {
    const metrics = await measureRouteCwv(page, ROUTE);
    assertCwv(metrics, ROUTE);
  });
});
