import { expect, test } from '@playwright/test';

test.describe('Sample Size Calculator', () => {
  test('SAMPLE-SIZE-E2E-1: first load shows solved default example with visible planning output', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/math/sample-size/');

    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('[data-button-group="ss-mode"] button')).toHaveCount(2);
    await expect(page.locator('[data-ss-preset]')).toHaveCount(4);
    await expect(page.locator('#ss-preset-state')).toHaveText(
      'Loaded preset: General survey baseline'
    );

    await expect(page.locator('#ss-result-value')).toHaveText('385');
    await expect(page.locator('#ss-method-output')).toHaveText('Proportion estimate');
    await expect(page.locator('#ss-confidence-output')).toContainText('95%');
    await expect(page.locator('#ss-base-output')).toHaveText('384.16');
    await expect(page.locator('#ss-corrected-output')).toHaveText('Not applied');
    await expect(page.locator('#ss-steps .ss-step-item')).toHaveCount(6);
    await expect(page.locator('#ss-interpretation')).toContainText('you need at least 385 responses');
    await expect(page.locator('#ss-sensitivity-body tr')).toHaveCount(7);

    const modeBox = await page.locator('.ss-mode-card').boundingBox();
    const inputBox = await page.locator('.ss-input-card').boundingBox();
    const answerBox = await page.locator('#ss-answer-section').boundingBox();
    const presetsBox = await page.locator('.ss-presets-card').boundingBox();
    const studyBox = await page.locator('.ss-sensitivity-card').boundingBox();
    const explanationBox = await page.locator('#sample-size-explanation .ss-exp-intro').boundingBox();

    expect(modeBox).toBeTruthy();
    expect(inputBox).toBeTruthy();
    expect(answerBox).toBeTruthy();
    expect(presetsBox).toBeTruthy();
    expect(studyBox).toBeTruthy();
    expect(explanationBox).toBeTruthy();
    expect(modeBox.y).toBeLessThan(inputBox.y);
    expect(modeBox.y).toBeLessThan(answerBox.y);
    expect(inputBox.y).toBeLessThan(presetsBox.y);
    expect(answerBox.y).toBeLessThan(presetsBox.y);
    expect(Math.abs(studyBox.x - explanationBox.x)).toBeLessThan(4);
    expect(Math.abs(studyBox.width - explanationBox.width)).toBeLessThan(4);
  });

  test('SAMPLE-SIZE-E2E-2: mean mode updates preset relevance and preserves stale results until recalc', async ({
    page,
  }) => {
    await page.goto('/math/sample-size/');

    await page.locator('[data-value="mean"]').click();
    await expect(page.locator('[data-mode-panel="mean"]')).toBeVisible();
    await expect(page.locator('[data-mode-panel="proportion"]')).toBeHidden();
    await expect(page.locator('[data-ss-preset="general-survey"]')).toHaveClass(/is-muted/);
    await expect(page.locator('[data-ss-preset="lab-mean"]')).not.toHaveClass(/is-muted/);

    await page.locator('[data-ss-preset="lab-mean"]').click();

    await expect(page.locator('#ss-result-value')).toHaveText('62');
    await expect(page.locator('#ss-method-output')).toHaveText('Mean estimate');
    await expect(page.locator('#ss-variable-output')).toHaveText('8');
    await expect(page.locator('#ss-preset-state')).toHaveText(
      'Loaded preset: Laboratory mean estimate'
    );

    await page.locator('#ss-population').fill('180');
    await expect(page.locator('#ss-result-value')).toHaveText('62');
    await expect(page.locator('#ss-result-summary')).toContainText(
      'Showing the last valid result'
    );
    await expect(page.locator('#ss-preset-state')).toHaveText('Customised inputs');
    await expect(page.locator('#ss-answer-section')).toHaveClass(/is-dirty/);

    await page.locator('#ss-calculate').click();

    await expect(page.locator('#ss-result-value')).toHaveText('47');
    await expect(page.locator('#ss-corrected-output')).toHaveText('46.01');
    await expect(page.locator('#ss-interpretation')).toContainText('corrected sample target is 47');
  });

  test('SAMPLE-SIZE-E2E-3: invalid inputs show inline errors while preserving the last valid result', async ({
    page,
  }) => {
    await page.goto('/math/sample-size/');

    await expect(page.locator('#ss-result-value')).toHaveText('385');

    await page.locator('#ss-margin').fill('0');
    await page.locator('#ss-calculate').click();

    await expect(page.locator('#ss-margin-error')).toHaveText(
      'Margin of error must be greater than 0%.'
    );
    await expect(page.locator('#ss-result-value')).toHaveText('385');
    await expect(page.locator('#ss-result-summary')).toContainText(
      'Inputs are invalid. Showing the last valid result'
    );
    await expect(page.locator('#ss-answer-section')).toHaveClass(/is-invalid/);
  });

  test('SAMPLE-SIZE-E2E-4: mobile order keeps calculator before explanation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/math/sample-size/');

    const topNav = page.locator('.top-nav');
    const modeCard = page.locator('.ss-mode-card');
    const inputCard = page.locator('.ss-input-card');
    const answerCard = page.locator('#ss-answer-section');
    const presetsCard = page.locator('.ss-presets-card');
    const calculatorRoot = page.locator('#calc-sample-size');
    const explanationRoot = page.locator('#sample-size-explanation');

    await expect(topNav).toHaveCount(0);
    await expect(modeCard).toBeVisible();
    await expect(inputCard).toBeVisible();
    await expect(answerCard).toBeVisible();
    await expect(presetsCard).toBeVisible();
    await expect(calculatorRoot).toBeVisible();
    await expect(explanationRoot).toBeVisible();

    const modeBox = await modeCard.boundingBox();
    const inputBox = await inputCard.boundingBox();
    const answerBox = await answerCard.boundingBox();
    const presetsBox = await presetsCard.boundingBox();
    const calculatorBox = await calculatorRoot.boundingBox();
    const explanationBox = await explanationRoot.boundingBox();
    const bodyOverflow = await page.evaluate(() => ({
      doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      body: document.body.scrollWidth - document.body.clientWidth,
    }));

    expect(modeBox).toBeTruthy();
    expect(inputBox).toBeTruthy();
    expect(answerBox).toBeTruthy();
    expect(presetsBox).toBeTruthy();
    expect(calculatorBox).toBeTruthy();
    expect(explanationBox).toBeTruthy();
    expect(modeBox.y).toBeLessThan(inputBox.y);
    expect(inputBox.y).toBeLessThan(answerBox.y);
    expect(answerBox.y).toBeLessThan(presetsBox.y);
    expect(calculatorBox.y).toBeLessThan(explanationBox.y);
    expect(bodyOverflow.doc).toBeLessThanOrEqual(1);
    expect(bodyOverflow.body).toBeLessThanOrEqual(1);
  });
});
