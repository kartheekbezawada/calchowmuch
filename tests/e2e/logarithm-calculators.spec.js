import { test, expect } from '@playwright/test';

test.describe('Logarithm Calculator Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/calculators/math/log/natural-log');
    await page.waitForSelector('#ln-calculate');
  });

  test('LOG-TEST-E2E-LOAD: Natural log calculator loads', async ({ page }) => {
    await expect(page.locator('#ln-calculate')).toBeVisible();
  });

  test('LOG-TEST-E2E-NAV: Log calculator links exist in navigation', async ({ page }) => {
    await page.goto('/#/calculators');
    await expect(page.locator('a[href="#/calculators/math/log/common-log"]')).toBeVisible();
    await expect(page.locator('a[href="#/calculators/math/log/log-scale"]')).toBeVisible();
  });

  test('LOG-TEST-E2E-WORKFLOW: Natural log compute updates result', async ({ page }) => {
    await page.fill('#ln-value', '5');
    await page.click('#ln-calculate');
    const resultContent = await page.locator('#ln-result').textContent();
    expect(resultContent).toContain('ln(5');
  });

  test('LOG-TEST-E2E-MOBILE: Layout stays readable on small viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    await page.waitForSelector('#ln-calculate');
    const helperVisible = await page.isVisible('.helper');
    expect(helperVisible).toBe(true);
  });

  test('LOG-TEST-E2E-A11Y: Inputs have labels', async ({ page }) => {
    const inputs = await page.$$('input');
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        expect(label).toBeGreaterThan(0);
      }
    }
  });
});
