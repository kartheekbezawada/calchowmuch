import { test } from '@playwright/test';
import { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';

const ROUTE = '/loan-calculators/personal-loan-calculator/';

test.describe('loans/personal-loan cwv guard', () => {
  test('calculator route satisfies CLS/LCP thresholds', async ({ page }) => {
    const metrics = await measureRouteCwv(page, ROUTE);
    assertCwv(metrics, ROUTE);
  });
});
