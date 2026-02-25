import { test, expect } from '@playwright/test';

const CALCULATOR_URL = '/loan-calculators/how-much-can-i-borrow/';

const TEST_DATA = {
  standard: {
    grossIncome: 80000,
    netIncome: 5000,
    expenses: 2000,
    debts: 400,
    rate: 4.5,
    term: 30,
    multiple: 4.5,
    deposit: 20000,
  },
};

async function setSliderValue(page, selector, value) {
  await page.locator(selector).evaluate((element, nextValue) => {
    element.value = String(nextValue);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function fillStandardInputs(page, data = TEST_DATA.standard) {
  await setSliderValue(page, '#bor-gross-income', data.grossIncome);
  await setSliderValue(page, '#bor-net-income', data.netIncome);
  await setSliderValue(page, '#bor-expenses', data.expenses);
  await setSliderValue(page, '#bor-debts', data.debts);
  await setSliderValue(page, '#bor-rate', data.rate);
  await setSliderValue(page, '#bor-term', data.term);
  await setSliderValue(page, '#bor-multiple', data.multiple);
  await setSliderValue(page, '#bor-deposit', data.deposit);
}

async function selectMethod(page, method) {
  const selector =
    method === 'income'
      ? '[data-button-group="bor-method"] [data-value="income"]'
      : '[data-button-group="bor-method"] [data-value="payment"]';
  await page.click(selector);
}

async function waitForCalculation(page) {
  await page.waitForFunction(
    () => {
      const el = document.querySelector('#bor-metric-borrow');
      return el && el.textContent.trim() !== '' && el.textContent.trim() !== '\u2014';
    },
    { timeout: 5000 }
  );
}

function parseNumber(text) {
  const parsed = Number(String(text).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

test.describe('How Much Can I Borrow Calculator Requirements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CALCULATOR_URL);
    await page.waitForLoadState('networkidle');
  });

  test('BOR-TEST-E2E-1: single-pane layout with no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.waitForTimeout(250);

    const centerPanels = page.locator('.center-column > .panel');
    await expect(centerPanels).toHaveCount(1);
    await expect(centerPanels.first()).toHaveClass(/panel-span-all/);

    const calcPanel = centerPanels.first();
    const panelBox = await calcPanel.boundingBox();
    const grossBox = await page.locator('#bor-gross-income').boundingBox();
    const rateBox = await page.locator('#bor-rate').boundingBox();

    expect(panelBox).toBeTruthy();
    expect(grossBox).toBeTruthy();
    expect(rateBox).toBeTruthy();

    expect(grossBox.width).toBeLessThan(panelBox.width);
    expect(rateBox.width).toBeGreaterThan(100);

    const desktopOverflow = await calcPanel.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(desktopOverflow).toBe(false);

    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(250);

    const mobileOverflow = await calcPanel.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(mobileOverflow).toBe(false);
  });

  test('BOR-TEST-E2E-2: affordability method toggles guided rows', async ({ page }) => {
    const multipleRow = page.locator('#bor-multiple-row');
    const paymentNoteRow = page.locator('#bor-payment-note-row');

    await expect(multipleRow).toBeVisible();
    await expect(paymentNoteRow).toBeHidden();

    await selectMethod(page, 'payment');
    await expect(multipleRow).toBeHidden();
    await expect(paymentNoteRow).toBeVisible();

    const paymentButton = page.locator('[data-button-group="bor-method"] [data-value="payment"]');
    const incomeButton = page.locator('[data-button-group="bor-method"] [data-value="income"]');
    await expect(paymentButton).toHaveAttribute('aria-pressed', 'true');
    await expect(incomeButton).toHaveAttribute('aria-pressed', 'false');

    await selectMethod(page, 'income');
    await expect(multipleRow).toBeVisible();
    await expect(paymentNoteRow).toBeHidden();
  });

  test('BOR-TEST-E2E-3: no currency symbols in results or displays', async ({ page }) => {
    await fillStandardInputs(page);
    await page.click('#bor-calculate');
    await waitForCalculation(page);

    const borrowText = await page.locator('#bor-metric-borrow').innerText();
    const propertyText = await page.locator('#bor-metric-property').innerText();
    const paymentText = await page.locator('#bor-metric-payment').innerText();
    const depositDisplay = await page.locator('#bor-deposit-display').innerText();

    expect(borrowText).not.toMatch(/[£$€]/);
    expect(propertyText).not.toMatch(/[£$€]/);
    expect(paymentText).not.toMatch(/[£$€]/);
    expect(depositDisplay).not.toMatch(/[£$€]/);

    expect(borrowText).toMatch(/[0-9]/);

    await setSliderValue(page, '#bor-deposit', 0);
    await page.click('#bor-calculate');
    await waitForCalculation(page);

    const propertyZeroDeposit = await page.locator('#bor-metric-property').innerText();
    expect(propertyZeroDeposit.trim()).not.toBe('—');
    expect(parseNumber(propertyZeroDeposit)).toBeGreaterThan(0);
  });

  test('BOR-TEST-E2E-4: complete user workflow with income multiple', async ({ page }) => {
    await fillStandardInputs(page);
    await page.click('#bor-calculate');
    await waitForCalculation(page);

    const borrowText = await page.textContent('#bor-metric-borrow');
    expect(borrowText.trim()).toMatch(/[0-9,]+/);

    const constraintText = await page.textContent('#bor-constraint');
    expect(constraintText).toContain('Income multiple');

    const propertyText = await page.textContent('#bor-metric-property');
    expect(propertyText.trim()).toMatch(/[0-9,]+/);
  });

  test('BOR-TEST-E2E-5: complete user workflow payment-to-income', async ({ page }) => {
    await setSliderValue(page, '#bor-gross-income', TEST_DATA.standard.grossIncome);
    await setSliderValue(page, '#bor-net-income', TEST_DATA.standard.netIncome);
    await setSliderValue(page, '#bor-expenses', TEST_DATA.standard.expenses);
    await setSliderValue(page, '#bor-debts', TEST_DATA.standard.debts);
    await setSliderValue(page, '#bor-rate', TEST_DATA.standard.rate);
    await setSliderValue(page, '#bor-term', TEST_DATA.standard.term);

    await selectMethod(page, 'payment');
    await page.click('#bor-calculate');
    await waitForCalculation(page);

    const borrowText = await page.textContent('#bor-metric-borrow');
    expect(borrowText.trim()).toMatch(/[0-9,]+/);

    const constraintText = await page.textContent('#bor-constraint');
    expect(constraintText).toContain('Payment-to-income cap');
  });

  test('BOR-TEST-E2E-6: error state handling', async ({ page }) => {
    await setSliderValue(page, '#bor-gross-income', 0);
    await page.click('#bor-calculate');
    await expect(page.locator('#bor-error')).toContainText('greater than 0');

    await setSliderValue(page, '#bor-gross-income', 30000);
    await setSliderValue(page, '#bor-expenses', 14000);
    await setSliderValue(page, '#bor-debts', 800);
    await page.click('#bor-calculate');
    await expect(page.locator('#bor-error')).toContainText('Not affordable');
  });

  test('BOR-TEST-E2E-7: layout stability after calculate and method switch', async ({ page }) => {
    const initialBox = await page.locator('#calc-how-much-can-borrow').boundingBox();

    await fillStandardInputs(page);
    await page.click('#bor-calculate');
    await waitForCalculation(page);

    const afterCalcBox = await page.locator('#calc-how-much-can-borrow').boundingBox();
    expect(afterCalcBox?.width).toBe(initialBox?.width);

    await selectMethod(page, 'payment');
    const afterToggleBox = await page.locator('#calc-how-much-can-borrow').boundingBox();
    expect(afterToggleBox?.width).toBe(initialBox?.width);
  });

  test('BOR-TEST-E2E-8: capacity bar renders segments after calculation', async ({ page }) => {
    await fillStandardInputs(page);
    await page.click('#bor-calculate');
    await waitForCalculation(page);

    const expenseSeg = page.locator('[data-bor="cap-expenses"]');
    const debtSeg = page.locator('[data-bor="cap-debts"]');
    const mortgageSeg = page.locator('[data-bor="cap-mortgage"]');
    const bufferSeg = page.locator('[data-bor="cap-buffer"]');

    await expect(expenseSeg).toBeVisible();
    await expect(debtSeg).toBeVisible();
    await expect(mortgageSeg).toBeVisible();
    await expect(bufferSeg).toBeVisible();

    const legendExpenses = page.locator('[data-bor="legend-expenses"]');
    const legendMortgage = page.locator('[data-bor="legend-mortgage"]');
    await expect(legendExpenses).toContainText(/[0-9]/);
    await expect(legendMortgage).toContainText(/[0-9]/);
  });

  test('BOR-TEST-E2E-9: scenario table renders with highlighted current rate', async ({ page }) => {
    await fillStandardInputs(page);
    await page.click('#bor-calculate');
    await waitForCalculation(page);

    const tableRows = page.locator('#bor-scenario-body tr');
    expect(await tableRows.count()).toBeGreaterThan(0);

    const highlightedRow = page.locator('#bor-scenario-body tr.bor-scenario-highlight');
    await expect(highlightedRow).toHaveCount(1);

    const headers = page.locator('#bor-scenario-table thead th');
    expect(await headers.count()).toBe(4);

    const toggleGroup = page.locator('#loan-borrow-explanation [data-button-group]');
    await expect(toggleGroup).toHaveCount(0);

    const rowValues = await page.locator('#bor-scenario-body tr').evaluateAll((rows) =>
      rows.map((row) => {
        const cells = Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim() || '');
        return {
          rate: cells[0],
          maxBorrow: cells[1],
          estMonthly: cells[2],
          maxProperty: cells[3],
        };
      })
    );

    expect(rowValues.length).toBeGreaterThan(1);

    const monthlyValues = rowValues.map((row) => parseNumber(row.estMonthly));
    expect(new Set(monthlyValues).size).toBeGreaterThan(1);

    const propertyValues = rowValues.map((row) => parseNumber(row.maxProperty));
    expect(new Set(propertyValues).size).toBeGreaterThan(1);
  });

  test('BOR-TEST-E2E-10: 10 FAQ cards in grid layout', async ({ page }) => {
    await page.click('#bor-calculate');
    await page.waitForTimeout(500);

    const faqCards = page.locator('#loan-borrow-explanation .bor-faq-card');
    await expect(faqCards).toHaveCount(10);

    const firstNumber = page.locator('.bor-faq-number').first();
    await expect(firstNumber).toHaveText('01');

    const lastNumber = page.locator('.bor-faq-number').last();
    await expect(lastNumber).toHaveText('10');
  });
});
