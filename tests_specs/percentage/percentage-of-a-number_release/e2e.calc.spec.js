import { expect, test } from '@playwright/test';

test.describe('Find Percentage of a Number Calculator', () => {
  test('PON-TEST-E2E-1: single-pane journey, migration contract, and compute output', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-of-a-number-calculator/');

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('#pon-explanation .pv-results-table')).toHaveCount(1);
    await expect(page.locator('#pon-explanation .bor-faq-card')).toHaveCount(10);
    await expect(page.locator('#pon-explanation .faq-box')).toHaveCount(0);
    await expect(page.locator('#pon-explanation')).not.toContainText('Scenario Summary');

    await page.fill('#pon-percent', '20');
    await page.fill('#pon-number', '50');
    await page.click('#pon-calc', { force: true });

    await expect(page.locator('#pon-result')).toContainText('Result: 10.00');
    await expect(page.locator('#pon-result-detail')).toContainText('(20.00 / 100) x 50.00 = 10.00');
    await expect(page.locator('[data-pon=\"result\"]').first()).toHaveText('10.00');

    await page.fill('#pon-percent', '-10');
    await page.fill('#pon-number', '200');
    await page.click('#pon-calc', { force: true });

    await expect(page.locator('#pon-result')).toContainText('Result: -20.00');
  });

  test('PON-TEST-E2E-2: invalid input guard text', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-of-a-number-calculator/');

    await page.fill('#pon-percent', '');
    await page.fill('#pon-number', '100');
    await page.click('#pon-calc', { force: true });
    await expect(page.locator('#pon-result')).toContainText('Enter a valid percentage value (X).');
  });
});
