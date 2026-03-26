import { expect, test } from '@playwright/test';

test.describe('math/slope-distance e2e', () => {
  test('single-pane render, right preview panel, and main calculation', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/algebra/slope-distance/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.slope-answer-card')).toBeVisible();

    const formBox = await page.locator('.slope-input-card').boundingBox();
    const previewBox = await page.locator('.slope-answer-card').boundingBox();
    expect(formBox).toBeTruthy();
    expect(previewBox).toBeTruthy();
    expect(previewBox.x).toBeGreaterThan(formBox.x);

    await page.fill('#x1', '1');
    await page.fill('#y1', '2');
    await page.fill('#x2', '4');
    await page.fill('#y2', '8');
    await page.click('#calculate-slope');

    await expect(page.locator('#slope-result')).toContainText('Slope: 2');
    await expect(page.locator('#slope-result')).toContainText('Distance: 6.708');
    await expect(page.locator('#slope-result')).toContainText('Midpoint: (2.5, 5)');
    await expect(page.locator('[data-slope-snap="line-type"]')).toHaveText('General line');
    await expect(page.locator('#slope-detail')).toContainText('Line Equations');
    await expect(page.locator('#slope-detail')).toContainText('Parallel & Perpendicular');
  });

  test('vertical-line edge case updates deterministic snapshot state', async ({ page }) => {
    await page.goto('/math/algebra/slope-distance/');

    await page.fill('#x1', '3');
    await page.fill('#y1', '1');
    await page.fill('#x2', '3');
    await page.fill('#y2', '9');
    await page.click('#calculate-slope');

    await expect(page.locator('#slope-result')).toContainText('Undefined');
    await expect(page.locator('[data-slope-snap="slope"]')).toHaveText('Undefined');
    await expect(page.locator('[data-slope-snap="line-type"]')).toHaveText('Vertical line');
  });
});
