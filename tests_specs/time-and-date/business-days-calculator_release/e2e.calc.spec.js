import { expect, test } from '@playwright/test';

test.describe('Business Days Calculator', () => {
  test('BUSINESS-DAYS-E2E-1: single-pane layout and between-dates flow', async ({ page }) => {
    await page.goto('/time-and-date/business-days-calculator/');

    await expect(page.locator('.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText('Business Days Calculator');

    await page.locator('#business-days-start-date').fill('2026-04-06');
    await page.locator('#business-days-end-date').fill('2026-04-17');
    await page.locator('#business-days-calculate').click();

    await expect(page.locator('#business-days-headline')).toContainText('10 business days');
    await expect(page.locator('#business-days-summary-grid .bd-summary-card')).toHaveCount(3);
    await expect(page.locator('#business-days-rules-chip')).toContainText('Mon-Fri');
  });

  test('BUSINESS-DAYS-E2E-2: shift mode, copy summary, and calendar export', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/time-and-date/business-days-calculator/');

    await page.locator('[data-mode="shift"]').click();
    await page.locator('#business-days-start-date').fill('2026-12-29');
    await page.locator('#business-days-offset').fill('-2');
    await page.locator('[data-holiday="uk"]').click();
    await page.locator('#business-days-calculate').click();

    await expect(page.locator('#business-days-headline')).toContainText('Wed, 23 Dec 2026');
    await page.locator('#business-days-copy-summary').click();
    await expect(page.locator('#business-days-copy-feedback')).toContainText('Copied');
    const exportLink = page.locator('#business-days-export-calendar');
    await expect(exportLink).toHaveAttribute('href', /^blob:/);
  });

  test('BUSINESS-DAYS-E2E-3: mobile layout stays within viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/time-and-date/business-days-calculator/');

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth - overflow.clientWidth).toBeLessThanOrEqual(1);

    await expect(page.locator('#business-days-explanation')).toContainText('How to Guide');
    await expect(page.locator('.bd-related-chip')).toHaveCount(3);
  });
});
