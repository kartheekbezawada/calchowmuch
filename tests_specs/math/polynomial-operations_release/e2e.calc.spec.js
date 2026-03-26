import { expect, test } from '@playwright/test';

test.describe('math/polynomial-operations e2e', () => {
  test('single-pane flow, right preview panel, and addition result', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/algebra/polynomial-operations/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.poly-answer-card')).toBeVisible();

    const formBox = await page.locator('.poly-input-card').boundingBox();
    const previewBox = await page.locator('.poly-answer-card').boundingBox();
    expect(formBox).toBeTruthy();
    expect(previewBox).toBeTruthy();
    expect(previewBox.x).toBeGreaterThan(formBox.x);

    await page.click('[data-button-group="poly-operation"] [data-value="add"]');
    await page.fill('#poly1', '2x^2 + 3x - 1');
    await page.fill('#poly2', 'x^2 - x + 2');
    await page.click('#calculate-poly');

    await expect(page.locator('#poly-result')).toContainText('Result: 3x^2 + 2x + 1');
    await expect(page.locator('[data-poly-snap="operation"]')).toHaveText('Add');
    await expect(page.locator('[data-poly-snap="degree"]')).toHaveText('2');
    await expect(page.locator('#poly-detail')).toContainText('Operation:');
  });

  test('division by zero polynomial shows deterministic error snapshot state', async ({ page }) => {
    await page.goto('/math/algebra/polynomial-operations/');

    await page.click('[data-button-group="poly-operation"] [data-value="divide"]');
    await page.fill('#poly1', 'x^2 + 1');
    await page.fill('#poly2', '0');
    await page.click('#calculate-poly');

    await expect(page.locator('#poly-result')).toContainText('Cannot divide by a zero polynomial');
    await expect(page.locator('[data-poly-snap="operation"]')).toHaveText('Divide');
    await expect(page.locator('[data-poly-snap="result"]')).toHaveText('-');
    await expect(page.locator('[data-poly-snap="remainder"]')).toHaveText('-');
  });
});
