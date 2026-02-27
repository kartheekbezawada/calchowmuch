import { expect, test } from '@playwright/test';

test.describe('math/slope-distance e2e', () => {
  test('single-pane render and main calculation', async ({ page }) => {
    await page.goto('/math/algebra/slope-distance/');

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);

    await page.fill('#x1', '1');
    await page.fill('#y1', '2');
    await page.fill('#x2', '4');
    await page.fill('#y2', '8');
    await page.click('#calculate-slope');

    await expect(page.locator('#slope-result')).toContainText('Slope: 2');
    await expect(page.locator('#slope-result')).toContainText('Distance: 6.708');
    await expect(page.locator('#slope-result')).toContainText('Midpoint: (2.5, 5)');
    await expect(page.locator('#slope-detail')).toContainText('Slope-Intercept');
  });

  test('vertical-line edge case', async ({ page }) => {
    await page.goto('/math/algebra/slope-distance/');

    await page.fill('#x1', '3');
    await page.fill('#y1', '1');
    await page.fill('#x2', '3');
    await page.fill('#y2', '9');
    await page.click('#calculate-slope');

    await expect(page.locator('#slope-result')).toContainText('Undefined');
    await expect(page.locator('#slope-detail')).toContainText('vertical line');
  });
});
