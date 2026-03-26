import { expect, test } from '@playwright/test';

test.describe('math/confidence-interval e2e', () => {
  test('single-pane rendering and interval estimate stay visible while switching modes', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/confidence-interval/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('#ci-result')).toContainText('95% Confidence Interval');
    await expect(page.locator('#ci-detail')).toContainText('Margin of Error');

    await page.locator('[data-button-group="ci-mode"] button[data-value="mean"]').click();
    await page.fill('#ci-xbar', '50');
    await page.fill('#ci-sigma', '10');
    await page.fill('#ci-n', '25');
    await page.click('#ci-calculate');

    await expect(page.locator('#ci-result')).toContainText('46.08');
    await expect(page.locator('#ci-result')).toContainText('53.92');
    await expect(page.locator('#ci-detail')).toContainText('x-bar');
  });
});
