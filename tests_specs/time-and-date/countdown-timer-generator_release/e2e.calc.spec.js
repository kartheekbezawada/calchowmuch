import { expect, test } from '@playwright/test';

test.describe('Countdown Timer', () => {
  test('COUNTDOWN-TEST-E2E-1: builder flow, static region events, and live preview', async ({ page }) => {
    await page.goto('/time-and-date/countdown-timer/');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('.td-cluster-switch-chip[aria-current="page"]')).toContainText(
      'Countdown Timer Generator'
    );

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      'Create a live countdown timer for birthdays, launches, trips, deadlines, and holidays. Set a future date, track time left, and add the event to your calendar.'
    );

    await page.locator('#countdown-region').selectOption('United Kingdom');
    await page.locator('#countdown-region-event').selectOption('uk-guy-fawkes-night');

    await expect(page.locator('#countdown-event-name')).toHaveValue('Guy Fawkes Night');
    await expect(page.locator('#countdown-date')).toHaveValue('2026-11-05');
    await expect(page.locator('#countdown-time')).toHaveValue('19:00');
    await page.locator('#countdown-start').click();

    await expect(page.locator('#countdown-preview-title')).toHaveText('Guy Fawkes Night');
    await expect(page.locator('#countdown-preview-card')).toHaveAttribute('data-theme', 'launch');
    await expect(page.locator('#countdown-preview-heading')).toHaveText('Counting down to');
    await expect(page.locator('#countdown-status')).toContainText('Live updates Every Second');
    await expect(page.locator('#countdown-actions')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#countdown-add-google')).toBeVisible();
    await expect(page.locator('#countdown-add-outlook')).toBeVisible();
    await expect(page.locator('#countdown-download-ics')).toBeVisible();
    await expect(page.locator('#countdown-generate-share-card')).toBeVisible();
    await expect(page.locator('#countdown-download-share-png')).toBeVisible();
    await expect(page.locator('#countdown-copy-share-image')).toBeVisible();
    await page.locator('#countdown-generate-share-card').click();
    await expect(page.locator('#countdown-copy-feedback')).toContainText('Share card generated.');
    await expect(page.locator('#countdown-milestones .countdown-milestone')).toHaveCount(4);
  });

  test('COUNTDOWN-TEST-E2E-2: explanation contract and share actions state', async ({ page }) => {
    await page.goto('/time-and-date/countdown-timer/');

    await expect(page.locator('#countdown-preview-card')).toHaveClass(/is-hidden/);
    await expect(page.locator('#countdown-actions')).toHaveClass(/is-hidden/);

    await page.locator('#countdown-event-name').fill('Launch day');
    await page.locator('#countdown-date').fill('2026-12-01');
    await page.locator('#countdown-time').fill('10:30');
    await page.locator('#countdown-start').click();

    await expect(page.locator('#countdown-preview-card')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#countdown-actions')).not.toHaveClass(/is-hidden/);

    const explanation = page.locator('#countdown-explanation');
    await expect(explanation.locator('h2')).toHaveCount(1);
    await expect(explanation.locator('h2')).toHaveText('How long until an event starts?');
    await expect(explanation.locator('h3')).toHaveCount(3);
    await expect(explanation).toContainText('How to Guide');
    await expect(explanation).toContainText('FAQ');
    await expect(explanation).toContainText('Important Notes');
    await expect(explanation).toContainText('Last updated: March 2026');
    await expect(explanation.locator('.countdown-faq-item')).toHaveCount(4);
    await expect(explanation.locator('.countdown-notes li')).toHaveCount(5);
    await expect(explanation).toContainText('All calculations run locally in your browser - no data is stored.');
  });

  test('COUNTDOWN-TEST-E2E-3: mobile layout stays single-column without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/time-and-date/countdown-timer/');

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth - overflow.clientWidth).toBeLessThanOrEqual(1);

    const builderBox = await page.locator('.cd-input-card').boundingBox();
    const previewBox = await page.locator('.cd-countdown-card').boundingBox();
    const explanationBox = await page.locator('#countdown-explanation').boundingBox();

    expect(builderBox).not.toBeNull();
    expect(previewBox).not.toBeNull();
    expect(explanationBox).not.toBeNull();

    expect(previewBox.y).toBeGreaterThanOrEqual(builderBox.y + builderBox.height - 1);
    expect(explanationBox.y).toBeGreaterThanOrEqual(previewBox.y + previewBox.height - 1);
    await expect(page.locator('#countdown-explanation h2')).toHaveText('How long until an event starts?');
  });
});
