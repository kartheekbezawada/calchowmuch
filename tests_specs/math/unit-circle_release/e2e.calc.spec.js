import { expect, test } from '@playwright/test';

test.describe('math/unit-circle e2e', () => {
  test('single-pane render, answer-first layout, and degree-mode values', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/trigonometry/unit-circle/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.unit-answer-card')).toBeVisible();
    await expect(page.locator('#unit-circle-canvas')).toBeVisible();

    const leftBox = await page.locator('.unit-left-stack').boundingBox();
    const answerBox = await page.locator('.unit-answer-card').boundingBox();
    expect(leftBox).toBeTruthy();
    expect(answerBox).toBeTruthy();
    expect(answerBox.x).toBeGreaterThan(leftBox.x);

    await page.fill('#unit-angle', '45');
    await page.click('#unit-refresh');

    await expect(page.locator('#unit-circle-result')).toContainText('45 deg (pi/4 rad)');
    await expect(page.locator('#unit-circle-result')).toContainText('Quadrant: I');
    await expect(page.locator('#unit-circle-result')).toContainText('0.707107');
  });

  test('radian mode updates result and snapping keeps canvas workflow alive', async ({ page }) => {
    await page.goto('/math/trigonometry/unit-circle/');

    await page.click('[data-button-group="unit-angle-unit"] [data-value="rad"]');
    await page.fill('#unit-angle', '0.785398');
    await page.click('#unit-refresh');

    await expect(page.locator('#unit-circle-result')).toContainText('0.785398 rad');
    await expect(page.locator('#unit-circle-result')).toContainText('Quadrant: I');
    await expect(page.locator('#unit-circle-result')).toContainText('0.707107');
    await expect(page.locator('#unit-circle-legend')).toContainText('Active angle:');
  });
});
