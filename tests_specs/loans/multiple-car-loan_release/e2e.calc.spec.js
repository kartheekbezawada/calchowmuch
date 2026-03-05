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

test.describe('Multiple Car Loan Calculator', () => {
  test('MULTI-CAR-LOAN-E2E-1: premium single pane with button-only recalculation and full outputs', async ({
    page,
  }) => {
    await page.goto('/car-loan-calculators/auto-loan-calculator/');

    await expect(page.locator('#calculator-title')).toHaveText('Auto Loan Comparison Calculator');

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Auto Loans');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toContainText('Multiple Car Loan');

    const centerPanels = page.locator('.center-column > .panel');
    await expect(centerPanels).toHaveCount(1);
    await expect(centerPanels.first()).toHaveClass(/panel-span-all/);

    await expect(page.locator('#calc-multi-car-loan .slider-row')).toHaveCount(6);
    await expect(page.locator('#calc-multi-car-loan .mtg-preview-panel')).toHaveCount(1);

    const result = page.locator('#multi-loan-result');
    const explanation = page.locator('#loan-mtg-explanation');
    await expect(result.locator('.mtg-result-value')).toContainText(/[0-9]/);

    const baselineResult = normalize(await result.textContent());
    const baselineExplanation = normalize(await explanation.textContent());

    await setRangeValue(page, '#multi-loan-a-amount', 30000);
    await page.waitForTimeout(150);

    const afterInputResult = normalize(await result.textContent());
    const afterInputExplanation = normalize(await explanation.textContent());

    expect(afterInputResult).toBe(baselineResult);
    expect(afterInputExplanation).toBe(baselineExplanation);

    await page.locator('#multi-loan-calc').click();

    await expect
      .poll(
        async () => {
          const afterClickResult = normalize(await result.textContent());
          const afterClickExplanation = normalize(await explanation.textContent());
          return (
            afterClickResult !== baselineResult || afterClickExplanation !== baselineExplanation
          );
        },
        {
          timeout: 2000,
          message: 'Multiple Car Loan calculator did not update after clicking Calculate.',
        }
      )
      .toBe(true);

    const yearlyWrap = page.locator('#multi-table-yearly-wrap');
    const monthlyWrap = page.locator('#multi-table-monthly-wrap');
    await expect(yearlyWrap).not.toHaveClass(/is-hidden/);
    await expect(monthlyWrap).toHaveClass(/is-hidden/);

    await page.locator('#multi-view-monthly').click();
    await expect(monthlyWrap).not.toHaveClass(/is-hidden/);
    await expect(yearlyWrap).toHaveClass(/is-hidden/);

    await page.locator('#multi-view-yearly').click();
    await expect(yearlyWrap).not.toHaveClass(/is-hidden/);
    await expect(monthlyWrap).toHaveClass(/is-hidden/);

    await expect(page.locator('#multi-loan-table-body tr')).toHaveCount(2);
    await expect(page.locator('#multi-loan-table tfoot tr')).toHaveCount(1);

    expect(await page.locator('#multi-table-monthly-body tr').count()).toBeGreaterThan(1);
    expect(await page.locator('#multi-table-yearly-body tr').count()).toBeGreaterThan(0);

    await expect(page.locator('#loan-mtg-explanation .bor-faq-card')).toHaveCount(10);
  });
});
