import { expect, test } from '@playwright/test';

test.describe('math/exponential-equations e2e', () => {
  test('single-pane rendering, answer-first layout, and simple solve flow', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/log/exponential-equations/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.expq-answer-card')).toBeVisible();
    await expect(page.locator('#exp-graph')).toBeVisible();

    const leftBox = await page.locator('.expq-left-stack').boundingBox();
    const answerBox = await page.locator('.expq-answer-card').boundingBox();
    expect(leftBox).toBeTruthy();
    expect(answerBox).toBeTruthy();
    expect(answerBox.x).toBeGreaterThan(leftBox.x);

    await page.fill('#exp-base', '2');
    await page.fill('#exp-target', '16');
    await page.fill('#exp-mult', '1');
    await page.fill('#exp-shift', '0');
    await page.click('#exp-calculate');

    await expect(page.locator('#exp-result')).toContainText('Solved Equation');
    await expect(page.locator('#exp-result')).toContainText('Solution x');
    await expect(page.locator('#exp-result')).toContainText('4');
    await expect(page.locator('#exp-detail')).toContainText('x = (log_2(16) - 0) / 1');
    await expect(page.locator('[data-exp-snap="solution"]')).toHaveText('4');
    await expect(page.locator('#exp-graph-note')).toContainText('x = 4');
  });

  test('shifted equation solves to x = 2', async ({ page }) => {
    await page.goto('/math/log/exponential-equations/');

    await page.fill('#exp-base', '2');
    await page.fill('#exp-target', '32');
    await page.fill('#exp-mult', '2');
    await page.fill('#exp-shift', '1');
    await page.click('#exp-calculate');

    await expect(page.locator('#exp-result')).toContainText('Solution x');
    await expect(page.locator('#exp-result')).toContainText('2');
    await expect(page.locator('#exp-detail')).toContainText('x = (log_2(32) - 1) / 2');
    await expect(page.locator('[data-exp-snap="status"]')).toHaveText('Solved');
  });
});
