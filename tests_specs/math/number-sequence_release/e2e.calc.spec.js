import { expect, test } from '@playwright/test';

test.describe('math/number-sequence e2e', () => {
  test('single-pane rendering and sequence answers are visible on first load', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/number-sequence/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.sequence-answer-card')).toBeVisible();
    await expect(page.locator('#seq-result')).toContainText('Arithmetic Sequence');
    await expect(page.locator('#seq-result')).toContainText('20');
    await expect(page.locator('#seq-detail')).toContainText('Common difference');
    await expect(page.locator('#seq-detail')).toContainText('110');

    await page.fill('#seq-terms', '2, 6, 18, 54');
    await page.click('[data-button-group="seq-type"] button[data-value="geometric"]');
    await page.fill('#seq-n', '5');
    await page.fill('#seq-k', '5');
    await page.click('#seq-calculate');

    await expect(page.locator('#seq-result')).toContainText('Geometric Sequence');
    await expect(page.locator('#seq-result')).toContainText('162');
    await expect(page.locator('#seq-detail')).toContainText('Common ratio');
    await expect(page.locator('#seq-detail')).toContainText('242');
  });
});
