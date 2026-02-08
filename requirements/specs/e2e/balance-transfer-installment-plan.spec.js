import { expect, test } from '@playwright/test';

test.describe('Balance Transfer Calculator', () => {
  test('BALTRANSFER-TEST-E2E-1: load, nav, calculate, verify results', async ({ page }) => {
    await page.goto('/loans/balance-transfer-installment-plan');

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Credit Card');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Balance Transfer');

    await page.locator('#cc-bt-balance').fill('6000');
    await page.locator('#cc-bt-fee').fill('3');
    await page.locator('#cc-bt-promo-apr').fill('0');
    await page.locator('#cc-bt-promo-months').fill('12');
    await page.locator('#cc-bt-post-apr').fill('17.9');
    await page.locator('#cc-bt-payment').fill('250');
    await page.locator('#cc-bt-calc').click();

    const resultsList = page.locator('#cc-bt-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);

    const results = resultsList.locator('.result-line');
    await expect(results).toHaveCount(4);
    await expect(results.nth(0)).toContainText('Payoff time');
    await expect(results.nth(0)).toContainText('months');
    await expect(results.nth(1)).toContainText('Total interest');
    await expect(results.nth(2)).toContainText('Total fees');
    await expect(results.nth(3)).toContainText('Total paid');

    const tableRows = page.locator('#cc-bt-table-body tr');
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('BALTRANSFER-TEST-E2E-2: input change resets results (UI-2.6)', async ({ page }) => {
    await page.goto('/loans/balance-transfer-installment-plan');

    await page.locator('#cc-bt-calc').click();

    const resultsList = page.locator('#cc-bt-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);

    await page.locator('#cc-bt-balance').fill('8000');

    await expect(resultsList).toHaveClass(/is-hidden/);
    await expect(page.locator('#cc-bt-placeholder')).toBeVisible();

    await page.locator('#cc-bt-calc').click();
    await expect(resultsList).not.toHaveClass(/is-hidden/);
  });

  test('BALTRANSFER-TEST-E2E-3: explanation pane has 10 FAQ items', async ({ page }) => {
    await page.goto('/loans/balance-transfer-installment-plan');

    const explanation = page.locator('#cc-bt-explanation');
    await expect(explanation).toContainText('Balance Transfer Summary');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.faq-box')).toHaveCount(10);
  });
});
