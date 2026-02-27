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

    const topNavActive = page.locator('.top-nav .top-nav-link.is-active');
    await expect(topNavActive).toContainText('Auto Loans');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toContainText('Hire Purchase');

    const centerPanels = page.locator('.center-column > .panel');
    await expect(centerPanels).toHaveCount(1);
    await expect(centerPanels.first()).toHaveClass(/panel-span-all/);

    await expect(page.locator('#calc-hire-purchase .slider-row')).toHaveCount(5);
    await expect(page.locator('#calc-hire-purchase .mtg-preview-panel')).toHaveCount(1);

    const termToggleButtons = page.locator('[data-button-group="hp-term-unit"] button');
    await expect(termToggleButtons).toHaveCount(2);
    await expect(termToggleButtons.first()).toHaveClass(/is-active/);
    await expect(termToggleButtons.first()).toContainText('Years');

    const result = page.locator('#hp-result');
    const explanation = page.locator('#loan-mtg-explanation');
    await expect(result.locator('.mtg-result-value')).toContainText(/[0-9]/);

    const baselineResult = normalize(await result.textContent());
    const baselineExplanation = normalize(await explanation.textContent());

    await setRangeValue(page, '#hp-price', 36000);
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

    await expect(page.locator('#loan-mtg-explanation .bor-faq-card')).toHaveCount(10);
  });
});
