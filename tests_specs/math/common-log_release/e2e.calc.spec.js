import { expect, test } from '@playwright/test';

test.describe('math/common-log e2e', () => {
  test('single-pane rendering, answer-first layout, and base-10 solve flow', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/log/common-log/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.clog-answer-card')).toBeVisible();
    await expect(page.locator('#log-graph')).toBeVisible();

    const leftBox = await page.locator('.clog-left-stack').boundingBox();
    const answerBox = await page.locator('.clog-answer-card').boundingBox();
    expect(leftBox).toBeTruthy();
    expect(answerBox).toBeTruthy();
    expect(answerBox.x).toBeGreaterThan(leftBox.x);

    await page.fill('#log-value', '100');
    await page.selectOption('#log-base', '10');
    await page.click('#log-calculate');

    await expect(page.locator('#log-result')).toContainText('Selected Log Result');
    await expect(page.locator('#log-result')).toContainText('2');
    await expect(page.locator('#log-detail')).toContainText('log_10(100) = 2');
    await expect(page.locator('#log-detail')).toContainText('power of 10 produces 100');
    await expect(page.locator('#log-change')).toContainText('log_10(100) = 2');
    await expect(page.locator('[data-log-snap="base"]')).toHaveText('10');
    await expect(page.locator('[data-log-snap="status"]')).toHaveText('Solved');
  });

  test('custom base mode solves log_5(25) and reveals the custom base field', async ({ page }) => {
    await page.goto('/math/log/common-log/');

    await page.selectOption('#log-base', 'custom');
    await expect(page.locator('#log-custom-row')).toBeVisible();
    await page.fill('#log-value', '25');
    await page.fill('#log-custom-base', '5');
    await page.click('#log-calculate');

    await expect(page.locator('#log-result')).toContainText('2');
    await expect(page.locator('#log-detail')).toContainText('log_5(25) = 2');
    await expect(page.locator('#log-detail')).toContainText('power of 5 produces 25');
    await expect(page.locator('[data-log-snap="base"]')).toHaveText('5');
    await expect(page.locator('#log-graph-note')).toContainText('base 5');
  });
});
