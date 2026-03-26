import { expect, test } from '@playwright/test';

test.describe('math/permutation-combination e2e', () => {
  test('single-pane rendering and counting answers are visible on first load', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/permutation-combination/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.count-answer-card')).toBeVisible();
    await expect(page.locator('#pc-result')).toContainText('720');
    await expect(page.locator('#pc-detail')).toContainText('Formula');

    await page.click('[data-button-group="pc-mode"] button[data-value="combination"]');
    await page.click('#pc-calculate');
    await expect(page.locator('#pc-result')).toContainText('120');
    await expect(page.locator('#pc-detail')).toContainText('committee');

    await page.click('[data-button-group="pc-mode"] button[data-value="factorial"]');
    await page.fill('#pc-n', '5');
    await page.click('#pc-calculate');
    await expect(page.locator('#pc-result')).toContainText('120');
    await expect(page.locator('#pc-detail')).toContainText('5 × 4 × 3 × 2 × 1');
  });
});
