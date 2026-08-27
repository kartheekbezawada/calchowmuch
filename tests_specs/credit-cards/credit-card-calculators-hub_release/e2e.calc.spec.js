import { expect, test } from '@playwright/test';

const ROUTE = '/credit-card-calculators/';

const CLUSTER_ROUTES = [
  '/credit-card-calculators/credit-card-minimum-payment-calculator/',
  '/credit-card-calculators/credit-card-payment-calculator/',
  '/credit-card-calculators/balance-transfer-credit-card-calculator/',
  '/credit-card-calculators/credit-card-consolidation-calculator/',
  '/credit-card-calculators/debt-payoff-calculator/',
];

test.describe('Credit Card Calculators hub', () => {
  test('CCHUB-TEST-E2E-1: links to every calculator in the cluster', async ({ page }) => {
    await page.goto(ROUTE);

    for (const route of CLUSTER_ROUTES) {
      await expect(page.locator(`#cc-cluster-hub a[href="${route}"]`).first()).toBeVisible();
    }
  });

  test('CCHUB-TEST-E2E-2: renders as a content shell with no calculator UI', async ({ page }) => {
    await page.goto(ROUTE);

    await expect(page.locator('#cc-cluster-hub')).toBeVisible();
    await expect(page.locator('[id^="calc-cc-"]')).toHaveCount(0);
    await expect(page.locator('input[type="range"]')).toHaveCount(0);
  });

  test('CCHUB-TEST-E2E-3: no horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(ROUTE);

    const hasHorizontalScroll = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth > root.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });
});
