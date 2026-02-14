import { expect, test } from '@playwright/test';

test.describe('Offset calculator route contract', () => {
  test('ISS-OFFSET-HOMELOAN-VISUAL: single-pane route and interaction contract', async ({ page }) => {
    await page.goto('/loans/offset-calculator');

    const centerPanels = page.locator('.center-column > .panel');
    await expect(centerPanels).toHaveCount(1);

    const panel = centerPanels.first();
    await expect(panel).toHaveClass(/panel-span-all/);
    await expect(panel.locator('#calc-offset-calculator')).toBeVisible();
    await expect(panel.locator('#loan-offset-explanation')).toBeVisible();
    await expect(panel.locator('h3:has-text("Explanation")')).toHaveCount(0);

    await expect(page.locator('#off-balance')).toHaveAttribute('type', 'range');
    await expect(page.locator('#off-rate')).toHaveAttribute('type', 'range');
    await expect(page.locator('#off-term')).toHaveAttribute('type', 'range');
    await expect(page.locator('#off-savings')).toHaveAttribute('type', 'range');
    await expect(page.locator('#off-contribution')).toHaveAttribute('type', 'range');

    await page.locator('#off-calculate').click();
    await page.waitForFunction(() => {
      const node = document.querySelector('#off-result .mtg-result-value');
      return node && node.textContent.trim() !== '';
    });

    await expect(page.locator('#off-result')).toContainText('Monthly Payment');
    await expect(page.locator('[data-off="effective-balance"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-off="interest-saved"]')).toContainText(/[0-9]/);

    await expect(page.locator('#off-table-monthly-wrap')).toHaveClass(/is-hidden/);
    await expect(page.locator('#off-table-yearly-wrap')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#off-table-yearly-body tr')).not.toHaveCount(0);

    await page.locator('#off-view-monthly').click();
    await expect(page.locator('#off-table-monthly-wrap')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#off-table-monthly-body tr')).not.toHaveCount(0);

    await expect(page.locator('#loan-offset-explanation .bor-faq-card')).toHaveCount(10);
    await expect(page.locator('#loan-offset-explanation')).not.toContainText(/[£$€₹¥]/);
  });
});
