import { expect, test } from '@playwright/test';

test.describe('math/polynomial-operations e2e', () => {
  test('single-pane flow and addition result', async ({ page }) => {
    await page.goto('/math/algebra/polynomial-operations/');

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);

    await page.click('[data-button-group="poly-operation"] [data-value="add"]');
    await page.fill('#poly1', '2x^2 + 3x - 1');
    await page.fill('#poly2', 'x^2 - x + 2');
    await page.click('#calculate-poly');

    await expect(page.locator('#poly-result')).toContainText('Result: 3x^2 + 2x + 1');
    await expect(page.locator('#poly-detail')).toContainText('Operation:');
  });

  test('division by zero polynomial error', async ({ page }) => {
    await page.goto('/math/algebra/polynomial-operations/');

    await page.click('[data-button-group="poly-operation"] [data-value="divide"]');
    await page.fill('#poly1', 'x^2 + 1');
    await page.fill('#poly2', '0');
    await page.click('#calculate-poly');

    await expect(page.locator('#poly-result')).toContainText('Cannot divide by a zero polynomial');
  });
});
