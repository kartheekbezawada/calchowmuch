import { expect, test } from '@playwright/test';

test.describe('Work Hours Calculator', () => {
  test('WORK-HOURS-TEST-E2E-1: single shift calculation', async ({ page }) => {
    await page.goto('/time-and-date/work-hours-calculator/');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('.td-cluster-switch-chip[aria-current="page"]')).toContainText(
      'Work Hours Calculator'
    );

    await page.locator('#work-hours-single-start').fill('09:00');
    await page.locator('#work-hours-single-end').fill('17:30');
    await page.locator('#work-hours-calculate').click();

    const results = page.locator('#work-hours-results-list .result-row');
    await expect(results).toHaveCount(3);
    await expect(results.nth(0)).toContainText('Total worked time');
    await expect(results.nth(1)).toContainText('Total hours (decimal)');
    await expect(results.nth(2)).toContainText('Total break deducted');

    await page.locator('#work-hours-single-end').fill('18:00');
    await expect(page.locator('#work-hours-results-list')).toHaveClass(/is-hidden/);
    await page.locator('#work-hours-calculate').click();
    await expect(page.locator('#work-hours-results-list')).not.toHaveClass(/is-hidden/);
  });

  test('WORK-HOURS-TEST-E2E-2: weekly totals and migrated explanation contract', async ({ page }) => {
    await page.goto('/time-and-date/work-hours-calculator/');

    await page.locator('[data-button-group="work-hours-mode"] button[data-value="weekly"]').click();
    await page.locator('#work-hours-weekly-mon-start').fill('08:00');
    await page.locator('#work-hours-weekly-mon-end').fill('12:00');
    await page.locator('#work-hours-weekly-tue-start').fill('09:00');
    await page.locator('#work-hours-weekly-tue-end').fill('17:00');
    await page.locator('#work-hours-calculate').click();

    const results = page.locator('#work-hours-results-list');
    await expect(results).toContainText('Mon:');
    await expect(results).toContainText('Tue:');

    const explanation = page.locator('#work-hours-explanation');
    await expect(explanation.locator('h2')).toHaveCount(1);
    await expect(explanation.locator('h2')).toHaveText('How many work hours are in this shift or week?');
    await expect(explanation.locator('h3')).toHaveCount(3);
    await expect(explanation.locator('.work-hours-faq-item')).toHaveCount(4);
    await expect(explanation.locator('.work-hours-notes li')).toHaveCount(5);
    await expect(explanation).toContainText('All calculations run locally in your browser - no data is stored.');
  });

  test('WORK-HOURS-TEST-E2E-3: mobile layout stays single-column without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/time-and-date/work-hours-calculator/');

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth - overflow.clientWidth).toBeLessThanOrEqual(1);

    const calculatorBox = await page.locator('#calc-work-hours .calculator-ui').boundingBox();
    const explanationBox = await page.locator('#work-hours-explanation').boundingBox();

    expect(calculatorBox).not.toBeNull();
    expect(explanationBox).not.toBeNull();
    expect(explanationBox.y).toBeGreaterThanOrEqual(calculatorBox.y + calculatorBox.height - 1);
  });
});
