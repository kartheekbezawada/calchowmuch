import { expect, test } from '@playwright/test';

test.describe('math/derivative e2e', () => {
  test('single-pane rendering, answer-first layout, and derivative solve flow', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/calculus/derivative/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.deriv-answer-card')).toBeVisible();
    await expect(page.locator('.deriv-steps-card')).toBeVisible();

    const leftBox = await page.locator('.deriv-left-stack').boundingBox();
    const answerBox = await page.locator('.deriv-answer-card').boundingBox();
    expect(leftBox).toBeTruthy();
    expect(answerBox).toBeTruthy();
    expect(answerBox.x).toBeGreaterThan(leftBox.x);

    await page.fill('#deriv-function', 'x^2+3*x+5');
    await page.fill('#deriv-variable', 'x');
    await page.fill('#deriv-order', '1');
    await page.fill('#deriv-eval-point', '2');
    await page.click('#deriv-calculate');

    await expect(page.locator('#deriv-result')).toContainText('Derivative summary');
    await expect(page.locator('#deriv-result')).toContainText('2x + 3');
    await expect(page.locator('#deriv-result')).toContainText('7.000000');
    await expect(page.locator('#deriv-steps')).toContainText('Original function: f(x) = x^2+3*x+5');
    await expect(page.locator('[data-deriv-snap="derivative"]')).toHaveText('2x + 3');
    await expect(page.locator('[data-deriv-snap="status"]')).toHaveText('Solved');
  });
});
