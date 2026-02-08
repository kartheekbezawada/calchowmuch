import { expect, test } from '@playwright/test';

test.describe('Sleep Time Calculator', () => {
  test('SLEEP-TEST-E2E-1: user journey and recommendations', async ({ page }) => {
    await page.goto('/time-and-date/sleep-time-calculator');

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Time & Date');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Sleep Time Calculator');

    const modeButtons = page.locator('[data-button-group="sleep-mode"] button');
    await expect(modeButtons.first()).toHaveClass(/is-active/);

    const dateTimeInput = page.locator('#sleep-datetime');
    if (await dateTimeInput.count()) {
      await expect(dateTimeInput).toHaveValue(/T/);
    }

    await page.locator('#sleep-calculate').click();

    const resultsList = page.locator('#sleep-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);
    await expect(resultsList.locator('.sleep-result')).toHaveCount(3);
    await expect(resultsList.locator('.sleep-result.is-primary')).toHaveCount(1);
  });

  test('SLEEP-TEST-E2E-2: mode switch resets results (UI-2.6)', async ({ page }) => {
    await page.goto('/time-and-date/sleep-time-calculator');

    await page.locator('#sleep-calculate').click();
    const resultsList = page.locator('#sleep-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);

    await page.locator('[data-button-group="sleep-mode"] button').nth(1).click();

    await expect(resultsList).toHaveClass(/is-hidden/);
    await expect(page.locator('#sleep-placeholder')).toBeVisible();

    await page.locator('#sleep-calculate').click();
    await expect(resultsList).not.toHaveClass(/is-hidden/);
  });

  test('SLEEP-TEST-E2E-3: input change resets results (UI-2.6)', async ({ page }) => {
    await page.goto('/time-and-date/sleep-time-calculator');

    await page.locator('#sleep-calculate').click();
    const resultsList = page.locator('#sleep-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);

    const dateTimeInput = page.locator('#sleep-datetime');
    if (await dateTimeInput.count()) {
      await dateTimeInput.fill('2026-03-15T07:00');
      await dateTimeInput.dispatchEvent('change');
    }

    await expect(resultsList).toHaveClass(/is-hidden/);
    await expect(page.locator('#sleep-placeholder')).toBeVisible();
  });

  test('SLEEP-TEST-E2E-4: explanation content and FAQs', async ({ page }) => {
    await page.goto('/time-and-date/sleep-time-calculator');

    const explanation = page.locator('#sleep-time-explanation');
    await expect(explanation).toContainText('What is a Sleep Time Calculator?');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.sleep-faq-item')).toHaveCount(10);
  });
});
