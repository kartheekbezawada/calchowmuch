import { expect, test } from '@playwright/test';

test.describe('Overtime Hours Calculator', () => {
  test('OVERTIME-TEST-E2E-1: single shift calculation', async ({ page }) => {
    await page.goto('/time-and-date/overtime-hours-calculator/');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('.td-cluster-switch-chip[aria-current="page"]')).toContainText(
      'Overtime Hours Calculator'
    );

    await page.locator('#overtime-single-start').fill('09:00');
    await page.locator('#overtime-single-end').fill('17:30');
    await page.locator('#overtime-calculate').click();

    const results = page.locator('#overtime-results-list .result-line');
    await expect(results).toHaveCount(5);
    await expect(results.nth(0)).toContainText('Total worked');
    await expect(results.nth(1)).toContainText('Regular hours');
    await expect(results.nth(2)).toContainText('Overtime hours');
    await expect(results.nth(3)).toContainText('Decimal total');
    await expect(results.nth(4)).toContainText('Rule used');

    await expect(page.locator('[data-placeholder="total-hhmm"]').first()).toContainText('8:00');
  });

  test('OVERTIME-TEST-E2E-2: input change resets results (UI-2.6)', async ({ page }) => {
    await page.goto('/time-and-date/overtime-hours-calculator/');

    await page.locator('#overtime-single-start').fill('09:00');
    await page.locator('#overtime-single-end').fill('17:30');
    await page.locator('#overtime-calculate').click();

    const resultsList = page.locator('#overtime-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);

    await page.locator('#overtime-single-start').fill('10:00');

    await expect(resultsList).toHaveClass(/is-hidden/);
    await expect(page.locator('#overtime-placeholder')).toBeVisible();

    await page.locator('#overtime-calculate').click();
    await expect(resultsList).not.toHaveClass(/is-hidden/);
  });

  test('OVERTIME-TEST-E2E-3: mode switch resets results (UI-2.6)', async ({ page }) => {
    await page.goto('/time-and-date/overtime-hours-calculator/');

    await page.locator('#overtime-single-start').fill('09:00');
    await page.locator('#overtime-single-end').fill('17:30');
    await page.locator('#overtime-calculate').click();

    const resultsList = page.locator('#overtime-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);

    await page.locator('[data-button-group="overtime-mode"] button[data-value="split"]').click();

    await expect(resultsList).toHaveClass(/is-hidden/);
    await expect(page.locator('#overtime-placeholder')).toBeVisible();
  });

  test('OVERTIME-TEST-E2E-4: explanation contract and FAQs', async ({ page }) => {
    await page.goto('/time-and-date/overtime-hours-calculator/');

    const explanation = page.locator('#overtime-explanation');
    await expect(explanation.locator('h2')).toHaveCount(1);
    await expect(explanation.locator('h2')).toHaveText('How much of this shift counts as overtime?');
    await expect(explanation.locator('h3')).toHaveCount(3);
    await expect(explanation).toContainText('How to Guide');
    await expect(explanation).toContainText('FAQ');
    await expect(explanation).toContainText('Important Notes');
    await expect(explanation.locator('.overtime-faq-item')).toHaveCount(10);
    await expect(explanation.locator('.overtime-notes li')).toHaveCount(5);
    await expect(explanation).toContainText('All calculations run locally in your browser - no data is stored.');
  });
});
