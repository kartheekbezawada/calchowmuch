import { test, expect } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/,/g, '').trim());
}

async function setBaseInputs(page) {
  await page.fill('#btl-price', '200000');
  await page.fill('#btl-deposit-amount', '50000');
  await page.fill('#btl-rate', '5');
  await page.fill('#btl-term', '5');
  await page.fill('#btl-rent', '1000');
  await page.fill('#btl-vacancy-percent', '0');
  await page.fill('#btl-agent-fee', '0');
  await page.fill('#btl-maintenance', '0');
  await page.fill('#btl-other-costs', '0');
  await page.click('#btl-calculate');
}

test.describe('Buy-to-Let calculator requirements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/calculators/buy-to-let');
    await page.waitForSelector('#btl-calculate');
    await page.waitForTimeout(300);
  });

  test('BTL-TEST-E2E-1: compact input layout desktop and mobile', async ({ page }) => {
    const depositBox = await page.locator('#btl-deposit-amount').boundingBox();
    const rateBox = await page.locator('#btl-rate').boundingBox();
    const termBox = await page.locator('#btl-term').boundingBox();

    if (!depositBox || !rateBox || !termBox) {
      throw new Error('Compact input row could not be measured.');
    }

    expect(Math.abs(depositBox.y - rateBox.y)).toBeLessThan(6);
    expect(Math.abs(rateBox.y - termBox.y)).toBeLessThan(6);

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

    const baselineCell = page
      .locator('#btl-table-body tr')
      .nth(1)
      .locator('td')
      .nth(1);
    const baselineText = await baselineCell.textContent();
    const baselineRent = parseNumber(baselineText);

    await page.click('[data-button-group="btl-rent-increase"] button[data-value="on"]');
    await page.fill('#btl-rent-increase-percent', '5');
    await page.click('#btl-calculate');

    const increasedText = await baselineCell.textContent();
    const increasedRent = parseNumber(increasedText);
    expect(increasedRent).toBeGreaterThan(baselineRent);

    const increaseIndicator = page
      .locator('#btl-table-body tr')
      .nth(1)
      .locator('td')
      .nth(6);
    await expect(increaseIndicator).toContainText('Yes');

    await page.click('[data-button-group="btl-rent-increase"] button[data-value="off"]');
    await page.click('#btl-calculate');
    const revertedText = await baselineCell.textContent();
    const revertedRent = parseNumber(revertedText);
    expect(revertedRent).toBeCloseTo(baselineRent, 2);
  });

  test('BTL-TEST-I-2: graph shows baseline and increase lines', async ({ page }) => {
    await setBaseInputs(page);
    await page.click('[data-button-group="btl-rent-increase"] button[data-value="on"]');
    await page.fill('#btl-rent-increase-percent', '5');
    await page.click('#btl-calculate');

    const increaseLine = page.locator('#btl-cashflow-line .line-rent-increase');
    await expect(increaseLine).toHaveAttribute('points', /.+/);

    const legend = page.locator('#btl-cashflow-legend-increase');
    await expect(legend).not.toHaveClass(/is-hidden/);
  });

  test('BTL-TEST-I-3 / E2E-3: graph tooltip on hover', async ({ page }) => {
    await setBaseInputs(page);
    await page.click('[data-button-group="btl-rent-increase"] button[data-value="on"]');
    await page.fill('#btl-rent-increase-percent', '5');
    await page.click('#btl-calculate');

    const hoverLayer = page.locator('#btl-cashflow-hover');
    const box = await hoverLayer.boundingBox();
    if (!box) {
      throw new Error('Graph hover layer not found.');
    }
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

    const tooltip = page.locator('#btl-cashflow-tooltip');
    await expect(tooltip).not.toHaveClass(/is-hidden/);
    await expect(tooltip).toContainText('Baseline');
    await expect(tooltip).toContainText('With increase');

    await page.mouse.move(box.x + box.width + 50, box.y + box.height + 50);
    await expect(tooltip).toHaveClass(/is-hidden/);
  });

  test('BTL-TEST-E2E-4: full user journey with rent increase', async ({ page }) => {
    await setBaseInputs(page);
    await page.fill('#btl-term', '10');
    await page.click('[data-button-group="btl-rent-increase"] button[data-value="on"]');
    await page.fill('#btl-rent-increase-percent', '5');
    await page.click('#btl-calculate');

    const yearFive = page
      .locator('#btl-table-body tr')
      .nth(4)
      .locator('td')
      .nth(1);
    const yearFiveRent = parseNumber(await yearFive.textContent());
    expect(yearFiveRent).toBeGreaterThan(12000);

    const hoverLayer = page.locator('#btl-cashflow-hover');
    const box = await hoverLayer.boundingBox();
    if (!box) {
      throw new Error('Graph hover layer not found.');
    }
    const yearIndex = 4;
    const totalYears = await page.locator('#btl-table-body tr').count();
    const ratio = totalYears > 1 ? yearIndex / (totalYears - 1) : 0;
    await page.mouse.move(box.x + box.width * ratio, box.y + box.height / 2);

    const tooltipTitle = page.locator('#btl-cashflow-tooltip-title');
    await expect(tooltipTitle).toContainText('Year 5');
  });

  test('BTL-TEST-E2E-5: all inputs have labels', async ({ page }) => {
    const allLabeled = await page.$$eval('input', (inputs) =>
      inputs.every((input) => {
        if (!input.id) {
          return false;
        }
        return Boolean(document.querySelector(`label[for="${input.id}"]`));
      })
    );

    expect(allLabeled).toBe(true);
  });
});
