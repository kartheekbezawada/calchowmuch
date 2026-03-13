import { expect, test } from '@playwright/test';

test.describe('Nap Time Calculator', () => {
  test.describe.configure({ mode: 'serial' });

  test('NAP-TEST-E2E-1: user journey and outputs', async ({ page }) => {
    await page.goto('/time-and-date/nap-time-calculator');

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Time & Date');

    const leftActive = page.locator('.fin-nav-item.is-active');
    await expect(leftActive).toContainText('Nap Time Calculator');

    const napTypeButtons = page.locator('[data-button-group="nap-type"] button');
    await expect(napTypeButtons.nth(1)).toHaveClass(/is-active/);

    const results = page.locator('#nap-results-list .result-row');
    await expect(results).toHaveCount(3);
    await expect(results.nth(0)).toContainText('Recommended wake-up time');

    const baselineWakeTime = (await results.nth(0).textContent()) ?? '';

    await page.locator('#nap-start-time').fill('14:00');
    await page.locator('[data-button-group="nap-type"] button[data-value="quick"]').click();
    await page.locator('[data-button-group="nap-buffer"] button[data-value="0"]').click();

    const firstAfterInputOnly = (await results.nth(0).textContent()) ?? '';
    expect(firstAfterInputOnly).toBe(baselineWakeTime);

    await page.locator('#nap-calculate').click();
    await expect(results).toHaveCount(3);
    await expect(results.nth(0)).not.toHaveText(baselineWakeTime);
  });

  test('NAP-TEST-E2E-2: explanation content and FAQs', async ({ page }) => {
    await page.goto('/time-and-date/nap-time-calculator');

    const explanation = page.locator('#nap-time-explanation');
    await expect(explanation).toContainText('When Should You Wake Up From a Nap?');
    await expect(explanation).toContainText('Which nap is best for work breaks?');
    await expect(explanation.locator('.nap-faq-item')).toHaveCount(5);
  });
});
