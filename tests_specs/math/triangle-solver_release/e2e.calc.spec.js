import { expect, test } from '@playwright/test';

test.describe('math/triangle-solver e2e', () => {
  test('single-pane rendering, answer-first layout, and SSS solve flow', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/trigonometry/triangle-solver/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.tri-answer-card')).toBeVisible();
    await expect(page.locator('#triangle-canvas')).toBeVisible();

    const leftBox = await page.locator('.tri-left-stack').boundingBox();
    const answerBox = await page.locator('.tri-answer-card').boundingBox();
    expect(leftBox).toBeTruthy();
    expect(answerBox).toBeTruthy();
    expect(answerBox.x).toBeGreaterThan(leftBox.x);

    await page.selectOption('#triangle-type', 'SSS');
    await page.fill('#triangle-a', '7');
    await page.fill('#triangle-b', '9');
    await page.fill('#triangle-c', '12');
    await page.click('#triangle-solve');

    await expect(page.locator('#triangle-result')).toContainText('Solved Triangle');
    await expect(page.locator('#triangle-result')).toContainText('Method = SSS');
    await expect(page.locator('#triangle-result')).toContainText('35.430945 deg');
    await expect(page.locator('[data-triangle-snap="status"]')).toHaveText('Solved');
    await expect(page.locator('#triangle-diagram-note')).toContainText('Diagram matches the solved triangle.');
  });

  test('SSA ambiguous case surfaces two solutions without breaking the diagram card', async ({ page }) => {
    await page.goto('/math/trigonometry/triangle-solver/');

    await page.selectOption('#triangle-type', 'SSA');
    await page.fill('#triangle-a', '7');
    await page.fill('#triangle-b', '9');
    await page.fill('#triangle-A', '35');
    await page.click('#triangle-solve');

    await expect(page.locator('#triangle-result')).toContainText('Solution 1');
    await expect(page.locator('#triangle-result')).toContainText('Solution 2');
    await expect(page.locator('#triangle-detail')).toContainText('Ambiguous case produced two solutions.');
    await expect(page.locator('[data-triangle-snap="solutions"]')).toHaveText('2');
    await expect(page.locator('[data-triangle-snap="status"]')).toHaveText('Ambiguous');
    await expect(page.locator('#triangle-diagram-note')).toContainText('Diagram shows solution 1 of 2.');
  });
});
