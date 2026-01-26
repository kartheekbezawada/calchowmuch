import { expect, test } from '@playwright/test';

test.describe('Remortgage / Switching', () => {
  test('ISS-REMORT: outputs owned by explanation pane', async ({ page }) => {
    await page.goto('/#/calculators/remortgage-switching');

    const calcPane = page.locator('.center-column .panel').first();
    const explanationPane = page.locator('.center-column .panel').last();

    await expect(calcPane.locator('#calc-remortgage-switching')).toBeVisible();
    await expect(explanationPane.locator('#loan-remortgage-explanation')).toBeVisible();

    // ISS-REMORT-1: No outputs in calculation pane
    await expect(calcPane.locator('table')).toHaveCount(0);
    await expect(calcPane.locator('.graph-panel')).toHaveCount(0);
    await expect(calcPane.locator('h4:has-text("Remortgage Summary")')).toHaveCount(0);

    // ISS-REMORT-2/3: Outputs exist in explanation pane and are not duplicated
    await expect(explanationPane.locator('#loan-remortgage-explanation')).toHaveCount(1);
    await expect(page.locator('#loan-remortgage-explanation')).toHaveCount(1);
    await expect(page.locator('#remo-table')).toHaveCount(1);
    await expect(page.locator('#remo-graph')).toHaveCount(1);

    // REMO-UI-8/9/10: button labels and no pre-calculation outputs
    await expect(calcPane.locator('#remo-calculate')).toHaveText(/Calculate/);
    await expect(page.locator('#remo-fees-options')).toHaveClass(/is-hidden/);
    await expect(explanationPane.locator('#remo-outputs')).toHaveClass(/is-hidden/);

    // Trigger first calculation
    await calcPane.locator('#remo-calculate').click();
    await expect(explanationPane.locator('#remo-outputs')).not.toHaveClass(/is-hidden/);

    // ISS-REMORT-4: Currency symbol prohibition in rendered outputs
    const explanationRoot = explanationPane.locator('#loan-remortgage-explanation');
    await expect(explanationRoot).not.toContainText(/[£$€₹¥]/);

    // REMO-UI-8: Exclude/Include additional fees affects fees total
    const fees = explanationRoot.locator('[data-remo="fees"]');
    await expect(fees).toContainText(/1,?500/);
    await calcPane.locator('button[data-value="include"]').click();
    await expect(page.locator('#remo-fees-options')).not.toHaveClass(/is-hidden/);
    await expect(fees).toContainText(/3,?000/);
    await calcPane.locator('button[data-value="exclude"]').click();
    await expect(page.locator('#remo-fees-options')).toHaveClass(/is-hidden/);
    await expect(fees).toContainText(/1,?500/);

    // Dynamic updates (post user action): input change updates outputs
    const savings = explanationRoot.locator('[data-remo="total-savings"]');
    const originalSavings = (await savings.textContent())?.trim() ?? '';
    await page.locator('#remo-new-rate').fill('1');
    await expect(savings).not.toHaveText(originalSavings);

    // ISS-REMORT-5: Graph hover tooltip shows time period + both values
    const tooltip = page.locator('#remo-graph-tooltip');
    await expect(tooltip).toHaveClass(/is-hidden/);
    await page.locator('#remo-graph .graph-main').hover({ position: { x: 120, y: 40 } });
    await expect(tooltip).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#remo-graph-tooltip-title')).toContainText('Month');
    await expect(page.locator('#remo-graph-tooltip-current')).toContainText('Current:');
    await expect(page.locator('#remo-graph-tooltip-new')).toContainText('New:');
  });
});
