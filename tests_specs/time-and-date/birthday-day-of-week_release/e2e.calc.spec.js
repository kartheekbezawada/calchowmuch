import { expect, test } from '@playwright/test';

test.describe('Birthday Day-of-Week Calculator', () => {
  test('BIRTHDAY-DOW-TEST-E2E-1: single-pane journey, year presets, results, and copy summary', async ({
    page,
  }) => {
    await page.goto('/time-and-date/birthday-day-of-week');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('.birthday-dow-workspace')).toBeVisible();
    await expect(page.locator('.td-cluster-switch-chip[aria-current="page"]')).toContainText(
      'Birthday Day-of-Week'
    );

    // Rewritten 2026-08-25. This previously asserted `[data-birthday-intent]` and
    // `[data-plan-view]` intent chips / planner tabs. That feature was added in 4d26b2f6
    // (2026-03-13) and REMOVED in 01a4589d (2026-03-22, the release sign-off) — the tests were
    // never updated, so this spec had been failing for five months and every assertion after it
    // never ran. The page's actual control is the year-preset chip group; covering that instead
    // keeps real coverage rather than deleting it.
    await expect(page.locator('[data-year-preset]')).toHaveCount(3);
    await page.locator('[data-year-preset="next"]').click();
    await expect(page.locator('[data-year-preset="next"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-year-preset="current"]')).toHaveAttribute('aria-pressed', 'false');

    await page.locator('#birthday-dow-dob').fill('1990-06-15');
    await page.locator('#birthday-dow-year').fill('2025');
    await page.locator('#birthday-dow-calculate').click();

    // #birthday-dow-birth-weekday was renamed to #birthday-dow-hero-weekday.
    await expect(page.locator('#birthday-dow-hero-weekday')).toHaveText('Friday');
    await expect(page.locator('#birthday-dow-target-weekday-card')).toHaveText('Sunday');
    await expect(page.locator('#birthday-dow-hero-target-year')).toContainText('2025');
    await expect(page.locator('#birthday-dow-recurrence .birthday-dow-recurrence-item')).toHaveCount(12);
    await expect(page.locator('#birthday-dow-weekend-highlights .birthday-dow-weekend-item')).toHaveCount(3);
    await expect(page.locator('#birthday-dow-next-age')).not.toHaveText('--');
    await expect(page.locator('#birthday-dow-next-days')).not.toHaveText('--');
    await expect(page.locator('#birthday-dow-next-panel-title')).toContainText(',');

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
    // Updated 2026-08-24: the explanation H2 no longer duplicates the H1 — see
    // seo_fixes/time-and-date/birthday-day-of-week/fix-1.md. Also scoped with .first(): the
    // generator injects "More Age Calculator tools" and "Related Time & Date calculators" H2s
    // inside this container, so the bare locator matches 3 elements and toHaveText(<string>)
    // could never have passed.
    await expect(page.locator('#birthday-dow-explanation h2').first()).toHaveText(
      'Your birth weekday, and how the date was worked out'
    );
  });
});
