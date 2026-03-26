import { expect, test } from '@playwright/test';

test.describe('math/statistics e2e', () => {
  test('single-pane rendering and descriptive summary are visible on first load', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/statistics/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.stats-answer-card')).toBeVisible();
    await expect(page.locator('#stats-result')).toContainText('Dataset Statistics');
    await expect(page.locator('#stats-detail')).toContainText('Mean');
    await expect(page.locator('#stats-detail')).toContainText('13.8889');

    await page.fill('#stats-dataset', '1, 2, 3, 4');
    await page.click('#stats-calculate');
    await expect(page.locator('#stats-detail')).toContainText('2.5');
    await expect(page.locator('#stats-detail')).toContainText('Range');
    await expect(page.locator('#stats-detail')).toContainText('3');
  });
});
