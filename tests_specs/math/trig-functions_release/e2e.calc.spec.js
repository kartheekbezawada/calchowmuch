import { expect, test } from '@playwright/test';

test.describe('math/trig-functions e2e', () => {
  test('single-pane rendering, answer-first layout, and 30 degree special-angle output', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/trigonometry/trig-functions/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.trig-answer-card')).toBeVisible();
    await expect(page.locator('#trig-graph')).toBeVisible();

    const leftBox = await page.locator('.trig-left-stack').boundingBox();
    const answerBox = await page.locator('.trig-answer-card').boundingBox();
    expect(leftBox).toBeTruthy();
    expect(answerBox).toBeTruthy();
    expect(answerBox.x).toBeGreaterThan(leftBox.x);

    await page.fill('#trig-angle', '30');
    await page.click('#trig-calc');

    await expect(page.locator('#trig-result')).toContainText('30 deg (pi/6 rad)');
    await expect(page.locator('#trig-result')).toContainText('0.5 (1/2)');
    await expect(page.locator('#trig-result')).toContainText('0.866025 (sqrt(3)/2)');
    await expect(page.locator('[data-trig-snap="quadrant"]')).toHaveText('I');
  });

  test('radian mode and graph focus update together', async ({ page }) => {
    await page.goto('/math/trigonometry/trig-functions/');

    await page.click('[data-button-group="trig-angle-unit"] [data-value="rad"]');
    await page.fill('#trig-angle', '1.047198');
    await page.selectOption('#trig-graph-function', 'tan');
    await page.fill('#trig-amplitude', '1.5');
    await page.click('#trig-calc');

    await expect(page.locator('#trig-result')).toContainText('1.047198 rad');
    await expect(page.locator('#trig-result')).toContainText('1.732053');
    await expect(page.locator('#trig-detail')).toContainText('Graph focus: tan(x), amplitude 1.5');
    await expect(page.locator('[data-trig-snap="function"]')).toHaveText('tan(x)');
    await expect(page.locator('#trig-graph-note')).toContainText('Graph shows tan(x)');
  });
});
