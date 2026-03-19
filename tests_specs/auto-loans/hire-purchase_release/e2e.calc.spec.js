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

test.describe('Hire Purchase Calculator', () => {
  test('HIRE-PURCHASE-E2E-1: premium single pane, button-only calculate, and full outputs', async ({
    page,
  }) => {
    await page.goto('/car-loan-calculators/hire-purchase-calculator/');

    await expect(page.locator('#calculator-title')).toHaveText('Hire Purchase Calculator');
    await expect(page.locator('body[data-design-family="auto-loans"]')).toHaveCount(1);
    await expect(page.locator('.al-cluster-site-header')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('.al-cluster-related-link')).toHaveCount(5);

    await expect(page.locator('#calc-hire-purchase .slider-row')).toHaveCount(5);
    await expect(page.locator('#calc-hire-purchase .slider-precision-input')).toHaveCount(5);
    await expect(page.locator('#calc-hire-purchase .mtg-preview-panel')).toHaveCount(1);

    const termToggleButtons = page.locator('[data-button-group="hp-term-unit"] button');
    await expect(termToggleButtons).toHaveCount(2);
    await expect(termToggleButtons.first()).toHaveClass(/is-active/);
    await expect(termToggleButtons.first()).toContainText('Years');

    const result = page.locator('#hp-result');
    const explanation = page.locator('#hp-auto-loan-explanation');
    await expect(result.locator('.mtg-result-value')).toContainText(/[0-9]/);

    const baselineResult = normalize(await result.textContent());
    const baselineExplanation = normalize(await explanation.textContent());

    await setRangeValue(page, '#hp-price', 36000);
    await page.locator('#hp-balloon-field').fill('4000');
    await page.locator('#hp-balloon-field').press('Tab');
    await page.locator('[data-button-group="hp-term-unit"] button[data-value="months"]').click();
    await page.waitForTimeout(150);

    const afterInputResult = normalize(await result.textContent());
    const afterInputExplanation = normalize(await explanation.textContent());

    expect(afterInputResult).toBe(baselineResult);
    expect(afterInputExplanation).toBe(baselineExplanation);

    await page.locator('#hp-calc').click();

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
          message: 'Hire Purchase calculator did not update after clicking Calculate.',
        }
      )
      .toBe(true);

    const yearlyWrap = page.locator('#hp-table-yearly-wrap');
    const monthlyWrap = page.locator('#hp-table-monthly-wrap');
    await expect(yearlyWrap).not.toHaveClass(/is-hidden/);
    await expect(monthlyWrap).toHaveClass(/is-hidden/);

    await page.locator('#hp-view-monthly').click();
    await expect(monthlyWrap).not.toHaveClass(/is-hidden/);
    await expect(yearlyWrap).toHaveClass(/is-hidden/);

    await page.locator('#hp-view-yearly').click();
    await expect(yearlyWrap).not.toHaveClass(/is-hidden/);
    await expect(monthlyWrap).toHaveClass(/is-hidden/);

    expect(await page.locator('#hp-table-monthly-body tr').count()).toBeGreaterThan(1);
    expect(await page.locator('#hp-table-yearly-body tr').count()).toBeGreaterThan(0);

    await expect(page.locator('#hp-auto-loan-explanation .bor-faq-card')).toHaveCount(10);
  });
});
