import { expect, test } from '@playwright/test';

test.describe('math/system-of-equations e2e', () => {
  test('single-pane rendering and 2x2 solve flow', async ({ page }) => {
    await page.goto('/math/algebra/system-of-equations/');

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);

    await page.click('[data-button-group="system-size"] [data-value="2x2"]');
    await page.fill('#a11', '1');
    await page.fill('#a12', '2');
    await page.fill('#b1', '5');
    await page.fill('#a21', '3');
    await page.fill('#a22', '4');
    await page.fill('#b2', '11');
    await page.click('#solve-system');

    await expect(page.locator('#system-result')).toContainText('Unique Solution');
    await expect(page.locator('#system-result')).toContainText('x = 1');
    await expect(page.locator('#system-result')).toContainText('y = 2');
  });

  test('3x3 mode toggles and produces output', async ({ page }) => {
    await page.goto('/math/algebra/system-of-equations/');

    await page.click('[data-button-group="system-size"] [data-value="3x3"]');
    await expect(page.locator('#system-3x3')).toBeVisible();

    await page.click('#solve-system');
    await expect(page.locator('#system-result')).toContainText('No Unique Solution');
  });
});
