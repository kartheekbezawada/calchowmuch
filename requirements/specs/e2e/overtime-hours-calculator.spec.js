import { expect, test } from '@playwright/test';

test.describe('Overtime Hours Calculator', () => {
  test('OVERTIME-TEST-E2E-1: single shift calculation', async ({ page }) => {
    await page.goto('/time-and-date/overtime-hours-calculator');

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Time & Date');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Overtime Hours Calculator');

    await page.locator('#overtime-single-start').fill('09:00');
    await page.locator('#overtime-single-end').fill('17:30');
    await page.locator('#overtime-calculate').click();

    const results = page.locator('#overtime-results-list .result-line');
    await expect(results).toHaveCount(5);
    await expect(results.nth(0)).toContainText('Total worked');
    await expect(results.nth(1)).toContainText('Regular hours');
    await expect(results.nth(2)).toContainText('Overtime hours');
    await expect(results.nth(3)).toContainText('Decimal total');
    await expect(results.nth(4)).toContainText('Rule used');

    await expect(page.locator('[data-placeholder="total-hhmm"]').first()).toContainText('8:00');
  });

  test('OVERTIME-TEST-E2E-2: weekly mode labels and totals', async ({ page }) => {
    await page.goto('/time-and-date/overtime-hours-calculator');

    await page.locator('[data-button-group="overtime-mode"] button[data-value="weekly"]').click();
    await page.locator('[data-button-group="overtime-week-start"] button[data-value="0"]').click();
    await page.locator('#overtime-week-start-date').fill('2026-02-01');

    await page.locator('#overtime-weekly-0-start').fill('08:00');
    await page.locator('#overtime-weekly-0-end').fill('12:00');
    await page.locator('#overtime-calculate').click();

    await expect(page.locator('[data-placeholder="week-range-label"]').first()).toContainText('Sun Feb 1, 2026');
    const results = page.locator('#overtime-results-list');
    await expect(results).toContainText('Sun Feb 1, 2026');
  });
});
