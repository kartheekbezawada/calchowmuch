import { expect, test } from '@playwright/test';

test.describe('math/z-score e2e', () => {
  test('single-pane rendering and z-score interpretation stay visible on recalculation', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/z-score/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('#zscore-result')).toContainText('Z-score');
    await expect(page.locator('#zscore-detail')).toContainText('above the mean');

    await page.fill('#zscore-x', '65');
    await page.click('#zscore-calculate');

    await expect(page.locator('#zscore-result')).toContainText('-1');
    await expect(page.locator('#zscore-detail')).toContainText('below the mean');
  });
});
