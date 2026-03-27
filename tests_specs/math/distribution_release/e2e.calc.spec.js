import { expect, test } from '@playwright/test';

test.describe('math/distribution e2e', () => {
  test('single-pane rendering and distribution answers are visible on first load', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/statistics/distribution/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.analysis-answer-card')).toBeVisible();
    await expect(page.locator('#dist-result')).toContainText('Normal(mu=0, sigma=1)');
    await expect(page.locator('#dist-result')).toContainText('P(X <= x)');
    await expect(page.locator('#dist-result')).toContainText('0.975');

    await page.click('[data-button-group="dist-calc-type"] button[data-value="quantile"]');
    await page.fill('#dist-p', '0.95');
    await page.click('#dist-calculate');
    await expect(page.locator('#dist-result')).toContainText('Quantile');
    await expect(page.locator('#dist-result')).toContainText('1.64');
  });
});
