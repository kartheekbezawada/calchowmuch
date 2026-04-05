import { expect, test } from '@playwright/test';

const ROUTES = ["/time-and-date/age-calculator/","/time-and-date/birthday-day-of-week/","/time-and-date/countdown-timer/"];

test.describe('time-and-date cluster e2e smoke', () => {
  test('cluster representative routes load and show H1', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      await expect(page.locator('h1').first()).toBeVisible();
    }
  });
});
