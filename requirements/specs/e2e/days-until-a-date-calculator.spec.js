import { expect, test } from '@playwright/test';

test.describe('Days Until a Date Calculator', () => {
  test('DAYS-UNTIL-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/#/time-and-date/days-until-a-date-calculator');

    const topNavActive = page.locator('#top-nav button.is-active');
    await expect(topNavActive).toContainText('Time & Date');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Days Until a Date Calculator');

    const targetDate = await page.evaluate(() => {
      const d = new Date();
      d.setDate(d.getDate() + 10);
      const pad = (value) => String(value).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    });

    await page.locator('#days-until-date').fill(targetDate);
    await page.locator('#days-until-calculate').click();

    await expect(page.locator('#days-until-results-list')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('.result-row span').last()).toHaveText('10');
    await expect(page.locator('#days-until-clarification')).toHaveText("That's in 10 days.");

    const pastDate = await page.evaluate(() => {
      const d = new Date();
      d.setDate(d.getDate() - 5);
      const pad = (value) => String(value).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    });

    await page.locator('#days-until-date').fill(pastDate);
    await page.locator('#days-until-calculate').click();
    await expect(page.locator('#days-until-clarification')).toHaveText('That date was 5 days ago.');
  });

  test('DAYS-UNTIL-TEST-E2E-2: layout stability and content', async ({ page }) => {
    await page.goto('/#/time-and-date/days-until-a-date-calculator');

    const calcPanel = page.locator('.center-column .panel').first();
    const initialHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);

    await page.locator('#days-until-calculate').click();
    const afterHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(afterHeight - initialHeight)).toBeLessThanOrEqual(1);

    const explanation = page.locator('#days-until-explanation');
    await expect(explanation.locator('h2')).toHaveCount(5);
    await expect(explanation).toContainText('What is a Days Until a Date Calculator?');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.days-until-faq-item')).toHaveCount(4);
  });
});
