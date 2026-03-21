import { expect, test } from '@playwright/test';

async function setSliderValue(page, selector, value) {
  await page.locator(selector).evaluate((el, nextValue) => {
    el.value = String(nextValue);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

test.describe('Balance Transfer Credit Card Calculator', () => {
  test('BALANCE-TRANSFER-E2E-1: load, calculate, and verify results', async ({ page }) => {
    await page.goto('/credit-card-calculators/balance-transfer-credit-card-calculator/');

    const centerPanels = page.locator('.center-column > .panel');
    await expect(centerPanels).toHaveCount(1);
    await expect(centerPanels.first()).toHaveClass(/panel-span-all/);
    await expect(page.locator('.cc-cluster-site-header')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.cc-cluster-related-link')).toHaveCount(4);
    await expect(page.locator('.cc-cluster-related-link[aria-current="page"]')).toHaveText(
      'Balance Transfer'
    );

    await expect(page.locator('#calculator-title')).toHaveText(
      'Balance Transfer Credit Card Calculator'
    );
    await expect(page.locator('#calc-cc-bt input[type="range"]')).toHaveCount(6);
    await expect(page.locator('#cc-bt-placeholder')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#cc-bt-results-list')).toHaveClass(/is-hidden/);
    await expect(page.locator('#cc-bt-scenario-table tbody tr')).toHaveCount(10);

    await setSliderValue(page, '#cc-bt-balance', 7200);
    await setSliderValue(page, '#cc-bt-fee', 3.5);
    await setSliderValue(page, '#cc-bt-promo-apr', 0);
    await setSliderValue(page, '#cc-bt-promo-months', 14);
    await setSliderValue(page, '#cc-bt-post-apr', 21.9);
    await setSliderValue(page, '#cc-bt-payment', 320);

    await page.locator('#cc-bt-calc').click();

    const resultsList = page.locator('#cc-bt-results-list');
    await expect(resultsList).not.toHaveClass(/is-hidden/);
    await expect(resultsList.locator('.result-line')).toHaveCount(5);
    await expect(page.locator('[data-cc-bt="months"]').first()).not.toHaveText('—');
    await expect(page.locator('[data-cc-bt="starting-balance"]').first()).not.toHaveText('—');

    const tableRows = page.locator('#cc-bt-table-body tr');
    expect(await tableRows.count()).toBeGreaterThan(0);
    await expect(page.locator('#cc-bt-summary')).not.toContainText(
      'Adjust inputs and recalculate to see a valid balance-transfer scenario.'
    );

    const hasHorizontalScroll = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth > root.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('BALANCE-TRANSFER-E2E-2: input change after calculate keeps outcome visible', async ({
    page,
  }) => {
    await page.goto('/credit-card-calculators/balance-transfer-credit-card-calculator/');

    await page.locator('#cc-bt-calc').click();
    await expect(page.locator('#cc-bt-results-list')).not.toHaveClass(/is-hidden/);

    await setSliderValue(page, '#cc-bt-payment', 410);
    await setSliderValue(page, '#cc-bt-promo-months', 18);

    await expect(page.locator('#cc-bt-results-list')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('[data-cc-bt="months"]').first()).not.toHaveText('—');
    expect(await page.locator('#cc-bt-table-body tr').count()).toBeGreaterThan(0);
  });

  test('BALANCE-TRANSFER-E2E-3: explanation retains scenario summary, yearly table, and 10 FAQs', async ({
    page,
  }) => {
    await page.goto('/credit-card-calculators/balance-transfer-credit-card-calculator/');

    const explanation = page.locator('#cc-bt-explanation');
    await expect(explanation).toContainText('Scenario Summary');
    await expect(explanation).toContainText('Results Table (Yearly Payoff Snapshot)');
    await expect(explanation).toContainText('Frequently Asked Questions');
    await expect(explanation.locator('.cc-bt-faq-item')).toHaveCount(10);
  });
});
