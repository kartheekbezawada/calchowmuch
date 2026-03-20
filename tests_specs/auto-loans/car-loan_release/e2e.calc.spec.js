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

test.describe('Car Loan Calculator', () => {
  test('CAR-LOAN-E2E-1: auto-loan shell with button-only recalculation and schedule toggles', async ({
    page,
  }) => {
    await page.goto('/car-loan-calculators/car-loan-calculator/');

    await expect(page.locator('#calculator-title')).toHaveText('Car Loan Calculator');
    await expect(page.locator('body[data-design-family="auto-loans"]')).toHaveCount(1);
    await expect(page.locator('.al-cluster-site-header')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('.al-cluster-related-link')).toHaveCount(5);

    const panel = page.locator('.al-cluster-panel');
    await expect(panel).toHaveCount(1);

    await expect(page.locator('#calc-car-loan .slider-row')).toHaveCount(7);
    await expect(page.locator('#calc-car-loan .slider-precision-input')).toHaveCount(7);
    await expect(page.locator('#calc-car-loan .al-form-section')).toHaveCount(2);
    await expect(page.locator('#calc-car-loan .mtg-preview-panel')).toHaveCount(1);
    await expect(page.locator('#car-preview .al-assumption-strip')).toHaveCount(1);
    await expect(page.locator('#car-preview .al-breakdown-list')).toHaveCount(1);
    await expect(page.locator('#car-stale-note')).toBeHidden();

    const result = page.locator('#car-result');
    const explanation = page.locator('#car-auto-loan-explanation');
    await expect(result.locator('.mtg-result-value')).toContainText(/[0-9]/);

    const baselineResult = normalize(await result.textContent());
    const baselineExplanation = normalize(await explanation.textContent());

    await setRangeValue(page, '#car-price', 35000);
    await page.locator('#car-price-field').fill('35000');
    await page.locator('#car-price-field').press('Tab');
    await setRangeValue(page, '#car-apr', 7.2);
    await page.waitForTimeout(150);

    const afterInputResult = normalize(await result.textContent());
    const afterInputExplanation = normalize(await explanation.textContent());

    expect(afterInputResult).toBe(baselineResult);
    expect(afterInputExplanation).toBe(baselineExplanation);
    await expect(page.locator('#car-stale-note')).toBeVisible();

    await page.locator('#car-calculate').click();

    await expect
      .poll(
        async () => {
          const afterClickResult = normalize(await result.textContent());
          const afterClickExplanation = normalize(await explanation.textContent());
          return afterClickResult !== baselineResult || afterClickExplanation !== baselineExplanation;
        },
        {
          timeout: 2000,
          message: 'Car Loan calculator did not update after clicking Calculate.',
        }
      )
      .toBe(true);
    await expect(page.locator('#car-stale-note')).toBeHidden();

    const yearlyWrap = page.locator('#car-table-yearly-wrap');
    const monthlyWrap = page.locator('#car-table-monthly-wrap');
    await expect(yearlyWrap).not.toHaveClass(/is-hidden/);
    await expect(monthlyWrap).toHaveClass(/is-hidden/);

    await page.locator('#car-view-monthly').click();
    await expect(monthlyWrap).not.toHaveClass(/is-hidden/);
    await expect(yearlyWrap).toHaveClass(/is-hidden/);

    await page.locator('#car-view-yearly').click();
    await expect(yearlyWrap).not.toHaveClass(/is-hidden/);
    await expect(monthlyWrap).toHaveClass(/is-hidden/);

    expect(await page.locator('#car-table-monthly-body tr').count()).toBeGreaterThan(1);
    expect(await page.locator('#car-table-yearly-body tr').count()).toBeGreaterThan(0);

    await expect(page.locator('#car-auto-loan-explanation .bor-faq-card')).toHaveCount(6);
    await expect(page.locator('#car-auto-loan-explanation .al-decision-summary')).toHaveCount(1);
  });
});
