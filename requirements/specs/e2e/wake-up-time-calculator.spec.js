import { expect, test } from '@playwright/test';

test.describe('Wake-Up Time Calculator', () => {
  test('WAKEUP-TEST-E2E-1: user journey and recommendations', async ({ page }) => {
    await page.goto('/#/time-and-date/wake-up-time-calculator');

    const topNavActive = page.locator('#top-nav button.is-active');
    await expect(topNavActive).toContainText('Time & Date');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Wake-Up Time Calculator');

    const modeButtons = page.locator('[data-button-group="wake-mode"] button');
    await expect(modeButtons.first()).toHaveClass(/is-active/);

    const latencyRow = page.locator('#wake-latency-row');
    await expect(latencyRow).toHaveClass(/is-collapsed/);

    const dateTimeInput = page.locator('#wake-datetime');
    if (await dateTimeInput.count()) {
      await expect(dateTimeInput).toHaveValue(/T/);
    }

    await page.locator('#wake-calculate').click();

    const resultsList = page.locator('#wake-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);
    await expect(resultsList.locator('.wake-result')).toHaveCount(3);
    await expect(resultsList.locator('.wake-result.is-primary')).toHaveCount(1);
    await expect(resultsList.locator('.wake-result').first()).toContainText('Wake up at');

    await modeButtons.nth(1).click();
    await expect(latencyRow).not.toHaveClass(/is-collapsed/);
    await expect(page.locator('#wake-latency')).toBeEnabled();
  });

  test('WAKEUP-TEST-E2E-2: layout stability and content', async ({ page }) => {
    await page.goto('/#/time-and-date/wake-up-time-calculator');

    const calcPanel = page.locator('.center-column .panel').first();
    const initialHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);

    const modeButtons = page.locator('[data-button-group="wake-mode"] button');
    await modeButtons.nth(1).click();
    const afterBedHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(afterBedHeight - initialHeight)).toBeLessThanOrEqual(1);

    await modeButtons.first().click();
    const afterSleepHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(afterSleepHeight - initialHeight)).toBeLessThanOrEqual(1);

    const explanation = page.locator('#wake-up-explanation');
    await expect(explanation.locator('h2')).toHaveCount(5);
    await expect(explanation).toContainText('What is a Wake-Up Time Calculator?');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.wake-faq-item')).toHaveCount(5);
  });
});
