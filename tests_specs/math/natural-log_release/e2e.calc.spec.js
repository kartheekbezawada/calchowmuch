import { expect, test } from '@playwright/test';

test.describe('math/natural-log e2e', () => {
  test('single-pane rendering, answer-first layout, and ln(e) solve flow', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/log/natural-log/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.ln-answer-card')).toBeVisible();
    await expect(page.locator('#ln-graph')).toBeVisible();

    const leftBox = await page.locator('.ln-left-stack').boundingBox();
    const answerBox = await page.locator('.ln-answer-card').boundingBox();
    expect(leftBox).toBeTruthy();
    expect(answerBox).toBeTruthy();
    expect(answerBox.x).toBeGreaterThan(leftBox.x);

    await page.fill('#ln-value', '2.718281828');
    await page.selectOption('#ln-decimals', '4');
    await page.click('#ln-calculate');

    await expect(page.locator('#ln-result')).toContainText('Natural Log Result');
    await expect(page.locator('#ln-result')).toContainText('ln(x)');
    await expect(page.locator('#ln-result')).toContainText('1');
    await expect(page.locator('#ln-detail')).toContainText('e^1 = 2.718282');
    await expect(page.locator('[data-ln-snap="sign"]')).toHaveText('Positive');
    await expect(page.locator('#ln-graph-note')).toContainText('Curve highlight is at x = 2.718282');
  });

  test('values below 1 return a negative natural log', async ({ page }) => {
    await page.goto('/math/log/natural-log/');

    await page.fill('#ln-value', '0.5');
    await page.selectOption('#ln-decimals', '4');
    await page.click('#ln-calculate');

    await expect(page.locator('#ln-result')).toContainText('-0.6931');
    await expect(page.locator('#ln-detail')).toContainText('e^-0.6931 = 0.5');
    await expect(page.locator('[data-ln-snap="sign"]')).toHaveText('Negative');
  });
});
