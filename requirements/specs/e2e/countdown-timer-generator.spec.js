import { expect, test } from '@playwright/test';

test.describe('Countdown Timer Generator', () => {
  test('COUNTDOWN-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/time-and-date/countdown-timer-generator');

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Time & Date');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Countdown Timer Generator');

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      'Create a live countdown to any future date and time. Simple, fast, and free countdown timer generator.'
    );

    const targetDateTime = await page.evaluate(() => {
      const d = new Date();
      d.setHours(d.getHours() + 2);
      d.setSeconds(0, 0);
      const pad = (value) => String(value).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
        d.getHours()
      )}:${pad(d.getMinutes())}`;
    });

    await page.locator('#countdown-datetime').fill(targetDateTime);
    await page.locator('#countdown-start').click();

    await expect(page.locator('#countdown-results-list')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#countdown-status')).toContainText('Counting down to');
    await expect(page.locator('#countdown-results-list .result-row')).toHaveCount(7);
  });

  test('COUNTDOWN-TEST-E2E-2: layout stability and explanation content', async ({ page }) => {
    await page.goto('/time-and-date/countdown-timer-generator');

    const calcPanel = page.locator('.center-column .panel').first();
    const initialHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);

    await page.locator('#countdown-start').click();
    const afterHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(afterHeight - initialHeight)).toBeLessThanOrEqual(1);

    const explanation = page.locator('#countdown-explanation');
    await expect(explanation.locator('h2')).toHaveCount(5);
    await expect(explanation).toContainText('What is a Countdown Timer Generator?');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.countdown-faq-item')).toHaveCount(4);
  });
});
