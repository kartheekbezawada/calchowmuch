import { expect, test } from '@playwright/test';

test.describe('Fraction Calculator', () => {
  test('FRAC-TEST-E2E-1: single-pane route and default solved example are visible', async ({ page }) => {
    await page.goto('/math/fraction-calculator/');

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('#fc-faq .fc-faq-card')).toHaveCount(10);

    await expect(page.locator('#fc-mode-label')).toHaveText('Add fractions');
    await expect(page.locator('#fc-result-sub')).toContainText(
      'Both fractions were renamed in 8ths before the numerators were added.'
    );
    await expect(page.locator('#fc-steps li')).toHaveCount(5);
    await expect(page.locator('#fc-lesson-title')).toContainText('Adding fractions');
  });

  test('FRAC-TEST-E2E-2: mode switching updates worked steps and teaching copy', async ({ page }) => {
    await page.goto('/math/fraction-calculator/');

    await page.getByRole('tab', { name: 'Divide' }).click();
    await expect(page.locator('#fc-mode-label')).toHaveText('Divide fractions');
    await expect(page.locator('#fc-result-sub')).toContainText(
      'Division became multiplication by the reciprocal 5/4.'
    );
    await expect(page.locator('#fc-teacher-note')).toContainText('flipping only the second fraction');

    await page.getByRole('tab', { name: 'Convert' }).click();
    await expect(page.locator('#fc-tile-1-value')).toHaveText('2 1/3');
    await expect(page.locator('#fc-tile-2-value')).toHaveText('7/5');
    await expect(page.locator('#fc-lesson-copy')).toContainText('quotient and remainder');
  });

  test('FRAC-TEST-E2E-3: validation is shown in simple English', async ({ page }) => {
    await page.goto('/math/fraction-calculator/');

    await page.fill('#fc-add-den1', '0');
    await page.click('[data-calc-mode="add"]', { force: true });

    await expect(page.locator('#fc-result-main')).toContainText('A denominator cannot be zero.');
    await expect(page.locator('#fc-teacher-note')).toContainText('A denominator cannot be zero.');
  });
});
