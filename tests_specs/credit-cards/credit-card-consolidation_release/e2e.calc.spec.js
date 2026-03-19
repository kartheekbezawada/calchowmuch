import { expect, test } from '@playwright/test';

function setRangeValue(page, selector, value) {
  return page.$eval(
    selector,
    (element, nextValue) => {
      element.value = String(nextValue);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    },
    value
  );
}

test.describe('Credit Card Consolidation Calculator', () => {
  test('CONSOLIDATION-TEST-E2E-1: single-panel Home Loan UI with calculate, donut, and table toggle', async ({
    page,
  }) => {
    await page.goto('/credit-card-calculators/credit-card-consolidation-calculator/');

    await expect(page.locator('#calculator-title')).toHaveText('Credit Card Consolidation Calculator');
    await expect(page.locator('.cc-cluster-site-header')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.cc-cluster-related-link')).toHaveCount(4);
    await expect(page.locator('.cc-cluster-related-link[aria-current="page"]')).toHaveText(
      'Card Consolidation'
    );

    const centerPanels = page.locator('.center-column > .panel');
    await expect(centerPanels).toHaveCount(1);
    await expect(centerPanels.first()).toHaveClass(/panel-span-all/);

    await expect(page.locator('#calc-cc-con .slider-row')).toHaveCount(4);
    await expect(page.locator('#calc-cc-con .advanced-options')).toHaveCount(1);
    await expect(page.locator('#calc-cc-con .cc-con-preview-panel')).toHaveCount(1);
    await expect(page.getByText('Estimated Consolidation Payment')).toHaveCount(0);
    await expect(page.locator('#cc-con-result .placeholder')).toHaveCount(1);
    await expect(page.locator('[data-cc-con="current-months"]').first()).toHaveText('—');

    const yearlyWrap = page.locator('#cc-con-table-yearly-wrap');
    const monthlyWrap = page.locator('#cc-con-table-monthly-wrap');
    await expect(yearlyWrap).not.toHaveClass(/is-hidden/);
    await expect(monthlyWrap).toHaveClass(/is-hidden/);

    const yearlyPlaceholder = page.locator('#cc-con-table-yearly-body .cc-con-table-placeholder-row');
    await expect(yearlyPlaceholder).toHaveCount(1);

    await setRangeValue(page, '#cc-con-balance', 15000);
    await setRangeValue(page, '#cc-con-apr', 21.2);
    await setRangeValue(page, '#cc-con-new-apr', 9.8);
    await setRangeValue(page, '#cc-con-term', 4);

    await page.locator('.advanced-options summary').click();
    await page.locator('#cc-con-payment').fill('460');
    await page.locator('#cc-con-fees').fill('300');

    await page.locator('#cc-con-calc').click();

    await expect(page.locator('#cc-con-result')).toContainText('Monthly Consolidation Payment');
    await expect(page.locator('#cc-con-result .cc-con-result-value')).toContainText(/[0-9]/);
    await expect(page.locator('[data-cc-con="current-months"]').first()).not.toHaveText('—');
    await expect(page.locator('[data-cc-con="principal-share"]').first()).toContainText('%');

    const monthlyPlaceholder = page.locator('#cc-con-table-monthly-body .cc-con-table-placeholder-row');
    await expect(monthlyPlaceholder).toHaveCount(0);
    expect(await page.locator('#cc-con-table-monthly-body tr').count()).toBeGreaterThan(1);

    await page.locator('#cc-con-view-monthly').click();
    await expect(monthlyWrap).not.toHaveClass(/is-hidden/);
    await expect(yearlyWrap).toHaveClass(/is-hidden/);

    await page.locator('#cc-con-view-yearly').click();
    await expect(yearlyWrap).not.toHaveClass(/is-hidden/);
    await expect(monthlyWrap).toHaveClass(/is-hidden/);

    const stickyHeader = page.locator('#cc-con-table-yearly thead th').first();
    await expect(stickyHeader).toHaveCSS('position', 'sticky');
    await expect(stickyHeader).toHaveCSS('top', '0px');

    await expect(page.locator('#cc-con-explanation .bor-faq-card')).toHaveCount(10);
  });

  test('CONSOLIDATION-TEST-E2E-2: input edit keeps side/table live and invalid input preserves last valid data', async ({
    page,
  }) => {
    await page.goto('/credit-card-calculators/credit-card-consolidation-calculator/');

    await page.locator('#cc-con-calc').click();

    const currentMonthsValue = page.locator('[data-cc-con="current-months"]').first();
    const yearlyPlaceholder = page.locator('#cc-con-table-yearly-body .cc-con-table-placeholder-row');
    await expect(yearlyPlaceholder).toHaveCount(0);

    const beforeText = (await currentMonthsValue.textContent())?.trim() || '';

    await setRangeValue(page, '#cc-con-apr', 32.4);
    const afterText = (await currentMonthsValue.textContent())?.trim() || '';
    expect(afterText).not.toBe('—');
    expect(afterText).not.toBe(beforeText);
    await expect(yearlyPlaceholder).toHaveCount(0);
    await expect(page.locator('#cc-con-result .cc-con-result-value')).toContainText(/[0-9]/);

    await page.locator('.advanced-options summary').click();
    await page.locator('#cc-con-payment').fill('0');
    await expect(page.locator('#cc-con-summary')).toContainText('Current payment must be greater than 0.');
    await expect(currentMonthsValue).toHaveText(afterText);
    await expect(yearlyPlaceholder).toHaveCount(0);
    await expect(page.locator('#cc-con-result .cc-con-result-value')).toContainText(/[0-9]/);
  });

  test('CONSOLIDATION-TEST-E2E-3: explanation contains required rebuilt sections and 10 FAQs', async ({
    page,
  }) => {
    await page.goto('/credit-card-calculators/credit-card-consolidation-calculator/');

    const explanation = page.locator('#cc-con-explanation');
    await expect(explanation.locator('h2')).toHaveText('Should You Consolidate Credit Card Debt?');
    await expect(explanation).toContainText('Lifetime Totals');
    await expect(explanation).toContainText('Amortization Table');
    await expect(explanation).toContainText('Explanation');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.bor-faq-card')).toHaveCount(10);
  });
});
