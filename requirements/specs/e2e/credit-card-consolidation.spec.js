import { expect, test } from '@playwright/test';

test.describe('Credit Card Consolidation Calculator', () => {
  test('CONSOLIDATION-TEST-E2E-1: load, nav, form density, calculate, highlighted explanation', async ({
    page,
  }) => {
    await page.goto('/loans/credit-card-consolidation');

    await expect(page.locator('#calculator-title')).toHaveText('Credit Card Consolidation Calculator');

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Credit Card');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Card Consolidation');

    await expect(page.locator('select')).toHaveCount(0);
    await expect(page.locator('#calc-cc-con .input-grid')).toHaveCount(2);

    await page.locator('#cc-con-balance').fill('12000');
    await page.locator('#cc-con-apr').fill('19.5');
    await page.locator('#cc-con-payment').fill('400');
    await page.locator('#cc-con-new-apr').fill('10.5');
    await page.locator('#cc-con-term').fill('3');
    await page.locator('#cc-con-fees').fill('250');
    await page.locator('#cc-con-calc').click();

    const resultsList = page.locator('#cc-con-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);
    await expect(resultsList.locator('.result-line')).toHaveCount(2);
    await expect(resultsList).toContainText('Monthly payment change');
    await expect(resultsList).toContainText('Current payoff time');

    const summary = page.locator('#cc-con-summary');
    await expect(summary).not.toHaveClass(/is-hidden/);
    await expect(summary).toContainText('Interest difference');
    await expect(summary).toContainText('Total cost difference');
    await expect(summary).toContainText('Consolidation payment');

    const comparisonRows = page.locator('#cc-con-table-body tr');
    await expect(comparisonRows).toHaveCount(2);

    const scenarioRows = page.locator('#cc-con-scenario-table tbody tr');
    await expect(scenarioRows).toHaveCount(10);

    const highlightedValue = page.locator('#cc-con-explanation [data-cc-con="balance"]').first();
    await expect(highlightedValue).not.toHaveText('—');

    const chipStyles = await highlightedValue.evaluate((el) => {
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

  test('CONSOLIDATION-TEST-E2E-2: input change resets outputs until calculate click', async ({ page }) => {
    await page.goto('/loans/credit-card-consolidation');

    await page.locator('#cc-con-calc').click();
    await expect(page.locator('#cc-con-results-list')).not.toHaveClass(/is-hidden/);

    await page.locator('#cc-con-payment').fill('450');

    await expect(page.locator('#cc-con-placeholder')).toBeVisible();
    await expect(page.locator('#cc-con-results-list')).toHaveClass(/is-hidden/);
    await expect(page.locator('#cc-con-summary')).toHaveClass(/is-hidden/);
    await expect(page.locator('[data-cc-con="current-months"]').first()).toHaveText('—');
    await expect(page.locator('#cc-con-table-body .cc-con-table-placeholder-row')).toHaveCount(1);

    await page.locator('#cc-con-calc').click();
    await expect(page.locator('#cc-con-results-list')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#cc-con-summary')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#cc-con-table-body .cc-con-table-placeholder-row')).toHaveCount(0);
  });

  test('CONSOLIDATION-TEST-E2E-3: explanation pane contains required sections and 10 FAQs', async ({
    page,
  }) => {
    await page.goto('/loans/credit-card-consolidation');

    const explanation = page.locator('#cc-con-explanation');
    await expect(explanation.locator('h2')).toHaveText('Credit Card Consolidation Summary');
    await expect(explanation).toContainText('Scenario Summary');
    await expect(explanation).toContainText('Results Table (Cost Comparison)');
    await expect(explanation).toContainText('Explanation');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.cc-con-faq-item')).toHaveCount(10);
  });
});
