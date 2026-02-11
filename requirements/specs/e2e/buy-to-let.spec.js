import { test, expect } from '@playwright/test';

function parseNumber(text) {
  return Number(
    String(text || '')
      .replace(/,/g, '')
      .trim()
  );
}

async function openAdvancedOptions(page) {
  const details = page.locator('#calc-buy-to-let details.advanced-options');
  const isOpen = await details.evaluate((node) => node.open);
  if (!isOpen) {
    await page.locator('#calc-buy-to-let details.advanced-options summary').click();
  }
}

async function setBaseInputs(page) {
  await page.fill('#btl-price', '200000');
  await page.fill('#btl-deposit-amount', '50000');
  await page.fill('#btl-rate', '5');
  await page.fill('#btl-term', '5');
  await page.fill('#btl-rent', '1000');

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

  test('BTL-TEST-E2E-1: compact input layout desktop and mobile', async ({ page }) => {
    const depositBox = await page.locator('#btl-deposit-amount').boundingBox();
    const rateBox = await page.locator('#btl-rate').boundingBox();
    if (!depositBox || !rateBox) {
      throw new Error('Compact input row could not be measured.');
    }

    expect(Math.abs(depositBox.y - rateBox.y)).toBeLessThan(6);

    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    await page.waitForSelector('#btl-deposit-amount');

    const depositMobile = await page.locator('#btl-deposit-amount').boundingBox();
    const rateMobile = await page.locator('#btl-rate').boundingBox();

    if (!depositMobile || !rateMobile) {
      throw new Error('Mobile input layout could not be measured.');
    }

    expect(rateMobile.y).toBeGreaterThan(depositMobile.y + 8);
  });

  test('BTL-TEST-E2E-2: input maxlength restriction', async ({ page }) => {
    await page.fill('#btl-price', '123456789012345');
    const value = await page.inputValue('#btl-price');
    expect(value.length).toBeLessThanOrEqual(10);
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

  test('BTL-TEST-E2E-3: key results advanced toggle reveals optional rows', async ({ page }) => {
    const advancedRow = page
      .locator('#loan-btl-explanation [data-btl-advanced-row]')
      .filter({ hasText: 'Vacancy Type' })
      .first();

    await expect(advancedRow).toBeHidden();

    await page.check('#btl-key-results-advanced-toggle');
    await expect(advancedRow).toBeVisible();

    await page.uncheck('#btl-key-results-advanced-toggle');
    await expect(advancedRow).toBeHidden();
  });

  test('BTL-TEST-E2E-4: full user journey with rent increase', async ({ page }) => {
    await setBaseInputs(page);
    await page.fill('#btl-term', '10');

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
