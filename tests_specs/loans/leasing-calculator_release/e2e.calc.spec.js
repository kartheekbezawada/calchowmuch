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

test.describe('Leasing Calculator', () => {
  test('LEASING-E2E-1: premium single pane with button-only recalculation, 3-way table toggle, and full outputs', async ({
    page,
  }) => {
    await page.goto('/car-loan-calculators/car-lease-calculator/');

    await expect(page.locator('#calculator-title')).toHaveText('Car Lease Calculator');

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Auto Loans');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toContainText('Leasing Calculator');

    const centerPanels = page.locator('.center-column > .panel');
    await expect(centerPanels).toHaveCount(1);
    await expect(centerPanels.first()).toHaveClass(/panel-span-all/);

    await expect(page.locator('#calc-lease .slider-row')).toHaveCount(5);
    await expect(page.locator('#calc-lease .mtg-preview-panel')).toHaveCount(1);

    const residualToggleButtons = page.locator('[data-button-group="lease-residual-type"] button');
    const termToggleButtons = page.locator('[data-button-group="lease-term-unit"] button');
    await expect(residualToggleButtons).toHaveCount(2);
    await expect(termToggleButtons).toHaveCount(2);

    const result = page.locator('#lease-result');
    const explanation = page.locator('#loan-mtg-explanation');
    await expect(result.locator('.mtg-result-value')).toContainText(/[0-9]/);

    const baselineResult = normalize(await result.textContent());
    const baselineExplanation = normalize(await explanation.textContent());

    await setRangeValue(page, '#lease-price', 36000);
    await page.locator('[data-button-group="lease-residual-type"] button[data-value="percent"]').click();
    await page.locator('[data-button-group="lease-term-unit"] button[data-value="months"]').click();
    await page.waitForTimeout(150);

    const afterInputResult = normalize(await result.textContent());
    const afterInputExplanation = normalize(await explanation.textContent());

    expect(afterInputResult).toBe(baselineResult);
    expect(afterInputExplanation).toBe(baselineExplanation);

    await page.locator('#lease-calc').click();

    await expect
      .poll(
        async () => {
          const afterClickResult = normalize(await result.textContent());
          const afterClickExplanation = normalize(await explanation.textContent());
          return afterClickResult !== baselineResult || afterClickExplanation !== baselineExplanation;
        },
        {
          timeout: 2000,
          message: 'Leasing calculator did not update after clicking Calculate.',
        }
      )
      .toBe(true);

    const yearlyWrap = page.locator('#lease-table-yearly-wrap');
    const monthlyWrap = page.locator('#lease-table-monthly-wrap');
    const costWrap = page.locator('#lease-table-cost-wrap');

    await expect(yearlyWrap).not.toHaveClass(/is-hidden/);
    await expect(monthlyWrap).toHaveClass(/is-hidden/);
    await expect(costWrap).toHaveClass(/is-hidden/);

    await page.locator('#lease-view-monthly').click();
    await expect(monthlyWrap).not.toHaveClass(/is-hidden/);
    await expect(yearlyWrap).toHaveClass(/is-hidden/);
    await expect(costWrap).toHaveClass(/is-hidden/);

    await page.locator('#lease-view-cost').click();
    await expect(costWrap).not.toHaveClass(/is-hidden/);
    await expect(monthlyWrap).toHaveClass(/is-hidden/);
    await expect(yearlyWrap).toHaveClass(/is-hidden/);

    await page.locator('#lease-view-yearly').click();
    await expect(yearlyWrap).not.toHaveClass(/is-hidden/);
    await expect(monthlyWrap).toHaveClass(/is-hidden/);
    await expect(costWrap).toHaveClass(/is-hidden/);

    expect(await page.locator('#lease-table-monthly-body tr').count()).toBeGreaterThan(1);
    expect(await page.locator('#lease-table-yearly-body tr').count()).toBeGreaterThan(0);
    await expect(page.locator('#lease-table-cost-body tr')).toHaveCount(6);
    await expect(page.locator('#lease-table-cost tfoot tr')).toHaveCount(1);

    await expect(page.locator('#loan-mtg-explanation .bor-faq-card')).toHaveCount(10);
  });
});
