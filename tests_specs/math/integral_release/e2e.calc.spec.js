import { expect, test } from '@playwright/test';

test.describe('math/integral e2e', () => {
  test('single-pane rendering, answer-first layout, and definite integral flow', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/calculus/integral/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.intg-answer-card')).toBeVisible();
    await expect(page.locator('.intg-steps-card')).toBeVisible();

    const leftBox = await page.locator('.intg-left-stack').boundingBox();
    const answerBox = await page.locator('.intg-answer-card').boundingBox();
    expect(leftBox).toBeTruthy();
    expect(answerBox).toBeTruthy();
    expect(answerBox.x).toBeGreaterThan(leftBox.x);

    await page.fill('#int-function', 'x^2');
    await page.click('[data-mode="definite"]');
    await page.fill('#int-lower', '0');
    await page.fill('#int-upper', '1');
    await page.click('#int-calculate');

    await expect(page.locator('#int-result')).toContainText('Integral summary');
    await expect(page.locator('#int-result')).toContainText('0.333333');
    await expect(page.locator('#int-result')).toContainText('0.3333x^3 + C');
    await expect(page.locator('#int-steps')).toContainText('Original function: f(x) = x^2');
    await expect(page.locator('[data-int-snap="mode"]')).toHaveText('Definite');
    await expect(page.locator('[data-int-snap="status"]')).toHaveText('Solved');
  });
});
