import { expect, test } from '@playwright/test';

test.describe('Age Calculator', () => {
  test('AGE-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/time-and-date/age-calculator');

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Time & Date');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Age Calculator');

    await page.locator('#age-dob').fill('1990-06-15');
    await page.locator('#age-as-of').fill('2025-09-01');
    await page.locator('#age-calculate').click();

    const resultsList = page.locator('#age-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);
    await expect(page.locator('.result-row span').last()).toHaveText(
      '35 years, 2 months, 17 days'
    );
    await expect(page.locator('#age-clarification')).toHaveText(
      'That is your exact age as of 2025-09-01.'
    );

    await page.locator('#age-dob').fill('2025-10-01');
    await page.locator('#age-as-of').fill('2025-09-01');
    await page.locator('#age-calculate').click();
    await expect(page.locator('#age-error')).toContainText(
      'Date of birth must be on or before the comparison date.'
    );
  });

  test('AGE-TEST-E2E-2: layout stability and content', async ({ page }) => {
    await page.goto('/time-and-date/age-calculator');

    const calcPanel = page.locator('.center-column .panel').first();
    const initialHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);

    await page.locator('#age-calculate').click();
    const afterHeight = await calcPanel.evaluate((el) => el.getBoundingClientRect().height);
    expect(Math.abs(afterHeight - initialHeight)).toBeLessThanOrEqual(1);

    const explanation = page.locator('#age-explanation');
    await expect(explanation.locator('h2')).toHaveCount(5);
    await expect(explanation).toContainText('What is an Age Calculator?');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.age-faq-item')).toHaveCount(4);
  });
});
