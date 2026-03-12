import { expect, test } from '@playwright/test';

test.describe('Countdown Timer Generator', () => {
  test('COUNTDOWN-TEST-E2E-1: builder flow, holiday presets, and live preview', async ({ page }) => {
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

    // Open the options panel to access event type and holiday presets
    await page.locator('#countdown-options summary').click();

    await expect(page.locator('#countdown-holiday-field')).toHaveClass(/is-hidden/);
    await page.locator('[data-event-type="holiday"]').click();
    await expect(page.locator('#countdown-holiday-field')).not.toHaveClass(/is-hidden/);
    await page.locator('#countdown-holiday-preset').fill('Christmas Day');
    await page.locator('#countdown-event-name').click();
    await page.locator('#countdown-start').click();

    await expect(page.locator('#countdown-preview-title')).toHaveText('Christmas Day');
    await expect(page.locator('#countdown-preview-card')).toHaveAttribute('data-theme', 'celebration');
    await expect(page.locator('#countdown-preview-heading')).toHaveText('Holiday countdown');
    await expect(page.locator('#countdown-preview-summary')).toContainText('left until Christmas Day');
    await expect(page.locator('#countdown-status')).toContainText('Live preview updates every second');
    await expect(page.locator('#countdown-actions')).not.toHaveClass(/is-hidden/);
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
    await expect(explanation).toContainText('yearly date presets');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.countdown-faq-item')).toHaveCount(4);
  });
});
