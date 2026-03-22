import { expect, test } from '@playwright/test';

test.describe('Nap Time Calculator', () => {
  test.describe.configure({ mode: 'serial' });

  test('NAP-TEST-E2E-1: user journey and outputs', async ({ page }) => {
    await page.goto('/time-and-date/nap-time-calculator/');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('.td-cluster-switch-chip[aria-current="page"]')).toContainText(
      'Nap Time Calculator'
    );

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
    await page.goto('/time-and-date/nap-time-calculator/');

    const explanation = page.locator('#nap-time-explanation');
    await expect(explanation.locator('.nap-explanation-card h2')).toHaveCount(1);
    await expect(explanation.locator('.nap-explanation-card h2')).toHaveText('When should you wake up from this nap?');
    await expect(explanation.locator('.nap-explanation-card h3')).toHaveCount(3);
    await expect(explanation).toContainText('How to use it');
    await expect(explanation).toContainText('FAQ');
    await expect(explanation).toContainText('Important Notes');
    await expect(explanation.locator('.nap-faq-item')).toHaveCount(5);
    await expect(explanation.locator('.nap-notes li')).toHaveCount(5);
    await expect(explanation).toContainText('All calculations run locally in your browser - no data is stored.');
  });
});
