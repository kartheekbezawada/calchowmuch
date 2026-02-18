import { expect, test } from '@playwright/test';

test.describe('Percentage Increase Calculator', () => {
  test('PINC-TEST-E2E-1: single-pane journey, formula output, and modern explanation UX', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-increase/');

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('#pct-inc-explanation .pv-results-table')).toHaveCount(1);
    await expect(page.locator('#pct-inc-explanation .bor-faq-card')).toHaveCount(10);
    await expect(page.locator('#pct-inc-explanation .faq-box')).toHaveCount(0);
    await expect(page.locator('#pct-inc-explanation')).not.toContainText('Scenario Summary');

    await page.fill('#pct-inc-x', '80');
    await page.fill('#pct-inc-y', '100');
    await page.click('#pct-inc-calc', { force: true });

    await expect(page.locator('#pct-inc-result')).toContainText('Percentage Increase: +25.00%');
    await expect(page.locator('#pct-inc-result-detail')).toContainText('Increase Amount: 20.00');
    await expect(page.locator('#pct-inc-result-detail')).toContainText('Direction: Increase');

    await page.fill('#pct-inc-x', '100');
    await page.fill('#pct-inc-y', '80');
    await page.click('#pct-inc-calc', { force: true });

    await expect(page.locator('#pct-inc-result')).toContainText('Percentage Increase: -20.00%');
    await expect(page.locator('#pct-inc-result-detail')).toContainText('Direction: Decrease');
  });

  test('PINC-TEST-E2E-2: handles zero-origin guard', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-increase/');

    await page.fill('#pct-inc-x', '0');
    await page.fill('#pct-inc-y', '100');
    await page.click('#pct-inc-calc', { force: true });

    await expect(page.locator('#pct-inc-result')).toContainText('undefined when original value (X) is 0');
  });
});
