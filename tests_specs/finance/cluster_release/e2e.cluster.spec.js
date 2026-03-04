import { expect, test } from '@playwright/test';

const ROUTES = ["/finance-calculators/compound-interest-calculator/","/finance-calculators/effective-annual-rate-calculator/","/finance-calculators/future-value-of-annuity-calculator/"];

test.describe('finance cluster e2e smoke', () => {
  test('cluster representative routes load and show H1', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      await expect(page.locator('h1').first()).toBeVisible();
    }
  });
});
