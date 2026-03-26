import { expect, test } from '@playwright/test';

test.describe('math/series-convergence e2e', () => {
  test('single-pane rendering and series verdict stay visible while switching tests', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/calculus/series-convergence/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.series-answer-card')).toBeVisible();
    await expect(page.locator('.series-steps-card')).toBeVisible();
    await expect(page.locator('#series-result')).toContainText('Test Used');
    await expect(page.locator('#series-result')).toContainText('CONVERGES');

    await page.fill('#series-term', 'n/2^n');
    await page.locator('.test-button[data-test="ratio"]').click();
    await page.click('#series-calculate');

    await expect(page.locator('#series-result')).toContainText('Test Used: Ratio Test');
    await expect(page.locator('#series-result')).toContainText('CONVERGES');
    await expect(page.locator('#series-steps')).toContainText('RATIO TEST');
  });
});
