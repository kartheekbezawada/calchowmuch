import { expect, test } from '@playwright/test';

test.describe('Time Between Two Dates Calculator', () => {
  test('DATE-DIFF-TEST-E2E-1: user journey, validation, results', async ({ page }) => {
    await page.goto('/#/time-and-date/time-between-two-dates-calculator');

    const topNavActive = page.locator('#top-nav button.is-active');
    await expect(topNavActive).toContainText('Time & Date');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Time Between Two Dates Calculator');

    const timeRow = page.locator('#date-diff-time-inputs');
    await expect(timeRow).toHaveClass(/is-collapsed/);

    await page.locator('#date-diff-start-date').fill('2026-01-01');
    await page.locator('#date-diff-end-date').fill('2026-01-31');
    await page.locator('#date-diff-calculate').click();

    const resultsList = page.locator('#date-diff-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);
    await expect(page.locator('[data-result="total-days"] span').last()).toHaveText('30');

    await page.locator('#date-diff-end-date').fill('2025-12-31');
    await page.locator('#date-diff-calculate').click();
    await expect(page.locator('#date-diff-error')).toContainText(
      'End date/time must be after the start date/time.'
    );

    const modeButtons = page.locator('[data-button-group="date-diff-mode"] button');
    await modeButtons.nth(1).click();
    await expect(timeRow).not.toHaveClass(/is-collapsed/);

    await page.locator('#date-diff-start-date').fill('2026-01-01');
    await page.locator('#date-diff-end-date').fill('2026-01-02');
    await page.locator('#date-diff-start-time').fill('08:00');
    await page.locator('#date-diff-end-time').fill('09:30');
    await page.locator('#date-diff-calculate').click();

    await expect(resultsList).not.toHaveClass(/is-hidden/);
    await expect(page.locator('[data-result="total-minutes"] span').last()).toHaveText(/1,?530/);
  });

  test('DATE-DIFF-TEST-E2E-2: layout stability and content', async ({ page }) => {
    await page.goto('/#/time-and-date/time-between-two-dates-calculator');

    const calcPanel = page.locator('.center-column .panel').first();
    const initialHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);

    const modeButtons = page.locator('[data-button-group="date-diff-mode"] button');
    await modeButtons.nth(1).click();
    const afterTimeHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(afterTimeHeight - initialHeight)).toBeLessThanOrEqual(1);

    await modeButtons.first().click();
    const afterDateHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(afterDateHeight - initialHeight)).toBeLessThanOrEqual(1);

    const explanation = page.locator('#date-diff-explanation');
    await expect(explanation.locator('h2')).toHaveCount(6);
    await expect(explanation).toContainText('What is a Time Between Two Dates Calculator?');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.date-diff-faq-item')).toHaveCount(4);
  });
});
