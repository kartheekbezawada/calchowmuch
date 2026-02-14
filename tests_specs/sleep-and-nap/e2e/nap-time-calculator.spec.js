import { expect, test } from '@playwright/test';

test.describe('Nap Time Calculator', () => {
  test('NAP-TEST-E2E-1: user journey and outputs', async ({ page }) => {
    await page.goto('/time-and-date/nap-time-calculator');

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Time & Date');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Nap Time Calculator');

    const napTypeButtons = page.locator('[data-button-group="nap-type"] button');
    await expect(napTypeButtons.nth(1)).toHaveClass(/is-active/);

    await page.locator('#nap-start-time').fill('13:00');
    await page.locator('[data-button-group="nap-buffer"] button[data-value="10"]').click();
    await page.locator('#nap-calculate').click();

    const results = page.locator('#nap-results-list .result-row');
    await expect(results).toHaveCount(3);
    await expect(results.nth(0)).toContainText('Recommended wake-up time');
    await expect(results.nth(1)).toContainText('Nap length (excluding buffer)');
    await expect(results.nth(2)).toContainText('Buffer applied');

    const baselineWakeTime = (await results.nth(0).textContent()) ?? '';
    await page.locator('#nap-start-time').fill('14:00');
    await page.locator('[data-button-group="nap-type"] button[data-value="quick"]').click();
    await page.locator('[data-button-group="nap-buffer"] button[data-value="0"]').click();

    await expect(page.locator('#nap-results-list')).toBeHidden();
    await expect(page.locator('#nap-placeholder')).toBeVisible();

    await page.locator('#nap-calculate').click();
    await expect(page.locator('#nap-results-list')).toBeVisible();
    await expect(results.nth(0)).not.toHaveText(baselineWakeTime);
  });

  test('NAP-TEST-E2E-2: explanation content and FAQs', async ({ page }) => {
    await page.goto('/time-and-date/nap-time-calculator');

    const explanation = page.locator('#nap-time-explanation');
    await expect(explanation).toContainText('What is a Nap Time Calculator?');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.nap-faq-item')).toHaveCount(5);
  });
});
