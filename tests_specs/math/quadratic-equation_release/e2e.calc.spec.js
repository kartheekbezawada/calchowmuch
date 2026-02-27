import { expect, test } from '@playwright/test';

test.describe('math/quadratic-equation e2e', () => {
  test('single-pane render and happy-path solve', async ({ page }) => {
    await page.goto('/math/algebra/quadratic-equation/');

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);

    await page.fill('#quad-a', '1');
    await page.fill('#quad-b', '-5');
    await page.fill('#quad-c', '6');
    await page.click('#quad-solve');

    await expect(page.locator('#quad-result')).toContainText('Two Real Solutions');
    await expect(page.locator('#quad-result')).toContainText('x1 = 3');
    await expect(page.locator('#quad-result')).toContainText('x2 = 2');
    await expect(page.locator('#quad-detail')).toContainText('Discriminant');
  });

  test('complex-root path', async ({ page }) => {
    await page.goto('/math/algebra/quadratic-equation/');

    await page.fill('#quad-a', '1');
    await page.fill('#quad-b', '0');
    await page.fill('#quad-c', '1');
    await page.click('#quad-solve');

    await expect(page.locator('#quad-result')).toContainText('Two Complex Solutions');
    await expect(page.locator('#quad-result')).toContainText('i');
  });
});
