import { expect, test } from '@playwright/test';

test.describe('Credit Card Minimum Payment Calculator', () => {
  test('MINPAY-TEST-E2E-1: load, nav, calculate, verify results', async ({ page }) => {
    await page.goto('/loans/credit-card-minimum-payment');

    await expect(page.locator('#calculator-title')).toHaveText('Credit Card Minimum Payment');
    await expect(page.locator('label[for="cc-min-floor"]')).toHaveText('Lowest Monthly Payment ($)');
    await expect(page.locator('#calc-cc-min .cc-min-provider-note')).toContainText(
      "Minimum Payment Rate (%) and Minimum Payment Floor (lowest monthly payment) vary by credit card provider. Check your provider's Terms & Conditions for exact values."
    );

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Credit Card');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Minimum Payment');

    await expect(page.locator('select')).toHaveCount(0);
    await expect(page.locator('#cc-min-table-body .cc-min-table-placeholder-row')).toHaveCount(0);
    await expect(page.locator('#cc-min-table-body tr')).toHaveCount(21);

    await page.locator('#cc-min-balance').fill('5000');
    await page.locator('#cc-min-apr').fill('19.5');
    await page.locator('#cc-min-rate').fill('2.5');
    await page.locator('#cc-min-floor').fill('30');
    await page.locator('#cc-min-calc').click();

    const resultsList = page.locator('#cc-min-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);
    await expect(resultsList.locator('.result-line')).toHaveCount(1);
    await expect(resultsList).toContainText('Payoff time');
    await expect(resultsList).toContainText('months');

    const summary = page.locator('#cc-min-summary');
    await expect(summary).not.toHaveClass(/is-hidden/);
    await expect(summary).toContainText('Total interest');
    await expect(summary).toContainText('Total paid');
    await expect(summary).toContainText('First payment');

    const tableRows = page.locator('#cc-min-table-body tr');
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
    await expect(page.locator('#cc-min-table-body .cc-min-table-placeholder-row')).toHaveCount(0);

    const summaryValue = page.locator('#cc-min-explanation [data-cc-min="balance"]').first();
    await expect(summaryValue).not.toHaveText('—');

    const currencySensitiveKeys = ['balance', 'floor', 'first-payment', 'interest', 'total'];
    for (const key of currencySensitiveKeys) {
      const text = (await page.locator(`#cc-min-explanation [data-cc-min="${key}"]`).first().textContent()) || '';
      expect(text).not.toContain('US$');
      expect(text).not.toContain('$');
    }

    const chipStyles = await summaryValue.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        outlineStyle: computed.outlineStyle,
        paddingLeft: computed.paddingLeft,
      };
    });
    expect(chipStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(chipStyles.outlineStyle).toBe('solid');
    expect(Number.parseFloat(chipStyles.paddingLeft)).toBeGreaterThan(0);
  });

  test('MINPAY-TEST-E2E-2: input change resets to placeholder until next calculate', async ({ page }) => {
    await page.goto('/loans/credit-card-minimum-payment');

    await page.locator('#cc-min-calc').click();
    await expect(page.locator('#cc-min-results-list')).not.toHaveClass(/is-hidden/);

    await page.locator('#cc-min-balance').fill('6400');

    await expect(page.locator('#cc-min-placeholder')).toBeVisible();
    await expect(page.locator('#cc-min-results-list')).toHaveClass(/is-hidden/);
    await expect(page.locator('#cc-min-summary')).toHaveClass(/is-hidden/);
    await expect(page.locator('[data-cc-min="months"]').first()).toHaveText('—');

    await page.locator('#cc-min-calc').click();
    await expect(page.locator('#cc-min-results-list')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#cc-min-summary')).not.toHaveClass(/is-hidden/);
  });

  test('MINPAY-TEST-E2E-3: explanation pane contains required sections and 10 FAQs', async ({
    page,
  }) => {
    await page.goto('/loans/credit-card-minimum-payment');

    const explanation = page.locator('#cc-min-explanation');
    await expect(explanation.locator('h2')).toHaveText('Minimum Payment Payoff Summary');
    await expect(explanation).not.toContainText('Scenario Summary');
    await expect(explanation.locator('#cc-min-scenario-table')).toHaveCount(0);
    await expect(explanation).toContainText('Results Table (Yearly Payoff Snapshot)');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.cc-min-faq-item')).toHaveCount(10);
  });
});
