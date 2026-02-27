import { expect, test } from '@playwright/test';

test.describe('math/factoring e2e', () => {
  test('single-pane rendering and factoring flow', async ({ page }) => {
    await page.goto('/math/algebra/factoring/');

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);

    await page.fill('#factor-poly', 'x^2 + 5x + 6');
    await page.click('#factor-calculate');

    await expect(page.locator('#factor-result')).toContainText('Factored Form');
    await expect(page.locator('#factor-result')).toContainText('x + 2');
    await expect(page.locator('#factor-result')).toContainText('x + 3');
    await expect(page.locator('#factor-detail')).toContainText('Original Polynomial');
  });

  test('invalid expression error state', async ({ page }) => {
    await page.goto('/math/algebra/factoring/');

    await page.fill('#factor-poly', 'x^^2 + 1');
    await page.click('#factor-calculate');

    await expect(page.locator('#factor-result')).toContainText('Invalid terms');
  });
});
