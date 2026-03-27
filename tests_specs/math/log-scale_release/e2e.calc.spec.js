import { expect, test } from '@playwright/test';

test.describe('math/log-scale e2e', () => {
  test('single-pane rendering, answer-first layout, and decibel solve flow', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/log/log-scale/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.lscale-answer-card')).toBeVisible();
    await expect(page.locator('#scale-guide')).toBeVisible();

    const leftBox = await page.locator('.lscale-left-stack').boundingBox();
    const answerBox = await page.locator('.lscale-answer-card').boundingBox();
    expect(leftBox).toBeTruthy();
    expect(answerBox).toBeTruthy();
    expect(answerBox.x).toBeGreaterThan(leftBox.x);

    await page.selectOption('#scale-type', 'decibel');
    await page.fill('#scale-amplitude', '10');
    await page.fill('#scale-reference', '1');
    await page.click('#scale-calculate');

    await expect(page.locator('#scale-result')).toContainText('Decibel result');
    await expect(page.locator('#scale-result')).toContainText('20');
    await expect(page.locator('#scale-detail')).toContainText('20 × log₁₀(10 / 1)');
    await expect(page.locator('[data-scale-snap="scale"]')).toHaveText('Decibel');
    await expect(page.locator('[data-scale-snap="status"]')).toHaveText('Solved');
    await expect(page.locator('#scale-guide')).toContainText('Positive dB');
  });

  test('pH mode reveals the correct section and converts 1e-7 to 7', async ({ page }) => {
    await page.goto('/math/log/log-scale/');

    await page.selectOption('#scale-type', 'ph');
    await expect(page.locator('#scale-concentration')).toBeVisible();

    await page.fill('#scale-concentration', '1e-7');
    await page.click('#scale-calculate');

    await expect(page.locator('#scale-result')).toContainText('pH result');
    await expect(page.locator('#scale-result')).toContainText('7');
    await expect(page.locator('#scale-detail')).toContainText('pH = -log₁₀([H⁺])');
    await expect(page.locator('[data-scale-snap="scale"]')).toHaveText('pH');
    await expect(page.locator('#scale-guide')).toContainText('Neutral point');
  });
});
