import { expect, test } from '@playwright/test';

test.describe('Power Nap Calculator', () => {
  test('POWER-NAP-TEST-E2E-1: user journey and outputs', async ({ page }) => {
    await page.goto('/time-and-date/power-nap-calculator');

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Time & Date');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Power Nap Calculator');

    await page.locator('#power-nap-start-time').fill('13:00');
    await page.locator('#power-nap-calculate').click();

    const results = page.locator('#power-nap-results-list .result-row');
    await expect(results).toHaveCount(5);
    await expect(results.nth(0)).toContainText('Micro Nap (10 min)');
    await expect(results.nth(1)).toContainText('Power Nap (20 min)');
    await expect(results.nth(2)).toContainText('Power Nap (30 min)');
    await expect(results.nth(3)).toContainText('Recovery Nap (60 min)');
    await expect(results.nth(4)).toContainText('Full Cycle (90 min)');

    const recommended = page.locator('#power-nap-results-list .result-row.is-recommended');
    await expect(recommended).toHaveCount(2);

    await page.locator('#power-nap-start-time').fill('14:00');
    await expect(page.locator('#power-nap-results-list')).toBeHidden();
    await expect(page.locator('#power-nap-placeholder')).toBeVisible();

    await page.locator('#power-nap-calculate').click();
    await expect(page.locator('#power-nap-results-list')).toBeVisible();
  });

  test('POWER-NAP-TEST-E2E-2: explanation content and FAQs', async ({ page }) => {
    await page.goto('/time-and-date/power-nap-calculator');

    const explanation = page.locator('#power-nap-explanation');
    await expect(explanation).toContainText('What is a Power Nap Calculator?');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.power-nap-faq-item')).toHaveCount(10);
  });

  test('POWER-NAP-TEST-E2E-3: evening warning for late start', async ({ page }) => {
    await page.goto('/time-and-date/power-nap-calculator');

    await page.locator('#power-nap-start-time').fill('19:00');
    await page.locator('#power-nap-calculate').click();

    const warning = page.locator('#power-nap-warning');
    await expect(warning).toBeVisible();
    await expect(warning).toContainText('Long naps in the evening');
  });
});
