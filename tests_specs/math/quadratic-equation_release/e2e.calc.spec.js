import { expect, test } from '@playwright/test';

test.describe('math/quadratic-equation e2e', () => {
  test('single-pane render, right preview panel, and happy-path solve', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/algebra/quadratic-equation/');

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.algebra-preview-panel')).toBeVisible();

    const formBox = await page.locator('.algebra-form-panel').boundingBox();
    const previewBox = await page.locator('.algebra-preview-panel').boundingBox();
    expect(formBox).toBeTruthy();
    expect(previewBox).toBeTruthy();
    expect(previewBox.x).toBeGreaterThan(formBox.x);

    await page.fill('#quad-a', '1');
    await page.fill('#quad-b', '-5');
    await page.fill('#quad-c', '6');
    await page.click('#quad-solve');

    await expect(page.locator('#quad-result')).toContainText('Two Real Solutions');
    await expect(page.locator('#quad-result')).toContainText('x1 = 3');
    await expect(page.locator('#quad-result')).toContainText('x2 = 2');
    await expect(page.locator('[data-quad-snap="root-type"]')).toHaveText(/Two real roots/);
    await expect(page.locator('[data-quad-snap="discriminant"]')).toHaveText('1');
  });

  test('invalid quadratic input shows deterministic error state', async ({ page }) => {
    await page.goto('/math/algebra/quadratic-equation/');

    await page.fill('#quad-a', '0');
    await page.fill('#quad-b', '2');
    await page.fill('#quad-c', '1');
    await page.click('#quad-solve');

    await expect(page.locator('#quad-result')).toContainText('Error');
    await expect(page.locator('[data-quad-snap="root-type"]')).toHaveText('Error');
    await expect(page.locator('[data-quad-snap="discriminant"]')).toHaveText('-');
  });
});
