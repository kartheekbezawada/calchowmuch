import { test } from '@playwright/test';
import { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';

const ROUTE = '/credit-card-calculators/balance-transfer-credit-card-calculator/';

test.describe('credit-cards/balance-transfer-installment-plan cwv guard', () => {
  test('calculator route satisfies CLS/LCP thresholds', async ({ page }) => {
    const metrics = await measureRouteCwv(page, ROUTE);
    assertCwv(metrics, ROUTE);
  });
});
