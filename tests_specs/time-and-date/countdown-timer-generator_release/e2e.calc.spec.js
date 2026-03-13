import { expect, test } from '@playwright/test';

test.describe('Countdown Timer Generator', () => {
  test('COUNTDOWN-TEST-E2E-1: builder flow, static region events, and live preview', async ({ page }) => {
    await page.goto('/time-and-date/countdown-timer-generator');

    await expect(page.locator('.panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Time & Date');

    const leftActive = page.locator('.fin-nav-item.is-active');
    await expect(leftActive).toContainText('Countdown Timer Generator');

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      'Build a live countdown page for launches, deadlines, annual dates, holidays, birthdays, and trips.'
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

  test('COUNTDOWN-TEST-E2E-2: layout stability and explanation content', async ({ page }) => {
    await page.goto('/time-and-date/countdown-timer-generator');

    const calcPanel = page.locator('.center-column .panel.panel-span-all').first();
    const initialHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);

    await page.locator('#countdown-start').click();
    const afterHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(afterHeight - initialHeight)).toBeLessThanOrEqual(6);

    const explanation = page.locator('#countdown-explanation');
    await expect(explanation.locator('h2')).toHaveCount(5);
    await expect(explanation).toContainText('Yearly date presets can vary by region');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.countdown-faq-list li')).toHaveCount(4);
    await expect(explanation.locator('.countdown-faq-item')).toHaveCount(0);
  });
});
