import { expect, test } from '@playwright/test';

test.describe('math/regression-analysis e2e', () => {
  test('single-pane rendering and regression answers are visible on first load', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/statistics/regression-analysis/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.analysis-answer-card')).toBeVisible();
    await expect(page.locator('#reg-result')).toContainText('Regression Equation');
    await expect(page.locator('#reg-result')).toContainText('R-squared');

    await page.click('[data-button-group="reg-type"] button[data-value="polynomial"]');
    await page.fill('#reg-degree', '2');
    await page.click('#reg-calculate');
    await expect(page.locator('#reg-result')).toContainText('x^2');
    await expect(page.locator('#reg-result')).toContainText('Adjusted R-squared');
  });
});
