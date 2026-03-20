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

function normalize(text) {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

test.describe('PCP Calculator', () => {
  test('PCP-E2E-1: premium single pane with button-only recalculation, 3-way table toggle, and full outputs', async ({
    page,
  }) => {
    await page.goto('/car-loan-calculators/pcp-calculator/');

    await expect(page.locator('#calculator-title')).toHaveText('PCP Car Finance Calculator');
    await expect(page.locator('body[data-design-family="auto-loans"]')).toHaveCount(1);
    await expect(page.locator('.al-cluster-site-header')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('.al-cluster-related-link')).toHaveCount(5);

    await expect(page.locator('#calc-pcp .slider-row')).toHaveCount(6);
    await expect(page.locator('#calc-pcp .slider-precision-input')).toHaveCount(6);
    await expect(page.locator('#calc-pcp .al-form-section')).toHaveCount(3);
    await expect(page.locator('#calc-pcp .mtg-preview-panel')).toHaveCount(1);
    await expect(page.locator('#pcp-preview .al-end-term-grid')).toHaveCount(1);
    await expect(page.locator('#pcp-stale-note')).toBeHidden();

    const depositToggleButtons = page.locator('[data-button-group="pcp-deposit-type"] button');
    const termToggleButtons = page.locator('[data-button-group="pcp-term-unit"] button');
    await expect(depositToggleButtons).toHaveCount(2);
    await expect(termToggleButtons).toHaveCount(2);

    const result = page.locator('#pcp-result');
    const explanation = page.locator('#pcp-auto-loan-explanation');
    await expect(result.locator('.mtg-result-value')).toContainText(/[0-9]/);

    const baselineResult = normalize(await result.textContent());
    const baselineExplanation = normalize(await explanation.textContent());

    await setRangeValue(page, '#pcp-price', 38000);
    await page.locator('#pcp-gfv-field').fill('18000');
    await page.locator('#pcp-gfv-field').press('Tab');
    await page.locator('[data-button-group="pcp-deposit-type"] button[data-value="percent"]').click();
    await page.locator('[data-button-group="pcp-term-unit"] button[data-value="months"]').click();
    await page.waitForTimeout(150);

    const afterInputResult = normalize(await result.textContent());
    const afterInputExplanation = normalize(await explanation.textContent());

    expect(afterInputResult).toBe(baselineResult);
    expect(afterInputExplanation).toBe(baselineExplanation);
    await expect(page.locator('#pcp-stale-note')).toBeVisible();

    await page.locator('#pcp-calc').click();

    await expect
      .poll(
        async () => {
          const afterClickResult = normalize(await result.textContent());
          const afterClickExplanation = normalize(await explanation.textContent());
          return afterClickResult !== baselineResult || afterClickExplanation !== baselineExplanation;
        },
        {
          timeout: 2000,
          message: 'PCP calculator did not update after clicking Calculate.',
        }
      )
      .toBe(true);
    await expect(page.locator('#pcp-stale-note')).toBeHidden();

    const yearlyWrap = page.locator('#pcp-table-yearly-wrap');
    const monthlyWrap = page.locator('#pcp-table-monthly-wrap');
    const costWrap = page.locator('#pcp-table-cost-wrap');

    await expect(yearlyWrap).not.toHaveClass(/is-hidden/);
    await expect(monthlyWrap).toHaveClass(/is-hidden/);
    await expect(costWrap).toHaveClass(/is-hidden/);

    await page.locator('#pcp-view-monthly').click();
    await expect(monthlyWrap).not.toHaveClass(/is-hidden/);
    await expect(yearlyWrap).toHaveClass(/is-hidden/);
    await expect(costWrap).toHaveClass(/is-hidden/);

    await page.locator('#pcp-view-cost').click();
    await expect(costWrap).not.toHaveClass(/is-hidden/);
    await expect(monthlyWrap).toHaveClass(/is-hidden/);
    await expect(yearlyWrap).toHaveClass(/is-hidden/);

    await page.locator('#pcp-view-yearly').click();
    await expect(yearlyWrap).not.toHaveClass(/is-hidden/);
    await expect(monthlyWrap).toHaveClass(/is-hidden/);
    await expect(costWrap).toHaveClass(/is-hidden/);

    expect(await page.locator('#pcp-table-monthly-body tr').count()).toBeGreaterThan(1);
    expect(await page.locator('#pcp-table-yearly-body tr').count()).toBeGreaterThan(0);
    await expect(page.locator('#pcp-table-cost-body tr')).toHaveCount(5);
    await expect(page.locator('#pcp-table-cost tfoot tr')).toHaveCount(1);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#pcp-view-cost').click();
    await expect(page.locator('#pcp-table-cost thead')).toBeHidden();

    await expect(page.locator('#pcp-auto-loan-explanation .bor-faq-card')).toHaveCount(10);
    await expect(page.locator('#pcp-auto-loan-explanation .al-decision-summary')).toHaveCount(1);
  });
});
