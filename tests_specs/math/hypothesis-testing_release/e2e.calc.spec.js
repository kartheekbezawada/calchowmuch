import { expect, test } from '@playwright/test';

test.describe('math/hypothesis-testing e2e', () => {
  test('single-pane rendering and test decisions are visible on first load', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/statistics/hypothesis-testing/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.analysis-answer-card')).toBeVisible();
    await expect(page.locator('#hyp-result')).toContainText('One-Sample t-Test');
    await expect(page.locator('#hyp-result')).toContainText('p-value');

    await page.click('[data-button-group="hyp-test-type"] button[data-value="chi-square"]');
    await page.click('#hyp-calculate');
    await expect(page.locator('#hyp-result')).toContainText('Chi-Square Goodness of Fit Test');
    await expect(page.locator('#hyp-result')).toContainText('Result');
  });
});
