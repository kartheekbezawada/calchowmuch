import { expect, test } from '@playwright/test';

async function setSliderValue(page, selector, value) {
  await page.locator(selector).evaluate((el, nextValue) => {
    el.value = String(nextValue);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

test.describe('Balance Transfer Calculator', () => {
  test('BALTRANSFER-TEST-E2E-1: load, nav, calculate, verify results', async ({ page }) => {
    await page.goto('/loans/balance-transfer-installment-plan');

    const centerPanels = page.locator('.center-column > .panel');
    await expect(centerPanels).toHaveCount(1);
    await expect(centerPanels.first()).toHaveClass(/panel-span-all/);

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Credit Card');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Balance Transfer');

    await expect(page.locator('#cc-bt-balance')).toHaveAttribute('type', 'range');
    await expect(page.locator('#cc-bt-fee')).toHaveAttribute('type', 'range');
    await expect(page.locator('#cc-bt-promo-apr')).toHaveAttribute('type', 'range');
    await expect(page.locator('#cc-bt-promo-months')).toHaveAttribute('type', 'range');
    await expect(page.locator('#cc-bt-post-apr')).toHaveAttribute('type', 'range');
    await expect(page.locator('#cc-bt-payment')).toHaveAttribute('type', 'range');

    await setSliderValue(page, '#cc-bt-balance', 6000);
    await setSliderValue(page, '#cc-bt-fee', 3);
    await setSliderValue(page, '#cc-bt-promo-apr', 0);
    await setSliderValue(page, '#cc-bt-promo-months', 12);
    await setSliderValue(page, '#cc-bt-post-apr', 17.9);
    await setSliderValue(page, '#cc-bt-payment', 250);
    await page.locator('#cc-bt-calc').click();

    const resultsList = page.locator('#cc-bt-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);

    const results = resultsList.locator('.result-line');
    await expect(results).toHaveCount(5);
    await expect(results.nth(0)).toContainText('Estimated Payoff');
    await expect(results.nth(0)).toContainText('months');
    await expect(results.nth(1)).toContainText('Total Paid');
    await expect(results.nth(2)).toContainText('Total Interest');
    await expect(results.nth(3)).toContainText('Total Fees');
    await expect(results.nth(4)).toContainText('Starting Balance');

    const tableRows = page.locator('#cc-bt-table-body tr');
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('BALTRANSFER-TEST-E2E-2: input change auto-recalculates projected outcome', async ({
    page,
  }) => {
    await page.goto('/loans/balance-transfer-installment-plan');

    await page.locator('#cc-bt-calc').click();

    const resultsList = page.locator('#cc-bt-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);
    const firstResult = resultsList.locator('.result-line').first();
    const firstTextBefore = (await firstResult.textContent()) || '';

    await setSliderValue(page, '#cc-bt-balance', 8000);

    await expect(resultsList).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#cc-bt-placeholder')).toHaveClass(/is-hidden/);
    await expect
      .poll(async () => ((await firstResult.textContent()) || '').trim())
      .not.toBe(firstTextBefore.trim());
  });

  test('BALTRANSFER-TEST-E2E-3: explanation pane has 10 FAQ items', async ({ page }) => {
    await page.goto('/loans/balance-transfer-installment-plan');

    const explanation = page.locator('#cc-bt-explanation');
    await expect(explanation).toContainText('Balance Transfer Summary');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.faq-box')).toHaveCount(10);
  });
});
