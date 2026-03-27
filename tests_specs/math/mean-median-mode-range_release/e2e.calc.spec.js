import { expect, test } from '@playwright/test';

test.describe('math/mean-median-mode-range e2e', () => {
  test('single-pane rendering and descriptive summary are visible on first load', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/mean-median-mode-range/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.stats-answer-card')).toBeVisible();
    await expect(page.locator('#mmmr-result')).toContainText('Results');
    await expect(page.locator('#mmmr-detail')).toContainText('Mean');
    await expect(page.locator('#mmmr-detail')).toContainText('17.5');
    await expect(page.locator('#mmmr-detail')).toContainText('16.5');
    await expect(page.locator('#mmmr-detail')).toContainText('15');

    await page.fill('#mmmr-dataset', '2, 4, 6, 8');
    await page.click('#mmmr-calculate');

    await expect(page.locator('#mmmr-detail')).toContainText('5');
    await expect(page.locator('#mmmr-detail')).toContainText('Median');
    await expect(page.locator('#mmmr-detail')).toContainText('Range');
  });
});
