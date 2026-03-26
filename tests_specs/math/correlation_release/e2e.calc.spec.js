import { expect, test } from '@playwright/test';

test.describe('math/correlation e2e', () => {
  test('single-pane rendering and correlation answers are visible on first load', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/statistics/correlation/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.analysis-answer-card')).toBeVisible();
    await expect(page.locator('#corr-result')).toContainText('Pearson Correlation');
    await expect(page.locator('#corr-result')).toContainText('Very Strong Positive');

    await page.click('[data-button-group="corr-type"] button[data-value="spearman"]');
    await page.click('#corr-calculate');
    await expect(page.locator('#corr-result')).toContainText('Spearman Rank Correlation');
    await expect(page.locator('#corr-result')).toContainText('Significant');
  });
});
