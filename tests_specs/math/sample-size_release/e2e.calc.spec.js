import { expect, test } from '@playwright/test';

test.describe('Sample Size Calculator', () => {
  test('SAMPLE-SIZE-E2E-1: single-pane proportion workflow with preset and breakdown', async ({
    page,
  }) => {
    await page.goto('/math/sample-size/');

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('[data-button-group="ss-mode"] button')).toHaveCount(2);
    await expect(page.locator('[data-ss-preset]')).toHaveCount(4);

    await page.locator('[data-ss-preset="general-survey"]').click();
    await expect(page.locator('[data-ss-preset="general-survey"]')).toHaveAttribute(
      'aria-pressed',
      'true'
    );

    await expect(page.locator('#ss-result-value')).toHaveText('385');
    await expect(page.locator('#ss-method-output')).toHaveText('Proportion estimate');
    await expect(page.locator('#ss-confidence-output')).toContainText('95%');
    await expect(page.locator('#ss-base-output')).toHaveText('384.16');
    await expect(page.locator('#ss-corrected-output')).toHaveText('Not applied');
    await expect(page.locator('#ss-steps .ss-step-item')).toHaveCount(5);
    await expect(page.locator('#ss-interpretation')).toContainText('conservative sample target');
  });

  test('SAMPLE-SIZE-E2E-2: mean workflow supports finite population and does not auto-recompute', async ({
    page,
  }) => {
    await page.goto('/math/sample-size/');

    await page.locator('[data-value="mean"]').click();
    await expect(page.locator('[data-mode-panel="mean"]')).toBeVisible();
    await expect(page.locator('[data-mode-panel="proportion"]')).toBeHidden();

    await page.locator('[data-ss-preset="lab-mean"]').click();

    await expect(page.locator('#ss-result-value')).toHaveText('62');
    await expect(page.locator('#ss-method-output')).toHaveText('Mean estimate');
    await expect(page.locator('#ss-variable-output')).toHaveText('8');

    await page.locator('#ss-population').fill('180');
    await expect(page.locator('#ss-result-value')).toHaveText('--');
    await expect(page.locator('#ss-result-summary')).toContainText('Inputs changed');

    await page.locator('#ss-calculate').click();

    await expect(page.locator('#ss-result-value')).toHaveText('47');
    await expect(page.locator('#ss-corrected-output')).toHaveText('46.01');
    await expect(page.locator('#ss-interpretation')).toContainText('reduces the required sample');
  });

  test('SAMPLE-SIZE-E2E-3: mobile order keeps calculator before explanation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/math/sample-size/');

    const calculatorRoot = page.locator('#calc-sample-size');
    const explanationRoot = page.locator('#sample-size-explanation');

    await expect(calculatorRoot).toBeVisible();
    await expect(explanationRoot).toBeVisible();

    const calculatorBox = await calculatorRoot.boundingBox();
    const explanationBox = await explanationRoot.boundingBox();

    expect(calculatorBox).toBeTruthy();
    expect(explanationBox).toBeTruthy();
    expect(calculatorBox.y).toBeLessThan(explanationBox.y);
  });
});
