import { expect, test } from '@playwright/test';

test.describe('Birthday Day-of-Week Calculator', () => {
  test('BIRTHDAY-DOW-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/time-and-date/birthday-day-of-week');

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Time & Date');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Birthday Day-of-Week');

    await page.locator('#birthday-dow-dob').fill('1990-06-15');
    await page.locator('#birthday-dow-year').fill('2025');
    await page.locator('#birthday-dow-calculate').click();

    const results = page.locator('#birthday-dow-results-list .result-row');
    await expect(results).toHaveCount(2);
    await expect(results.nth(0)).toContainText('You were born on:');
    await expect(results.nth(1)).toContainText('In 2025, your birthday falls on:');
  });

  test('BIRTHDAY-DOW-TEST-E2E-2: leap-year handling', async ({ page }) => {
    await page.goto('/time-and-date/birthday-day-of-week');

    await page.locator('#birthday-dow-dob').fill('2000-02-29');
    await page.locator('#birthday-dow-year').fill('2021');
    await page.locator('#birthday-dow-calculate').click();

    const results = page.locator('#birthday-dow-results-list');
    await expect(results).toContainText('In 2021, your birthday falls on:');
    await expect(results).toContainText('Sunday');
  });
});
