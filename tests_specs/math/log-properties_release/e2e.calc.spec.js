import { expect, test } from '@playwright/test';

test.describe('math/log-properties e2e', () => {
  test('single-pane rendering, answer-first layout, and default rule flow', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/log/log-properties/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.lprop-answer-card')).toBeVisible();

    const leftBox = await page.locator('.lprop-left-stack').boundingBox();
    const answerBox = await page.locator('.lprop-answer-card').boundingBox();
    expect(leftBox).toBeTruthy();
    expect(answerBox).toBeTruthy();
    expect(answerBox.x).toBeGreaterThan(leftBox.x);

    await page.click('#properties-calculate');

    await expect(page.locator('#properties-result')).toContainText('Rule Results');
    await expect(page.locator('#properties-result')).toContainText('log_10(2 × 5) = 1');
    await expect(page.locator('#properties-detail')).toContainText('log_10(2) + log_10(5)');
    await expect(page.locator('[data-properties-snap="product"]')).toHaveText('1');
  });

  test('custom base updates the rule outputs consistently', async ({ page }) => {
    await page.goto('/math/log/log-properties/');

    await page.fill('#properties-base', '2');
    await page.fill('#properties-product-x', '4');
    await page.fill('#properties-product-y', '8');
    await page.fill('#properties-quot-n', '16');
    await page.fill('#properties-quot-d', '4');
    await page.fill('#properties-power-value', '2');
    await page.fill('#properties-power-exp', '5');
    await page.click('#properties-calculate');

    await expect(page.locator('#properties-result')).toContainText('log_2(4 × 8) = 5');
    await expect(page.locator('#properties-result')).toContainText('log_2(16 / 4) = 2');
    await expect(page.locator('#properties-result')).toContainText('log_2(2^5) = 5');
    await expect(page.locator('[data-properties-snap="base"]')).toHaveText('2');
    await expect(page.locator('[data-properties-snap="power"]')).toHaveText('5');
  });
});
