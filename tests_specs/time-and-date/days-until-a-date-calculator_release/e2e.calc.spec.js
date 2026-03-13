import { expect, test } from '@playwright/test';

test.describe('Days Until a Date Calculator', () => {
  test('DAYS-UNTIL-TEST-E2E-1: user journey, smart date states, and share tools', async ({ page }) => {
    await page.goto('/time-and-date/days-until-a-date-calculator');

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Time & Date');

    const leftActive = page.locator('.fin-nav-item.is-active');
    await expect(leftActive).toContainText('Days Until a Date Calculator');

    const targetDate = await page.evaluate(() => {
      const d = new Date();
      d.setDate(d.getDate() + 10);
      const pad = (value) => String(value).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    });

    await page.locator('#days-until-date').fill(targetDate);
    await page.locator('#days-until-calculate').click();

    await expect(page.locator('#days-until-result-value')).toHaveText('10');
    await expect(page.locator('#days-until-result-unit')).toHaveText('days');
    await expect(page.locator('#days-until-result-kicker')).toContainText('Days until');
    await expect(page.locator('#days-until-actions')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#days-until-copy-summary')).toBeVisible();
    await expect(page.locator('#days-until-generate-share-card')).toBeVisible();
    await page.locator('#days-until-generate-share-card').click();
    await expect(page.locator('#days-until-copy-feedback')).toContainText('Share card generated.');

    const pastDate = await page.evaluate(() => {
      const d = new Date();
      d.setDate(d.getDate() - 5);
      const pad = (value) => String(value).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    });

    await page.locator('#days-until-date').fill(pastDate);
    await page.locator('#days-until-calculate').click();
    await expect(page.locator('#days-until-result-value')).toHaveText('5');
    await expect(page.locator('#days-until-result-kicker')).toContainText('Days since');
    await expect(page.locator('#days-until-status')).toContainText('Past date');
  });

  test('DAYS-UNTIL-TEST-E2E-2: layout stability, range mode, and content', async ({ page }) => {
    await page.goto('/time-and-date/days-until-a-date-calculator');

    const calcPanel = page.locator('.center-column .panel').first();
    const initialHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);

    await page.locator('#days-until-calculate').click();
    const afterHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(afterHeight - initialHeight)).toBeLessThanOrEqual(6);

    await page.locator('[data-mode="range"]').click();
    await expect(page.locator('#days-until-start-wrap')).not.toHaveClass(/is-hidden/);
    await page.locator('#days-until-start-date').fill('2026-03-01');
    await page.locator('#days-until-date').fill('2026-03-15');
    await page.locator('#days-until-include-end').check();
    await page.locator('#days-until-calculate').click();
    await expect(page.locator('#days-until-result-value')).toHaveText('15');
    await expect(page.locator('#days-until-status')).toContainText('Custom range');
    await expect(page.locator('#days-until-breakdown')).toContainText('Calendar days');

    const explanation = page.locator('#days-until-explanation');
    await expect(explanation.locator('h2')).toHaveCount(5);
    await expect(explanation).toContainText('Why This Date Calculator Helps');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation).toContainText('Quick Notes');
    await expect(explanation.locator('.days-until-faq-list li')).toHaveCount(4);
  });
});
