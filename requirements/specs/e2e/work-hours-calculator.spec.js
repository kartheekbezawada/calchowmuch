import { expect, test } from '@playwright/test';

test.describe('Work Hours Calculator', () => {
  test('WORK-HOURS-TEST-E2E-1: single shift calculation', async ({ page }) => {
    await page.goto('/time-and-date/work-hours-calculator');

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Time & Date');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Work Hours Calculator');

    await page.locator('#work-hours-single-start').fill('09:00');
    await page.locator('#work-hours-single-end').fill('17:30');
    await page.locator('#work-hours-calculate').click();

    const results = page.locator('#work-hours-results-list .result-row');
    await expect(results).toHaveCount(3);
    await expect(results.nth(0)).toContainText('Total worked time');
    await expect(results.nth(1)).toContainText('Total hours (decimal)');
    await expect(results.nth(2)).toContainText('Total break deducted');
  });

  test('WORK-HOURS-TEST-E2E-2: weekly totals with daily lines', async ({ page }) => {
    await page.goto('/time-and-date/work-hours-calculator');

    await page.locator('[data-button-group="work-hours-mode"] button[data-value="weekly"]').click();
    await page.locator('#work-hours-weekly-mon-start').fill('08:00');
    await page.locator('#work-hours-weekly-mon-end').fill('12:00');
    await page.locator('#work-hours-calculate').click();

    const results = page.locator('#work-hours-results-list');
    await expect(results).toContainText('Mon:');
  });
});
