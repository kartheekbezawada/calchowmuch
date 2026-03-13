import { expect, test } from '@playwright/test';

test.describe('Energy-Based Nap Selector', () => {
  test('ENAP-TEST-E2E-1: route journey and deterministic behavior', async ({ page }) => {
    await page.goto('/time-and-date/energy-based-nap-selector');

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Time & Date');

    const leftActive = page.locator('.fin-nav-item.is-active');
    await expect(leftActive).toContainText('Energy-Based Nap Selector');

    await expect(page.locator('select')).toHaveCount(0);

    const goalButtons = page.locator('[data-button-group="energy-goal"] button');
    await expect(goalButtons).toHaveCount(3);
    await expect(goalButtons.nth(2)).toHaveClass(/is-active/);

    await page.locator('#energy-nap-start-time').fill('23:30');
    await page.locator('#energy-nap-calculate').click();

    await expect(page.locator('#energy-nap-primary')).toContainText('25 min');
    await expect(page.locator('#energy-nap-warning')).toContainText('downgraded');

    await page.locator('[data-button-group="energy-goal"] button[data-value="full"]').click();
    await page.locator('#energy-nap-calculate').click();
    await expect(page.locator('#energy-nap-primary')).toContainText('90 min');
    await expect(page.locator('#energy-nap-warning')).toContainText('90-minute');

    const beforeEdit = (await page.locator('#energy-nap-primary').innerText()).trim();
    await page.locator('#energy-nap-start-time').fill('13:00');
    await expect(page.locator('#energy-nap-primary')).toHaveClass(/is-hidden/);
    await expect(page.locator('#energy-nap-placeholder')).toBeVisible();

    await page.locator('#energy-nap-calculate').click();
    await expect(page.locator('#energy-nap-primary')).toBeVisible();
    await expect(page.locator('#energy-nap-primary')).not.toHaveText(beforeEdit);
  });

  test('ENAP-TEST-E2E-2: explanation pane and FAQ count', async ({ page }) => {
    await page.goto('/time-and-date/energy-based-nap-selector');

    const explanation = page.locator('#energy-nap-explanation');
    await expect(explanation).toContainText('Which Nap Length Matches the Energy You Need?');
    await expect(explanation).toContainText('How to Guide');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.faq-box')).toHaveCount(10);
  });

  test('ENAP-TEST-E2E-3: primary recommendation keeps dark-row styling with readable text', async ({
    page,
  }) => {
    await page.goto('/time-and-date/energy-based-nap-selector');

    await page.locator('#energy-nap-start-time').fill('23:30');
    await page.locator('#energy-nap-calculate').click();

    const primaryCard = page.locator('#energy-nap-primary');
    await expect(primaryCard).toBeVisible();

    const primaryBackground = await primaryCard.evaluate((card) => getComputedStyle(card).backgroundColor);
    const headingColor = await primaryCard
      .locator('h4')
      .evaluate((heading) => getComputedStyle(heading).color);
    const metricsColor = await primaryCard
      .locator('.energy-primary-metrics')
      .evaluate((metrics) => getComputedStyle(metrics).color);
    const reasonColor = await primaryCard
      .locator('.energy-primary-reason')
      .evaluate((reason) => getComputedStyle(reason).color);

    expect(primaryBackground).toBe('rgb(15, 23, 42)');
    expect(primaryBackground).not.toBe('rgb(240, 253, 244)');
    expect(headingColor).not.toBe(primaryBackground);
    expect(metricsColor).not.toBe(primaryBackground);
    expect(reasonColor).not.toBe('rgb(20, 83, 45)');
  });
});
