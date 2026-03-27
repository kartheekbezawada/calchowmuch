import { expect, test } from '@playwright/test';

test.describe('Fraction Calculator', () => {
  test('FRAC-TEST-E2E-1: single-pane route and default solved example are visible', async ({ page }) => {
    await page.goto('/math/fraction-calculator/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('#fc-faq .faq-card')).toHaveCount(10);

    await expect(page.locator('#fc-mode-label')).toHaveText('Add fractions');
    await expect(page.locator('#fc-result-sub')).toContainText('3/4 + 1/6 = 11/12');
    await expect(page.locator('#fc-metric-primary-value')).toHaveText('11/12');
    await expect(page.locator('#fc-steps .fc-step-row')).toHaveCount(4);
    await expect(page.locator('.fc-advanced-details')).not.toHaveAttribute('open', '');
    await expect(page.locator('#fc-lesson-title')).toContainText('Adding fractions');
  });

  test('FRAC-TEST-E2E-2: mode switching updates worked steps and teaching copy', async ({ page }) => {
    await page.goto('/math/fraction-calculator/');

    await page.getByRole('tab', { name: 'Divide' }).click();
    await expect(page.locator('#fc-mode-label')).toHaveText('Divide fractions');
    await expect(page.locator('#fc-result-sub')).toContainText('2/3 / 4/5 = 5/6');
    await expect(page.locator('#fc-metric-primary-value')).toHaveText('5/6');
    await expect(page.locator('#fc-teacher-note')).toContainText('flipping only the second fraction');

    await page.getByRole('tab', { name: 'Convert' }).click();
    await expect(page.locator('#fc-result-sub')).toContainText('7/3 = 2 1/3 | 1 2/5 = 7/5');
    await expect(page.locator('#fc-metric-primary-value')).toHaveText('2 1/3');
    await expect(page.locator('#fc-metric-secondary-value')).toHaveText('7/5');
    await expect(page.locator('#fc-lesson-copy')).toContainText('represent the same value');
  });

  test('FRAC-TEST-E2E-3: validation is shown in simple English', async ({ page }) => {
    await page.goto('/math/fraction-calculator/');

    await page.fill('#fc-add-den1', '0');
    await page.click('#fc-solve-btn');

    await expect(page.locator('#fc-result-main')).toContainText('A denominator cannot be zero.');
    await expect(page.locator('#fc-teacher-note')).toContainText('A denominator cannot be zero.');
  });
});
