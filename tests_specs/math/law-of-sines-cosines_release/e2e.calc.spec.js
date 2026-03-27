import { expect, test } from '@playwright/test';

test.describe('math/law-of-sines-cosines e2e', () => {
  test('single-pane rendering, answer-first layout, and SSS solve flow', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/trigonometry/law-of-sines-cosines/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.law-answer-card')).toBeVisible();
    await expect(page.locator('#law-triangle')).toBeVisible();

    const leftBox = await page.locator('.law-left-stack').boundingBox();
    const answerBox = await page.locator('.law-answer-card').boundingBox();
    expect(leftBox).toBeTruthy();
    expect(answerBox).toBeTruthy();
    expect(answerBox.x).toBeGreaterThan(leftBox.x);

    await page.selectOption('#law-method', 'auto');
    await page.fill('#law-a', '7');
    await page.fill('#law-b', '9');
    await page.fill('#law-c', '12');
    await page.fill('#law-A', '');
    await page.fill('#law-B', '');
    await page.fill('#law-C', '');
    await page.click('#law-calc');

    await expect(page.locator('#law-result')).toContainText('Solved Triangle');
    await expect(page.locator('#law-result')).toContainText('Law of Cosines');
    await expect(page.locator('#law-result')).toContainText('35.430945 deg');
    await expect(page.locator('[data-law-snap="type"]')).toHaveText('SSS');
    await expect(page.locator('[data-law-snap="law"]')).toHaveText('Law of Cosines');
    await expect(page.locator('#law-diagram-note')).toContainText('Diagram matches the solved triangle.');
  });

  test('ASA flow recommends the Law of Sines and solves the remaining sides', async ({ page }) => {
    await page.goto('/math/trigonometry/law-of-sines-cosines/');

    await page.selectOption('#law-method', 'sine');
    await page.fill('#law-a', '');
    await page.fill('#law-b', '');
    await page.fill('#law-c', '10');
    await page.fill('#law-A', '35');
    await page.fill('#law-B', '45');
    await page.fill('#law-C', '');
    await page.click('#law-calc');

    await expect(page.locator('#law-result')).toContainText('Law of Sines');
    await expect(page.locator('#law-result')).toContainText('Primary solution');
    await expect(page.locator('#law-detail')).toContainText('Identify the triangle pattern from the known inputs: ASA.');
    await expect(page.locator('[data-law-snap="type"]')).toHaveText('ASA');
    await expect(page.locator('[data-law-snap="law"]')).toHaveText('Law of Sines');
  });
});
