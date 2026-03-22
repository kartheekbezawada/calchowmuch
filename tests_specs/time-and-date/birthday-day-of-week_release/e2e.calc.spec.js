import { expect, test } from '@playwright/test';

test.describe('Birthday Day-of-Week Calculator', () => {
  test('BIRTHDAY-DOW-TEST-E2E-1: single-pane journey, intent options, planner views, and copy summary', async ({
    page,
  }) => {
    await page.goto('/time-and-date/birthday-day-of-week');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('.birthday-dow-workspace')).toBeVisible();
    await expect(page.locator('[data-birthday-intent]')).toHaveCount(3);
    await expect(page.locator('[data-plan-view]')).toHaveCount(3);
    await expect(page.locator('.td-cluster-switch-chip[aria-current="page"]')).toContainText(
      'Birthday Day-of-Week'
    );

    await page.locator('[data-birthday-intent="weekend"]').click();
    await expect(page.locator('[data-birthday-intent="weekend"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-plan-view="weekend"]')).toHaveAttribute('aria-pressed', 'true');

    await page.locator('#birthday-dow-dob').fill('1990-06-15');
    await page.locator('#birthday-dow-year').fill('2025');
    await page.locator('#birthday-dow-calculate').click();

    await expect(page.locator('#birthday-dow-birth-weekday')).toHaveText('Friday');
    await expect(page.locator('#birthday-dow-target-weekday-card')).toHaveText('Sunday');
    await expect(page.locator('#birthday-dow-hero-target-year')).toHaveText('2025');
    await expect(page.locator('#birthday-dow-recurrence .birthday-dow-recurrence-item')).toHaveCount(12);
    await expect(page.locator('#birthday-dow-weekend-highlights .birthday-dow-weekend-item')).toHaveCount(3);
    await expect(page.locator('#birthday-dow-next-age')).not.toHaveText('--');
    await expect(page.locator('#birthday-dow-next-days')).not.toHaveText('--');
    await expect(page.locator('#birthday-dow-next-panel-title')).toContainText(',');

    await page.locator('[data-plan-view="timeline"]').click();
    await expect(page.locator('[data-plan-view="timeline"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-plan-panel="timeline"]')).toBeVisible();

    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (text) => {
            window.__birthdayCopiedText = text;
          },
        },
      });
    });

    await page.locator('#birthday-dow-copy-summary').click();
    await expect(page.locator('#birthday-dow-copy-feedback')).toContainText('Birthday summary copied.');
    const copiedText = await page.evaluate(() => window.__birthdayCopiedText);
    expect(copiedText).toContain('June 15, 1990 was a Friday.');
  });

  test('BIRTHDAY-DOW-TEST-E2E-2: leap-year handling keeps the non-leap fallback', async ({ page }) => {
    await page.goto('/time-and-date/birthday-day-of-week');

    await page.locator('#birthday-dow-dob').fill('2000-02-29');
    await page.locator('#birthday-dow-year').fill('2021');
    await page.locator('#birthday-dow-calculate').click();

    await expect(page.locator('#birthday-dow-target-weekday-card')).toHaveText('Sunday');
    await expect(page.locator('#birthday-dow-target-note')).toContainText('February 28, 2021');
    await expect(page.locator('#birthday-dow-next-weekday')).not.toHaveText('--');
  });

  test('BIRTHDAY-DOW-TEST-E2E-3: mobile order keeps calculator before explanation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/time-and-date/birthday-day-of-week');

    const calculatorRoot = page.locator('#calc-birthday-dow');
    const explanationRoot = page.locator('#birthday-dow-explanation');

    await expect(calculatorRoot).toBeVisible();
    await expect(explanationRoot).toBeVisible();

    const calculatorBox = await calculatorRoot.boundingBox();
    const explanationBox = await explanationRoot.boundingBox();

    expect(calculatorBox).toBeTruthy();
    expect(explanationBox).toBeTruthy();
    expect(calculatorBox.y).toBeLessThan(explanationBox.y);
    await expect(page.locator('#birthday-dow-explanation h2')).toHaveText(
      'What day of the week was I born on?'
    );
  });
});
