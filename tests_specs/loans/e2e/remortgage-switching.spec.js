import { expect, test } from '@playwright/test';

test.describe('Remortgage / Switching Hybrid', () => {
  test('ISS-REMORT-HYBRID: single-pane ownership and interaction contract', async ({ page }) => {
    await page.goto('/loans/remortgage-switching');

    const centerPanels = page.locator('.center-column > .panel');
    await expect(centerPanels).toHaveCount(1);

    const panel = centerPanels.first();
    await expect(panel).toHaveClass(/panel-span-all/);
    await expect(panel.locator('#calc-remortgage-switching')).toBeVisible();
    await expect(panel.locator('#loan-remortgage-explanation')).toBeVisible();

    // Explanation heading is removed in single-pane generation.
    await expect(panel.locator('h3:has-text("Explanation")')).toHaveCount(0);

    // Fees UI removed.
    await expect(page.locator('[data-button-group="remo-fees-toggle"]')).toHaveCount(0);
    await expect(page.locator('#remo-new-fees')).toHaveCount(0);
    await expect(page.locator('#remo-exit-fees')).toHaveCount(0);
    await expect(page.locator('#remo-legal-fees')).toHaveCount(0);

    // Horizon slider contract.
    const horizon = page.locator('#remo-horizon-years');
    await expect(horizon).toHaveAttribute('min', '2');
    await expect(horizon).toHaveAttribute('max', '10');
    await expect(horizon).toHaveAttribute('step', '1');
    await expect(page.locator('.remo-horizon-tick-row span')).toHaveCount(9);

    // Defaults should render immediately (yearly is default).
    await expect(page.locator('#remo-metric-total')).toContainText(/[0-9]/);
    await expect(page.locator('#remo-table-monthly-wrap')).toHaveClass(/is-hidden/);
    await expect(page.locator('#remo-table-yearly-wrap')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#remo-table-yearly-body tr')).toHaveCount(5);

    // Explicit calculate remains available and stable.
    await page.locator('#remo-calculate').click();
    await page.waitForFunction(() => {
      const metric = document.querySelector('#remo-metric-monthly');
      return metric && metric.textContent.trim() !== '' && metric.textContent.trim() !== '--';
    });

    // View toggle switches wrapped tables.
    await page.locator('#remo-view-monthly').click();
    await expect(page.locator('#remo-table-monthly-wrap')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#remo-table-yearly-wrap')).toHaveClass(/is-hidden/);
    await expect(page.locator('#remo-table-monthly-body tr')).toHaveCount(60);

    // FAQ contract (10 cards).
    await expect(page.locator('#loan-remortgage-explanation .remo-faq-card')).toHaveCount(10);

    // Currency symbol prohibition.
    await expect(page.locator('#loan-remortgage-explanation')).not.toContainText(/[£$€₹¥]/);
  });
});
