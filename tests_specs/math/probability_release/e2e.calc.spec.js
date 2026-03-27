import { expect, test } from '@playwright/test';

test.describe('math/probability e2e', () => {
  test('single-pane rendering and probability answers are visible on first load', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/probability/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.prob-answer-card')).toBeVisible();
    await expect(page.locator('#prob-result')).toContainText('0.65');
    await expect(page.locator('#prob-result')).toContainText('65');

    await page.click('[data-button-group="prob-mode"] button[data-value="conditional"]');
    await page.click('#prob-calculate');
    await expect(page.locator('#prob-result')).toContainText('P(A|B)');
    await expect(page.locator('#prob-result')).toContainText('30');
    await expect(page.locator('#prob-result')).toContainText('50');
    await expect(page.locator('#prob-detail')).toContainText('Conditional probabilities');
  });
});
