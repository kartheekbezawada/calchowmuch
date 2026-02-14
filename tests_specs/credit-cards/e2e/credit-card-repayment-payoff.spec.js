import { expect, test } from '@playwright/test';

test.describe('Credit Card Repayment Calculator', () => {
  test('REPAYMENT-TEST-E2E-1: load, nav, calculate, verify results', async ({ page }) => {
    await page.goto('/loans/credit-card-repayment-payoff');

    const centerPanels = page.locator('.center-column > .panel');
    await expect(centerPanels).toHaveCount(1);
    const singlePanel = centerPanels.first();
    await expect(singlePanel).toHaveClass(/panel-span-all/);
    await expect(singlePanel.locator('h3:has-text("Explanation")')).toHaveCount(0);

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Credit Card');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Repayment');

    await page.locator('#cc-payoff-balance').fill('5000');
    await page.locator('#cc-payoff-apr').fill('18');
    await page.locator('#cc-payoff-payment').fill('200');
    await page.locator('#cc-payoff-extra').fill('0');
    await page.locator('#cc-payoff-calc').click();

    const resultsList = page.locator('#cc-payoff-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);

    const results = resultsList.locator('.result-line');
    await expect(results).toHaveCount(7);
    await expect(results.nth(0)).toContainText('Current Balance');
    await expect(results.nth(1)).toContainText('APR');
    await expect(results.nth(2)).toContainText('Monthly Payment');
    await expect(results.nth(3)).toContainText('Extra Monthly');
    await expect(results.nth(4)).toContainText('Estimated Payoff Time');
    await expect(results.nth(4)).toContainText('months');
    await expect(results.nth(5)).toContainText('Total Interest');
    await expect(results.nth(6)).toContainText('Total Paid');

    const tableRows = page.locator('#cc-payoff-table-body tr');
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);

    const hasHorizontalScroll = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth > root.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('REPAYMENT-TEST-E2E-2: projected horizon remains visible after input change', async ({ page }) => {
    await page.goto('/loans/credit-card-repayment-payoff');

    await page.locator('#cc-payoff-calc').click();

    const resultsList = page.locator('#cc-payoff-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);

    await page.locator('#cc-payoff-balance').fill('6000');

    await expect(resultsList).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#cc-payoff-placeholder')).toHaveClass(/is-hidden/);

    await page.locator('#cc-payoff-calc').click();
    await expect(resultsList).not.toHaveClass(/is-hidden/);
  });

  test('REPAYMENT-TEST-E2E-3: explanation pane has 10 FAQ items', async ({ page }) => {
    await page.goto('/loans/credit-card-repayment-payoff');

    const explanation = page.locator('#cc-payoff-explanation');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.faq-box')).toHaveCount(10);
  });
});
