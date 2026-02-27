import { expect, test } from '@playwright/test';

test.describe('math/factoring e2e', () => {
  test('single-pane rendering, right preview panel, and factoring flow', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/algebra/factoring/');

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.algebra-preview-panel')).toBeVisible();

    const formBox = await page.locator('.algebra-form-panel').boundingBox();
    const previewBox = await page.locator('.algebra-preview-panel').boundingBox();
    expect(formBox).toBeTruthy();
    expect(previewBox).toBeTruthy();
    expect(previewBox.x).toBeGreaterThan(formBox.x);

    await page.fill('#factor-poly', 'x^2 + 5x + 6');
    await page.click('#factor-calculate');

    await expect(page.locator('#factor-result')).toContainText('Factored Form');
    await expect(page.locator('#factor-result')).toContainText('x + 2');
    await expect(page.locator('#factor-result')).toContainText('x + 3');
    await expect(page.locator('[data-factor-snap="method"]')).toHaveText(/Quadratic factoring/);
    await expect(page.locator('[data-factor-snap="factored"]')).toContainText('x + 2');
  });

  test('invalid expression error state clears snapshot values deterministically', async ({ page }) => {
    await page.goto('/math/algebra/factoring/');

    await page.fill('#factor-poly', 'x^^2 + 1');
    await page.click('#factor-calculate');

    await expect(page.locator('#factor-result')).toContainText('Invalid terms');
    await expect(page.locator('[data-factor-snap="method"]')).toHaveText('-');
    await expect(page.locator('[data-factor-snap="factored"]')).toHaveText('-');
  });
});
