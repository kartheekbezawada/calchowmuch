import { expect, test } from '@playwright/test';

test.describe('Percentage Decrease Calculator', () => {
  test('PDEC-TEST-E2E-1: single-pane journey, formula output, and migrated explanation UX', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-decrease/');

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('#pctdec-explanation .pv-results-table')).toHaveCount(1);
    await expect(page.locator('#pctdec-explanation .bor-faq-card')).toHaveCount(10);
    await expect(page.locator('#pctdec-explanation .faq-box')).toHaveCount(0);
    await expect(page.locator('#pctdec-explanation')).not.toContainText('Scenario Summary');

    await page.fill('#pctdec-original', '200');
    await page.fill('#pctdec-new', '150');
    await page.click('#pctdec-calc', { force: true });

    await expect(page.locator('#pctdec-result')).toContainText('Percentage Decrease: 25.00%');
    await expect(page.locator('#pctdec-result-detail')).toContainText('Decrease Amount: 50.00');
    await expect(page.locator('#pctdec-result-detail')).toContainText('Direction: Decrease');

    await page.fill('#pctdec-original', '100');
    await page.fill('#pctdec-new', '120');
    await page.click('#pctdec-calc', { force: true });

    await expect(page.locator('#pctdec-result')).toContainText('Percentage Decrease: -20.00%');
    await expect(page.locator('#pctdec-result-detail')).toContainText('Direction: Increase');
  });

  test('PDEC-TEST-E2E-2: handles zero-origin guard', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-decrease/');

    await page.fill('#pctdec-original', '0');
    await page.fill('#pctdec-new', '50');
    await page.click('#pctdec-calc', { force: true });

    await expect(page.locator('#pctdec-result')).toContainText('undefined when original value (X) is 0');
  });
});
