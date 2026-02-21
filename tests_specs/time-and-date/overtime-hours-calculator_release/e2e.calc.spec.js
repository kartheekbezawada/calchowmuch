import { expect, test } from '@playwright/test';

test.describe('Overtime Hours Calculator', () => {
  test('OVERTIME-TEST-E2E-1: single shift calculation', async ({ page }) => {
    await page.goto('/time-and-date/overtime-hours-calculator');

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Time & Date');

    const leftActive = page.locator('.fin-nav-item.is-active');
    await expect(leftActive).toContainText('Overtime Hours Calculator');

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

  test('OVERTIME-TEST-E2E-2: input change resets results (UI-2.6)', async ({ page }) => {
    await page.goto('/time-and-date/overtime-hours-calculator');

    await page.locator('#overtime-single-start').fill('09:00');
    await page.locator('#overtime-single-end').fill('17:30');
    await page.locator('#overtime-calculate').click();

    const resultsList = page.locator('#overtime-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);

    await page.locator('#overtime-single-start').fill('10:00');

    await expect(resultsList).toHaveClass(/is-hidden/);
    await expect(page.locator('#overtime-placeholder')).toBeVisible();

    await page.locator('#overtime-calculate').click();
    await expect(resultsList).not.toHaveClass(/is-hidden/);
  });

  test('OVERTIME-TEST-E2E-3: mode switch resets results (UI-2.6)', async ({ page }) => {
    await page.goto('/time-and-date/overtime-hours-calculator');

    await page.locator('#overtime-single-start').fill('09:00');
    await page.locator('#overtime-single-end').fill('17:30');
    await page.locator('#overtime-calculate').click();

    const resultsList = page.locator('#overtime-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);

    await page.locator('[data-button-group="overtime-mode"] button[data-value="split"]').click();

    await expect(resultsList).toHaveClass(/is-hidden/);
    await expect(page.locator('#overtime-placeholder')).toBeVisible();
  });

  test('OVERTIME-TEST-E2E-4: explanation content and FAQs', async ({ page }) => {
    await page.goto('/time-and-date/overtime-hours-calculator');

    const explanation = page.locator('#overtime-explanation');
    await expect(explanation).toContainText('What is an Overtime Hours Calculator?');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.overtime-faq-item')).toHaveCount(10);
  });
});
