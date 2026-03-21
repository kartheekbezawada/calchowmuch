import { test, expect } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]/g, ''));
}

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
  await page.click('#btl-calculate');
  await page.waitForFunction(() => {
    const valueNode = document.querySelector('#btl-result .btl-hero-value');
    return valueNode && valueNode.textContent.trim() !== '';
  });
}

async function openAdvancedOptions(page) {
  const details = page.locator('#calc-buy-to-let details.advanced-options');
  const isOpen = await details.evaluate((node) => node.open);
  if (!isOpen) {
    await page.locator('#calc-buy-to-let details.advanced-options summary').click();
  }
}

async function setBaseInputs(page) {
  await setSliderValue(page, '#btl-price', 200000);
  await setSliderValue(page, '#btl-deposit-amount', 50000);
  await setSliderValue(page, '#btl-rate', 5);
  await setSliderValue(page, '#btl-term', 5);
  await setSliderValue(page, '#btl-rent', 1000);

  await openAdvancedOptions(page);
  await page.fill('#btl-vacancy-percent', '0');
  await page.fill('#btl-agent-fee', '0');
  await page.fill('#btl-maintenance', '0');
  await page.fill('#btl-other-costs', '0');

  await runCalculation(page);
}

test.describe('Buy-to-Let calculator requirements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/loan-calculators/buy-to-let-mortgage-calculator/');
    await expect(page.locator('.hl-cluster-panel')).toHaveCount(1);
    await expect(page.locator('#btl-calculate')).toBeVisible();
  });

  test('BTL-TEST-E2E-1: deposit type shows only selected slider input', async ({ page }) => {
    await expect(page.locator('#btl-deposit-amount')).toHaveAttribute('type', 'range');
    await expect(page.locator('#btl-deposit-percent')).toHaveAttribute('type', 'range');

    await expect(page.locator('#btl-deposit-amount-row')).toBeVisible();
    await expect(page.locator('#btl-deposit-percent-row')).toBeHidden();

    await page.click('[data-button-group="btl-deposit-type"] button[data-value="percent"]');
    await expect(page.locator('#btl-deposit-amount-row')).toBeHidden();
    await expect(page.locator('#btl-deposit-percent-row')).toBeVisible();

    await page.click('[data-button-group="btl-deposit-type"] button[data-value="amount"]');
    await expect(page.locator('#btl-deposit-amount-row')).toBeVisible();
    await expect(page.locator('#btl-deposit-percent-row')).toBeHidden();
  });

  test('BTL-TEST-E2E-2: deposit slider displays update and amount max tracks property price', async ({
    page,
  }) => {
    await setSliderValue(page, '#btl-price', 300000);
    await expect(page.locator('#btl-deposit-amount')).toHaveAttribute('max', '300000');

    await setSliderValue(page, '#btl-deposit-amount', 120000);
    await expect(page.locator('#btl-deposit-amount-display')).toContainText('120,000');

    await page.click('[data-button-group="btl-deposit-type"] button[data-value="percent"]');
    await setSliderValue(page, '#btl-deposit-percent', 35.5);
    await expect(page.locator('#btl-deposit-percent-display')).toContainText('35.5%');

    await setSliderValue(page, '#btl-price', 100000);
    await expect(page.locator('#btl-deposit-amount')).toHaveAttribute('max', '100000');

    const amountValue = Number(await page.inputValue('#btl-deposit-amount'));
    expect(amountValue).toBeLessThanOrEqual(100000);
  });

  test('BTL-TEST-E2E-3: selected deposit mode drives calculation and syncs inactive control', async ({
    page,
  }) => {
    await setSliderValue(page, '#btl-price', 200000);
    await setSliderValue(page, '#btl-deposit-amount', 50000);
    await runCalculation(page);

    const percentFromAmountMode = Number(await page.inputValue('#btl-deposit-percent'));
    expect(percentFromAmountMode).toBeCloseTo(25, 1);

    const baselineNetMonthly = parseNumber(await page.locator('[data-btl="net-monthly"]').first().textContent());

    await page.click('[data-button-group="btl-deposit-type"] button[data-value="percent"]');
    await setSliderValue(page, '#btl-deposit-percent', 30);
    await runCalculation(page);

    const syncedAmount = Number(await page.inputValue('#btl-deposit-amount'));
    expect(Math.abs(syncedAmount - 60000)).toBeLessThanOrEqual(1000);

    const updatedNetMonthly = parseNumber(await page.locator('[data-btl="net-monthly"]').first().textContent());
    expect(updatedNetMonthly).toBeGreaterThan(baselineNetMonthly);
  });

  test('BTL-TEST-E2E-3A: exact-value fields sync without pre-click recalculation', async ({ page }) => {
    const beforeText = await page.locator('#btl-result .btl-hero-value').innerText();

    await setTextFieldValue(page, '#btl-price-field', 325000);
    await expect(page.locator('#btl-price')).toHaveValue('325000');

    const afterEditText = await page.locator('#btl-result .btl-hero-value').innerText();
    expect(afterEditText.trim()).toBe(beforeText.trim());

    await runCalculation(page);
    const afterCalcText = await page.locator('#btl-result .btl-hero-value').innerText();
    expect(afterCalcText.trim()).not.toBe(beforeText.trim());
  });

  test('BTL-TEST-I-1: table updates when rent increase toggles', async ({ page }) => {
    await setBaseInputs(page);

    const baselineCell = page.locator('#btl-table-body tr').nth(1).locator('td').nth(1);
    const baselineText = await baselineCell.textContent();
    const baselineRent = parseNumber(baselineText);

    await openAdvancedOptions(page);
    await page.click('[data-button-group="btl-rent-increase"] button[data-value="on"]');
    await page.fill('#btl-rent-increase-percent', '5');
    await runCalculation(page);

    const increasedText = await baselineCell.textContent();
    const increasedRent = parseNumber(increasedText);
    expect(increasedRent).toBeGreaterThan(baselineRent);

    const increaseIndicator = page.locator('#btl-table-body tr').nth(1).locator('td').nth(6);
    await expect(increaseIndicator).toContainText('Yes');

    await openAdvancedOptions(page);
    await page.click('[data-button-group="btl-rent-increase"] button[data-value="off"]');
    await runCalculation(page);
    const revertedText = await baselineCell.textContent();
    const revertedRent = parseNumber(revertedText);
    expect(revertedRent).toBeCloseTo(baselineRent, 2);
  });

  test('BTL-TEST-E2E-4: full user journey with rent increase', async ({ page }) => {
    await setBaseInputs(page);
    await setSliderValue(page, '#btl-term', 10);

    await openAdvancedOptions(page);
    await page.click('[data-button-group="btl-rent-increase"] button[data-value="on"]');
    await page.fill('#btl-rent-increase-percent', '5');
    await runCalculation(page);

    const yearFive = page.locator('#btl-table-body tr').nth(4).locator('td').nth(1);
    const yearFiveRent = parseNumber(await yearFive.textContent());
    expect(yearFiveRent).toBeGreaterThan(12000);

    const keyResult = page.locator('#loan-btl-explanation [data-btl="net-monthly"]').first();
    await expect(keyResult).not.toBeEmpty();
  });

  test('BTL-TEST-E2E-5: single-pane structure and labels', async ({ page }) => {
    await expect(page.locator('.hl-cluster-panel')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('#loan-btl-explanation #btl-section-faq .btl-faq-card')).toHaveCount(6);
    await expect(page.locator('#btl-price-field')).toHaveValue('250000');
    await expect(page.locator('#btl-rent-field')).toHaveValue('1400');
    await expect(page.locator('#btl-deposit-amount-field')).toHaveValue('50000');
    await expect(page.locator('#btl-deposit-percent-field')).toHaveValue('20.0');
    await expect(page.locator('#btl-rate-field')).toHaveValue('5.5');
    await expect(page.locator('#btl-term-field')).toHaveValue('25');

    const allLabeled = await page.$$eval('input', (inputs) =>
      inputs.every((input) => {
        if (!input.id || input.type === 'checkbox') {
          return true;
        }
        return Boolean(document.querySelector(`label[for="${input.id}"]`));
      })
    );

    expect(allLabeled).toBe(true);

    const panel = page.locator('.hl-cluster-panel').first();
    expect(await panel.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(false);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(250);
    expect(await panel.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(false);
  });

  test('BTL-TEST-E2E-6: mobile calculate reveals the buy-to-let summary', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await runCalculation(page);
    await page.waitForTimeout(350);

    const resultBox = await page.locator('#btl-results').boundingBox();
    expect(resultBox).toBeTruthy();
    expect(resultBox.y).toBeLessThan(220);

    await expect(page.locator('#btl-result')).toBeFocused();
  });
});
