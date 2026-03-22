import { expect, test } from '@playwright/test';

test.describe('Time Between Two Dates Calculator', () => {
  test('DATE-DIFF-TEST-E2E-1: single-pane premium layout and main calculation flow', async ({
    page,
  }) => {
    await page.goto('/time-and-date/time-between-two-dates-calculator/');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('.td-cluster-switch-chip[aria-current="page"]')).toContainText(
      'Time Between Two Dates Calculator'
    );

    await expect(page.locator('#date-diff-headline')).not.toHaveText('');
    await expect(page.locator('.td-preset.is-active')).toContainText('+30 days');

    await page.locator('#date-diff-start-date').fill('2026-01-01');
    await page.locator('#date-diff-end-date').fill('2026-02-01');
    await page.locator('#date-diff-calculate').click();

    await expect(page.locator('#date-diff-headline')).toHaveText('1 month');
    await expect(page.locator('#date-diff-total-days')).toHaveText('31');
    await expect(page.locator('#date-diff-direction')).toContainText('Future interval');
  });

  test('DATE-DIFF-TEST-E2E-2: date-time mode, reverse range, and copy summary', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/time-and-date/time-between-two-dates-calculator/');

    const modeButtons = page.locator('[data-button-group="date-diff-mode"] button');
    await modeButtons.nth(1).click();
    await expect(page.locator('#date-diff-time-inputs')).toBeVisible();

    await page.locator('#date-diff-start-date').fill('2026-01-01');
    await page.locator('#date-diff-end-date').fill('2026-01-02');
    await page.locator('#date-diff-start-time').fill('08:00');
    await page.locator('#date-diff-end-time').fill('09:30');
    await page.locator('#date-diff-calculate').click();

    await expect(page.locator('#date-diff-headline')).toHaveText('1 day, 1 hour, 30 minutes');
    await expect(page.locator('#date-diff-total-minutes')).toHaveText(/1,?530/);

    await page.locator('#date-diff-copy-summary').click();
    await expect(page.locator('#date-diff-copy-feedback')).toContainText('Copied');

    await page.locator('#date-diff-start-date').fill('2026-01-10');
    await page.locator('#date-diff-end-date').fill('2026-01-01');
    await page.locator('#date-diff-start-time').fill('08:00');
    await page.locator('#date-diff-end-time').fill('08:00');
    await page.locator('#date-diff-calculate').click();

    await expect(page.locator('#date-diff-direction')).toHaveText('Past interval');
    await expect(page.locator('#date-diff-error')).toBeHidden();
    await expect(page.locator('#date-diff-summary')).toContainText('Jan 10');
    await expect(page.locator('#date-diff-summary')).toContainText('Jan 1');
  });

  test('DATE-DIFF-TEST-E2E-3: mobile layout stays single-column without overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/time-and-date/time-between-two-dates-calculator/');

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth - overflow.clientWidth).toBeLessThanOrEqual(1);

    const inputBox = await page.locator('.td-input-card').boundingBox();
    const resultBox = await page.locator('.td-result-card').boundingBox();
    const detailsBox = await page.locator('.td-details-grid').boundingBox();
    const explanationBox = await page.locator('#date-diff-explanation').boundingBox();

    expect(inputBox).not.toBeNull();
    expect(resultBox).not.toBeNull();
    expect(detailsBox).not.toBeNull();
    expect(explanationBox).not.toBeNull();

    expect(resultBox.y).toBeGreaterThanOrEqual(inputBox.y + inputBox.height - 1);
    expect(detailsBox.y).toBeGreaterThanOrEqual(resultBox.y + resultBox.height - 1);
    expect(explanationBox.y).toBeGreaterThanOrEqual(detailsBox.y + detailsBox.height - 1);
    await expect(page.locator('#date-diff-explanation h2')).toHaveText(
      'How much time is between two dates?'
    );
  });
});
