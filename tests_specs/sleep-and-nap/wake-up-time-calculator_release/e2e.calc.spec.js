import { expect, test } from '@playwright/test';

test.describe('Wake-Up Time Calculator', () => {
  test.describe.configure({ mode: 'serial' });

  test('WAKEUP-TEST-E2E-1: user journey and recommendations', async ({ page }) => {
    await page.goto('/time-and-date/wake-up-time-calculator/');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('.td-cluster-switch-chip[aria-current="page"]')).toContainText(
      'Wake-Up Time Calculator'
    );

    const modeButtons = page.locator('[data-button-group="wake-mode"] button');
    await expect(modeButtons.first()).toHaveClass(/is-active/);

    await expect(page.locator('#wake-datetime')).toHaveCount(0);
    await expect(page.locator('#wake-fallback')).toHaveCount(0);

    const resultsList = page.locator('#wake-results-list');
    await expect(resultsList.locator('.wake-result')).toHaveCount(3);
    await expect(resultsList.locator('.wake-result.is-primary')).toHaveCount(1);

    const firstBefore = await resultsList.locator('.wake-result-time').first().textContent();

    await page.locator('#wake-calculate').click();
    await expect(resultsList.locator('.wake-result')).toHaveCount(3);

    await modeButtons.nth(1).click();
    const firstAfterModeOnly = await resultsList.locator('.wake-result-time').first().textContent();
    expect(firstAfterModeOnly).toBe(firstBefore);

    await page.locator('#wake-calculate').click();
    const firstAfterCalc = await resultsList.locator('.wake-result-time').first().textContent();
    expect(firstAfterCalc).not.toBe(firstBefore);
  });

  test('WAKEUP-TEST-E2E-1B: left nav includes nap calculator links and navigation works', async ({
    page,
  }) => {
    await page.goto('/time-and-date/wake-up-time-calculator/');

    const powerNapLink = page.locator(
      '.td-route-switch a[href="/time-and-date/power-nap-calculator/"]'
    );
    const energyNapLink = page.locator(
      '.td-route-switch a[href="/time-and-date/energy-based-nap-selector/"]'
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
      page.locator('.td-route-switch a[href="/time-and-date/energy-based-nap-selector/"]').click(),
    ]);
    await expect(page.locator('.td-cluster-switch-chip[aria-current="page"]')).toContainText(
      'Energy-Based Nap Selector'
    );
  });

  test('WAKEUP-TEST-E2E-1C: route switch inventory stays intact', async ({
    page,
  }) => {
    await page.goto('/time-and-date/wake-up-time-calculator/');

    const switcher = page.locator('.td-route-switch');
    await expect(switcher).toHaveCount(1);
    await expect(switcher).toContainText([
      'Sleep Time Calculator',
      'Wake-Up Time Calculator',
      'Nap Time Calculator',
      'Power Nap Calculator',
      'Energy-Based Nap Selector',
      'Work Hours Calculator',
      'Overtime Hours Calculator',
      'Time Between Two Dates Calculator',
      'Days Until a Date Calculator',
      'Countdown Timer Generator',
      'Age Calculator',
      'Birthday Day-of-Week',
    ]);
    await expect(page.locator('.td-cluster-switch-chip[aria-current="page"]')).toContainText(
      'Wake-Up Time Calculator'
    );
  });

  test('WAKEUP-TEST-E2E-2: calculate-only updates and explanation content', async ({ page }) => {
    await page.goto('/time-and-date/wake-up-time-calculator/');

    const resultsList = page.locator('#wake-results-list');
    const firstResultBefore = await resultsList.locator('.wake-result-time').first().textContent();

    const timeInput = page.locator('#wake-time-primary');
    await timeInput.fill('23:15');
    await timeInput.dispatchEvent('change');

    const firstAfterInputOnly = await resultsList.locator('.wake-result-time').first().textContent();
    expect(firstAfterInputOnly).toBe(firstResultBefore);

    await page.locator('#wake-calculate').click();
    const firstAfterCalculate = await resultsList.locator('.wake-result-time').first().textContent();
    expect(firstAfterCalculate).not.toBe(firstResultBefore);

    const explanation = page.locator('#wake-up-explanation');
    await expect(explanation.locator('h2')).toHaveCount(1);
    await expect(explanation.locator('h2')).toHaveText(
      'When should you wake up from this bedtime or fall-asleep time?'
    );
    await expect(explanation.locator('h3')).toHaveCount(3);
    await expect(explanation).toContainText('How to Guide');
    await expect(explanation).toContainText('FAQ');
    await expect(explanation).toContainText('Important Notes');
    await expect(explanation.locator('.wake-faq-item')).toHaveCount(10);
    await expect(explanation.locator('.wake-notes li')).toHaveCount(5);
    await expect(explanation).toContainText('All calculations run locally in your browser - no data is stored.');
  });
});
