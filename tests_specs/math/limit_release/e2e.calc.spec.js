import { expect, test } from '@playwright/test';

test.describe('math/limit e2e', () => {
  test('single-pane rendering, answer-first layout, and direct-substitution flow', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/calculus/limit/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.limq-answer-card')).toBeVisible();
    await expect(page.locator('.limq-steps-card')).toBeVisible();

    const leftBox = await page.locator('.limq-left-stack').boundingBox();
    const answerBox = await page.locator('.limq-answer-card').boundingBox();
    expect(leftBox).toBeTruthy();
    expect(answerBox).toBeTruthy();
    expect(answerBox.x).toBeGreaterThan(leftBox.x);

    await page.fill('#limit-function', 'x^2 + 2*x - 1');
    await page.fill('#limit-variable', 'x');
    await page.fill('#limit-approaches', '3');
    await page.click('#limit-calculate');

    await expect(page.locator('#limit-result')).toContainText('Limit summary');
    await expect(page.locator('#limit-result')).toContainText('14.000000');
    await expect(page.locator('#limit-result')).toContainText('Continuous at the point');
    await expect(page.locator('#limit-steps')).toContainText('Direct substitution:');
    await expect(page.locator('[data-limit-snap="direction"]')).toHaveText('Two-Sided');
    await expect(page.locator('[data-limit-snap="status"]')).toHaveText('Solved');
  });
});
