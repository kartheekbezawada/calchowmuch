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

  await page.click('#btl-calculate');
}

test.describe('Buy-to-Let calculator requirements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/loans/buy-to-let');
    await page.waitForSelector('#btl-calculate');
    await page.waitForTimeout(300);
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
    await page.click('#btl-calculate');

    const percentFromAmountMode = Number(await page.inputValue('#btl-deposit-percent'));
    expect(percentFromAmountMode).toBeCloseTo(25, 1);

    const baselineNetMonthly = parseNumber(await page.locator('[data-btl="net-monthly"]').first().textContent());

    await page.click('[data-button-group="btl-deposit-type"] button[data-value="percent"]');
    await setSliderValue(page, '#btl-deposit-percent', 30);
    await page.click('#btl-calculate');

    const syncedAmount = Number(await page.inputValue('#btl-deposit-amount'));
    expect(Math.abs(syncedAmount - 60000)).toBeLessThanOrEqual(1000);

    const updatedNetMonthly = parseNumber(await page.locator('[data-btl="net-monthly"]').first().textContent());
    expect(updatedNetMonthly).toBeGreaterThan(baselineNetMonthly);
  });

  test('BTL-TEST-I-1: table updates when rent increase toggles', async ({ page }) => {
    await setBaseInputs(page);

    const baselineCell = page.locator('#btl-table-body tr').nth(1).locator('td').nth(1);
    const baselineText = await baselineCell.textContent();
    const baselineRent = parseNumber(baselineText);

    await openAdvancedOptions(page);
    await page.click('[data-button-group="btl-rent-increase"] button[data-value="on"]');
    await page.fill('#btl-rent-increase-percent', '5');
    await page.click('#btl-calculate');

    const increasedText = await baselineCell.textContent();
    const increasedRent = parseNumber(increasedText);
    expect(increasedRent).toBeGreaterThan(baselineRent);

    const increaseIndicator = page.locator('#btl-table-body tr').nth(1).locator('td').nth(6);
    await expect(increaseIndicator).toContainText('Yes');

    await openAdvancedOptions(page);
    await page.click('[data-button-group="btl-rent-increase"] button[data-value="off"]');
    await page.click('#btl-calculate');
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
    await page.click('#btl-calculate');

    const yearFive = page.locator('#btl-table-body tr').nth(4).locator('td').nth(1);
    const yearFiveRent = parseNumber(await yearFive.textContent());
    expect(yearFiveRent).toBeGreaterThan(12000);

    const keyResult = page.locator('#loan-btl-explanation [data-btl="net-monthly"]').first();
    await expect(keyResult).not.toBeEmpty();
  });

  test('BTL-TEST-E2E-5: single-pane structure and labels', async ({ page }) => {
    await expect(page.locator('.panel.panel-span-all')).toHaveCount(1);

    const allLabeled = await page.$$eval('input', (inputs) =>
      inputs.every((input) => {
        if (!input.id || input.type === 'checkbox') {
          return true;
        }
        return Boolean(document.querySelector(`label[for="${input.id}"]`));
      })
    );

    expect(allLabeled).toBe(true);
  });
});
