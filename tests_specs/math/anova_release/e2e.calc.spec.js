import { expect, test } from '@playwright/test';

test.describe('math/anova e2e', () => {
  test('single-pane rendering and ANOVA answers are visible on first load', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/statistics/anova/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.analysis-answer-card')).toBeVisible();
    await expect(page.locator('#anova-result')).toContainText('ANOVA Summary');
    await expect(page.locator('#anova-result')).toContainText('F-statistic');
    await expect(page.locator('#anova-result')).toContainText('Significant');

    await page.fill('#anova-group-1', '10, 11, 12');
    await page.fill('#anova-group-2', '10, 11, 12');
    await page.fill('#anova-group-3', '10, 11, 12');
    await page.click('#anova-calculate');
    await expect(page.locator('#anova-result')).toContainText('Not Significant');
  });
});
