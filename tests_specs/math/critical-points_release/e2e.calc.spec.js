import { expect, test } from '@playwright/test';

test.describe('math/critical-points e2e', () => {
  test('single-pane rendering and default turning-point analysis are visible on first load', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/calculus/critical-points/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.cp-answer-card')).toBeVisible();
    await expect(page.locator('.cp-steps-card')).toBeVisible();
    await expect(page.locator('#cp-result')).toContainText('Critical Points:');
    await expect(page.locator('#cp-result')).toContainText('Local Maximum');
    await expect(page.locator('#cp-result')).toContainText('Local Minimum');
    await expect(page.locator('#cp-result')).toContainText('Inflection Points:');
    await expect(page.locator('#cp-steps')).toContainText('FINDING CRITICAL POINTS');

    await page.fill('#cp-function', 't^2 - 4*t + 3');
    await page.fill('#cp-variable', 't');
    await page.fill('#cp-range-min', '-1');
    await page.fill('#cp-range-max', '5');
    await page.click('#cp-calculate');

    await expect(page.locator('#cp-result')).toContainText('Local Minimum');
    await expect(page.locator('#cp-result')).toContainText('2.0000');
  });
});
