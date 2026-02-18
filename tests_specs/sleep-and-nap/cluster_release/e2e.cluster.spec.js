import { expect, test } from '@playwright/test';

const ROUTES = ["/time-and-date/energy-based-nap-selector/","/time-and-date/nap-time-calculator/","/time-and-date/power-nap-calculator/"];

test.describe('sleep-and-nap cluster e2e smoke', () => {
  test('cluster representative routes load and show H1', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      await expect(page.locator('h1').first()).toBeVisible();
    }
  });
});
