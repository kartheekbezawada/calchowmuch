import { expect, test } from '@playwright/test';

test.describe('math/inverse-trig e2e', () => {
  test('single-pane rendering, answer-first layout, and arcsin interval solutions', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/trigonometry/inverse-trig/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.inv-answer-card')).toBeVisible();

    const inputBox = await page.locator('.inv-input-card').boundingBox();
    const answerBox = await page.locator('.inv-answer-card').boundingBox();
    expect(inputBox).toBeTruthy();
    expect(answerBox).toBeTruthy();
    expect(answerBox.x).toBeGreaterThan(inputBox.x);

    await page.selectOption('#inv-function', 'arcsin');
    await page.fill('#inv-value', '0.5');
    await page.click('#inv-calc');

    await expect(page.locator('#inv-result')).toContainText('30 deg (0.523599 rad)');
    await expect(page.locator('#inv-detail')).toContainText('150 deg (2.617994 rad)');
    await expect(page.locator('[data-inv-snap="count"]')).toHaveText('4');
  });

  test('radian mode and arctan interval update together', async ({ page }) => {
    await page.goto('/math/trigonometry/inverse-trig/');

    await page.selectOption('#inv-function', 'arctan');
    await page.fill('#inv-value', '1');
    await page.click('[data-button-group="inv-output-unit"] [data-value="rad"]');
    await page.fill('#inv-interval-start', '-3.141593');
    await page.fill('#inv-interval-end', '3.141593');
    await page.click('#inv-calc');

    await expect(page.locator('#inv-result')).toContainText('45 deg (pi/4 rad)');
    await expect(page.locator('#inv-detail')).toContainText('-135 deg (-3pi/4 rad)');
    await expect(page.locator('[data-inv-snap="function"]')).toHaveText('arctan');
    await expect(page.locator('[data-inv-snap="unit"]')).toHaveText('Radians');
  });
});
