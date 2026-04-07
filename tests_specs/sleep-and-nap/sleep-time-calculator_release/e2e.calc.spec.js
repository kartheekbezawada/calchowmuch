import { expect, test } from '@playwright/test';

test.describe('Sleep Time Calculator', () => {
  test.describe.configure({ mode: 'serial' });

  test('SLEEP-TEST-E2E-1: user journey and recommendations', async ({ page }) => {
    await page.goto('/time-and-date/sleep-time-calculator/');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('.td-cluster-switch-chip[aria-current="page"]')).toContainText(
      'Sleep Time Calculator'
    );

    const modeButtons = page.locator('[data-button-group="sleep-mode"] button');
    await expect(modeButtons.first()).toHaveClass(/is-active/);

    const resultsList = page.locator('#sleep-results-list');
    await expect(resultsList.locator('.sleep-result')).toHaveCount(3);
    await expect(resultsList.locator('.sleep-result.is-primary')).toHaveCount(1);

    await page.locator('#sleep-calculate').click();

    await expect(resultsList).not.toHaveClass(/is-hidden/);
    await expect(resultsList.locator('.sleep-result')).toHaveCount(3);
    await expect(resultsList.locator('.sleep-result.is-primary')).toHaveCount(1);
  });

  test('SLEEP-TEST-E2E-1B: left nav includes nap calculator links and navigation works', async ({
    page,
  }) => {
    await page.goto('/time-and-date/sleep-time-calculator/');

    const powerNapLink = page.locator(
      '.td-cluster-route-switch a[href="/time-and-date/power-nap-calculator/"]'
    );
    const energyNapLink = page.locator(
      '.td-cluster-route-switch a[href="/time-and-date/energy-based-nap-selector/"]'
    );

    await expect(powerNapLink).toBeVisible();
    await expect(powerNapLink).toContainText('Power Nap Calculator');
    await expect(energyNapLink).toBeVisible();
    await expect(energyNapLink).toContainText('Energy-Based Nap Selector');

    await Promise.all([
      page.waitForURL('**/time-and-date/power-nap-calculator/'),
      powerNapLink.click(),
    ]);
    await expect(page.locator('.td-cluster-switch-chip[aria-current="page"]')).toContainText(
      'Power Nap Calculator'
    );

    await Promise.all([
      page.waitForURL('**/time-and-date/energy-based-nap-selector/'),
      page.locator('.td-cluster-route-switch a[href="/time-and-date/energy-based-nap-selector/"]').click(),
    ]);
    await expect(page.locator('.td-cluster-switch-chip[aria-current="page"]')).toContainText(
      'Energy-Based Nap Selector'
    );
  });

  test('SLEEP-TEST-E2E-2: mode switch resets results (UI-2.6)', async ({ page }) => {
    await page.goto('/time-and-date/sleep-time-calculator/');

    const resultsList = page.locator('#sleep-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);
    const firstResultBefore = await resultsList.locator('.sleep-result-time').first().textContent();

    await page.locator('[data-button-group="sleep-mode"] button').nth(1).click();
    await expect(resultsList).not.toHaveClass(/is-hidden/);

    await page.locator('#sleep-calculate').click();
    await expect(resultsList).not.toHaveClass(/is-hidden/);
    await expect(resultsList.locator('.sleep-result')).toHaveCount(3);
    const firstResultAfter = await resultsList.locator('.sleep-result-time').first().textContent();
    expect(firstResultAfter).not.toBe(firstResultBefore);
  });

  test('SLEEP-TEST-E2E-3: input change resets results (UI-2.6)', async ({ page }) => {
    await page.goto('/time-and-date/sleep-time-calculator/');

    const resultsList = page.locator('#sleep-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);
    const firstResultBefore = await resultsList.locator('.sleep-result-time').first().textContent();

    const timeInput = page.locator('#sleep-time-primary');
    await timeInput.fill('23:15');
    await timeInput.dispatchEvent('change');

    const firstResultAfterInputOnly = await resultsList.locator('.sleep-result-time').first().textContent();
    expect(firstResultAfterInputOnly).toBe(firstResultBefore);

    await page.locator('#sleep-calculate').click();
    const firstResultAfterCalculate = await resultsList.locator('.sleep-result-time').first().textContent();
    expect(firstResultAfterCalculate).not.toBe(firstResultBefore);
  });

  test('SLEEP-TEST-E2E-4: explanation content and FAQs', async ({ page }) => {
    await page.goto('/time-and-date/sleep-time-calculator/');

    const explanation = page.locator('#sleep-time-explanation');
    await expect(explanation.locator('.sleep-explanation-card h2')).toHaveCount(1);
    await expect(explanation.locator('.sleep-explanation-card h2')).toHaveText(
      'When should you go to sleep or wake up?'
    );
    await expect(explanation.locator('.sleep-explanation-card h3')).toHaveCount(4);
    await expect(explanation).toContainText('How to Guide');
    await expect(explanation).toContainText('FAQ');
    await expect(explanation).toContainText('Important Notes');
    await expect(explanation.locator('.sleep-faq-item')).toHaveCount(10);
    await expect(explanation.locator('.sleep-explanation-card:last-child .sleep-notes li')).toHaveCount(5);
    await expect(explanation).toContainText('All calculations run locally in your browser - no data is stored.');
  });
});
