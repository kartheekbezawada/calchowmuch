import { expect, test } from '@playwright/test';

test.describe('math/standard-deviation e2e', () => {
  test('single-pane rendering and spread summary stay visible while switching modes', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/standard-deviation/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('#std-result')).toContainText('Sample Standard Deviation');
    await expect(page.locator('#std-detail')).toContainText('Mean');
    await expect(page.locator('#std-detail')).toContainText('Variance');

    await page.locator('[data-button-group="std-mode"] button[data-value="population"]').click();

    await expect(page.locator('#std-result')).toContainText('Population Standard Deviation');
    await expect(page.locator('#std-detail')).toContainText('18');
  });
});
