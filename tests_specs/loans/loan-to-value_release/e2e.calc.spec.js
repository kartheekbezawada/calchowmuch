import { expect, test } from '@playwright/test';

const CALCULATOR_URL = '/loan-calculators/ltv-calculator/';

async function setSliderValue(page, selector, value) {
  await page.locator(selector).evaluate((element, nextValue) => {
    element.value = String(nextValue);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function setTextFieldValue(page, selector, value) {
  const field = page.locator(selector);
  await field.fill(String(value));
  await field.blur();
}

async function runCalculation(page) {
  await page.click('#ltv-calculate');
  await page.waitForFunction(() => {
    const valueNode = document.querySelector('#ltv-result .ltv-result-value');
    return valueNode && valueNode.textContent.trim() !== '';
  });
}

test.describe('Loan-to-Value calculator route contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CALCULATOR_URL);
    await expect(page.locator('.hl-cluster-panel')).toHaveCount(1);
    await expect(page.locator('#calc-loan-to-value')).toBeVisible();
  });

  test('LTV-E2E-1: single-pane route with merged calculator and explanation', async ({ page }) => {
    const centerPanels = page.locator('.hl-cluster-panel');
    await expect(centerPanels).toHaveCount(1);

    const panel = centerPanels.first();
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(panel.locator('#calc-loan-to-value')).toBeVisible();
    await expect(panel.locator('#loan-ltv-explanation')).toBeVisible();
    await expect(panel.locator('h3:has-text("Explanation")')).toHaveCount(0);
    await expect(page.locator('#ltv-property-field')).toHaveValue('350000');
    await expect(page.locator('#ltv-loan-field')).toHaveValue('280000');
    await expect(page.locator('#ltv-deposit-amount-field')).toHaveValue('70000');
    await expect(page.locator('#ltv-deposit-percent-field')).toHaveValue('20.0');
  });

  test('LTV-E2E-2: mode toggles reveal the correct input rows', async ({ page }) => {
    await expect(page.locator('#ltv-loan-row')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#ltv-deposit-type-row')).toHaveClass(/is-hidden/);
    await expect(page.locator('#ltv-deposit-amount-row')).toHaveClass(/is-hidden/);
    await expect(page.locator('#ltv-deposit-percent-row')).toHaveClass(/is-hidden/);

    await page.click('[data-button-group="ltv-mode"] button[data-value="deposit"]');
    await expect(page.locator('#ltv-loan-row')).toHaveClass(/is-hidden/);
    await expect(page.locator('#ltv-deposit-type-row')).not.toHaveClass(/is-hidden/);
    await expect(page.locator('#ltv-deposit-amount-row')).not.toHaveClass(/is-hidden/);

    await page.click('[data-button-group="ltv-deposit-type"] button[data-value="percent"]');
    await expect(page.locator('#ltv-deposit-amount-row')).toHaveClass(/is-hidden/);
    await expect(page.locator('#ltv-deposit-percent-row')).not.toHaveClass(/is-hidden/);
  });

  test('LTV-E2E-2A: exact-value fields sync without pre-click recalculation', async ({ page }) => {
    const beforeText = await page.locator('#ltv-result .ltv-result-value').innerText();

    await setTextFieldValue(page, '#ltv-property-field', 425000);
    await expect(page.locator('#ltv-property')).toHaveValue('425000');

    const afterEditText = await page.locator('#ltv-result .ltv-result-value').innerText();
    expect(afterEditText.trim()).toBe(beforeText.trim());

    await runCalculation(page);
    const afterCalcText = await page.locator('#ltv-result .ltv-result-value').innerText();
    expect(afterCalcText.trim()).not.toBe(beforeText.trim());
  });

  test('LTV-E2E-3: calculates outputs and toggles LTV table views', async ({ page }) => {
    await setSliderValue(page, '#ltv-property', 500000);
    await setSliderValue(page, '#ltv-loan', 350000);
    await runCalculation(page);

    await expect(page.locator('#ltv-result')).toContainText('Current LTV');
    await expect(page.locator('[data-ltv="snapshot-ltv"]')).toContainText(/[0-9]/);
    await expect(page.locator('[data-ltv="snapshot-bucket"]')).not.toHaveText('--');
    await expect(page.locator('[data-ltv="snapshot-risk"]')).not.toHaveText('--');

    const bandsWrap = page.locator('#ltv-table-bands-wrap');
    const targetsWrap = page.locator('#ltv-table-targets-wrap');

    await expect(bandsWrap).not.toHaveClass(/is-hidden/);
    await expect(targetsWrap).toHaveClass(/is-hidden/);

    await page.click('#ltv-view-targets');
    await expect(targetsWrap).not.toHaveClass(/is-hidden/);
    await expect(bandsWrap).toHaveClass(/is-hidden/);

    const targetRows = await page.locator('#ltv-target-body tr').count();
    expect(targetRows).toBeGreaterThan(0);

    await page.click('#ltv-view-bands');
    await expect(bandsWrap).not.toHaveClass(/is-hidden/);
    await expect(targetsWrap).toHaveClass(/is-hidden/);

    await expect(page.locator('#loan-ltv-explanation .ltv-related-grid .bor-related-card')).toHaveCount(3);
    await expect(page.locator('#loan-ltv-explanation #ltv-section-faq .bor-faq-card')).toHaveCount(10);
  });

  test('LTV-E2E-4: sticky headers, section counts, and no horizontal overflow hold on desktop and mobile', async ({
    page,
  }) => {
    await runCalculation(page);

    const stickyHeader = page.locator('#ltv-table-bands thead th').first();
    await expect(stickyHeader).toHaveCSS('position', 'sticky');
    await expect(stickyHeader).toHaveCSS('top', '0px');

    const panel = page.locator('.hl-cluster-panel').first();
    expect(await panel.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(false);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(250);
    expect(await panel.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(false);
  });

  test('LTV-E2E-5: mobile calculate reveals the LTV snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await runCalculation(page);
    await page.waitForTimeout(350);

    const resultBox = await page.locator('#ltv-results').boundingBox();
    expect(resultBox).toBeTruthy();
    expect(resultBox.y).toBeLessThan(220);

    await expect(page.locator('#ltv-result')).toBeFocused();
  });
});
