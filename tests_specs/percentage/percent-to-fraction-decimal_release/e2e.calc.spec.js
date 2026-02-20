import { expect, test } from '@playwright/test';

test.describe('Percent to Fraction/Decimal Converter', () => {
  test('PTFD-TEST-E2E-1: single-pane journey, conversion outputs, and explanation migration contract', async ({
    page,
  }) => {
    await page.goto('/percentage-calculators/percent-to-fraction-decimal-calculator/');

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('#ptfd-explanation .pv-results-table')).toHaveCount(1);
    await expect(page.locator('#ptfd-explanation .bor-faq-card')).toHaveCount(10);
    await expect(page.locator('#ptfd-explanation .faq-box')).toHaveCount(0);
    await expect(page.locator('#ptfd-explanation')).not.toContainText('Scenario Summary');

    await page.fill('#ptfd-percent', '12.5%');
    await page.click('#ptfd-calc', { force: true });

    await expect(page.locator('#ptfd-result')).toContainText('Decimal: 0.125');
    await expect(page.locator('#ptfd-result')).toContainText('Fraction: 1/8');
    await expect(page.locator('[data-ptfd=\"fraction\"]').first()).toHaveText('1/8');

    await page.fill('#ptfd-percent', '-25');
    await page.click('#ptfd-calc', { force: true });

    await expect(page.locator('#ptfd-result')).toContainText('Decimal: -0.25');
    await expect(page.locator('#ptfd-result')).toContainText('Fraction: -1/4');
  });

  test('PTFD-TEST-E2E-2: handles invalid input guard', async ({ page }) => {
    await page.goto('/percentage-calculators/percent-to-fraction-decimal-calculator/');

    await page.fill('#ptfd-percent', '');
    await page.click('#ptfd-calc', { force: true });

    await expect(page.locator('#ptfd-result')).toContainText(
      'Enter a valid percentage (for example: 12.5 or 12.5%).'
    );
  });
});
