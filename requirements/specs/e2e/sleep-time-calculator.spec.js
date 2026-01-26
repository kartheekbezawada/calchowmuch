import { expect, test } from '@playwright/test';

test.describe('Sleep Time Calculator', () => {
  test('SLEEP-TEST-E2E-1: user journey and recommendations', async ({ page }) => {
    await page.goto('/#/time-and-date/sleep-time-calculator');

    const topNavActive = page.locator('#top-nav button.is-active');
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

  test('SLEEP-TEST-E2E-2: layout stability and content', async ({ page }) => {
    await page.goto('/#/time-and-date/sleep-time-calculator');

    const calcPanel = page.locator('.center-column .panel').first();
    const initialHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);

    await page.locator('#sleep-calculate').click();
    const afterHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(afterHeight - initialHeight)).toBeLessThanOrEqual(1);

    const explanation = page.locator('#sleep-time-explanation');
    await expect(explanation.locator('h2')).toHaveCount(5);
    await expect(explanation).toContainText('What is a Sleep Time Calculator?');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.sleep-faq-item')).toHaveCount(5);
  });
});
