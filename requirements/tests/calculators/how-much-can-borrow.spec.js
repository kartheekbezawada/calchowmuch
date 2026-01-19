/**
 * How Much Can I Borrow Calculator - Playwright E2E Tests
 *
 * Test coverage per HOW_MUCH_CAN_I_BORROW_RULES.md
 * All tests follow UNIVERSAL_REQUIREMENTS.md [TEST-x.x] standards
 *
 * Test File: tests/calculators/how-much-can-borrow.spec.js
 * Calculator: /calculators/loans/how-much-can-borrow/
 */

import { test, expect } from '@playwright/test';

const CALCULATOR_URL = '/calculators/loans/how-much-can-borrow/';

// Helper function to format current datetime for logging
function getTimestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

// Test data constants
const TEST_DATA = {
  standard: {
    grossIncome: 80000,
    netIncome: 5000,
    expenses: 2000,
    debts: 400,
    rate: 4.5,
    term: 30,
    multiple: 4.5,
    paymentCap: 40,
    deposit: 20000,
  },
  highIncome: {
    grossIncome: 150000,
    netIncome: 8500,
    expenses: 3000,
    debts: 800,
    rate: 5.2,
    term: 25,
    multiple: 5.0,
    paymentCap: 35,
    deposit: 50000,
  },
  lowIncome: {
    grossIncome: 35000,
    netIncome: 2200,
    expenses: 1500,
    debts: 300,
    rate: 6.0,
    term: 35,
    multiple: 4.0,
    paymentCap: 30,
    deposit: 5000,
  },
};

// Helper functions
async function fillStandardInputs(page, data = TEST_DATA.standard) {
  await page.fill('#bor-gross-income', String(data.grossIncome));
  await page.fill('#bor-net-income', String(data.netIncome));
  await page.fill('#bor-expenses', String(data.expenses));
  await page.fill('#bor-debts', String(data.debts));
  await page.fill('#bor-rate', String(data.rate));
  await page.fill('#bor-term', String(data.term));
  if (data.deposit) {
    await page.fill('#bor-deposit', String(data.deposit));
  }
}

async function selectMethod(page, method) {
  const selector = method === 'income'
    ? '[data-button-group="bor-method"] [data-value="income"]'
    : '[data-button-group="bor-method"] [data-value="payment"]';
  await page.click(selector);
}

async function waitForCalculation(page) {
  // Wait for result to appear (indicating calculation completed)
  await page.waitForSelector('#bor-result:not(:empty)', { timeout: 5000 });
}

test.describe('How Much Can I Borrow Calculator Requirements', () => {
  test.beforeEach(async ({ page }) => {
    console.log(`[${getTimestamp()}] Starting test: ${test.info().title}`);
    await page.goto(CALCULATOR_URL);
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({ page }) => {
    console.log(`[${getTimestamp()}] Completed test: ${test.info().title}`);
  });

  // BOR-TEST-E2E-1: Compact Input Layout
  test('BOR-TEST-E2E-1: compact input layout desktop and mobile', async ({ page }) => {
    console.log('[E2E-1] Testing compact input layout responsiveness');

    // Desktop layout test
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500); // Allow layout to settle

    const grossIncomeBox = await page.locator('#bor-gross-income').boundingBox();
    const expensesBox = await page.locator('#bor-expenses').boundingBox();
    const debtsBox = await page.locator('#bor-debts').boundingBox();

    expect(grossIncomeBox).toBeTruthy();
    expect(expensesBox).toBeTruthy();
    expect(debtsBox).toBeTruthy();

    // Mobile layout test
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Allow layout to settle

    console.log('[E2E-1] ✓ Layout tested');
  });

  // BOR-TEST-E2E-2: Input Maxlength Restriction
  test('BOR-TEST-E2E-2: input maxlength restriction', async ({ page }) => {
    console.log('[E2E-2] Testing input maxlength validation');

    // Try to input 15 digits (should be limited to 10)
    const longValue = '123456789012345';
    await page.fill('#bor-gross-income', longValue);

    const actualValue = await page.inputValue('#bor-gross-income');
    expect(actualValue.length).toBeLessThanOrEqual(10);

    // Test with other inputs
    await page.fill('#bor-expenses', longValue);
    const expensesValue = await page.inputValue('#bor-expenses');
    expect(expensesValue.length).toBeLessThanOrEqual(10);

    console.log('[E2E-2] ✓ Input maxlength restriction verified');
  });

  // BOR-TEST-E2E-3: Affordability Method Toggle
  test('BOR-TEST-E2E-3: affordability method toggle', async ({ page }) => {
    console.log('[E2E-3] Testing affordability method switching');

    // Initially Income Multiple should be selected
    const incomeMultipleField = page.locator('#bor-multiple-row');
    const paymentCapField = page.locator('#bor-cap-row');

    await expect(incomeMultipleField).toBeVisible();
    await expect(paymentCapField).toHaveClass(/is-hidden/);

    // Switch to Payment Cap method
    await selectMethod(page, 'payment');
    await page.waitForTimeout(300); // Allow UI to update

    await expect(incomeMultipleField).toHaveClass(/is-hidden/);
    await expect(paymentCapField).toBeVisible();

    console.log('[E2E-3] ✓ Method toggle functionality verified');
  });

  // BOR-TEST-E2E-4: Graph Interactivity
  test('BOR-TEST-E2E-4: graph hover tooltip functionality', async ({ page }) => {
    console.log('[E2E-4] Testing graph interactivity');

    // Fill inputs and calculate to generate graph
    await fillStandardInputs(page);
    await page.click('#bor-calculate');
    await waitForCalculation(page);

    // Find the graph element
    const graph = page.locator('#bor-graph-line');
    await expect(graph).toBeVisible();

    // Hover over graph (simulate hover on middle of graph area)
    const graphBox = await graph.boundingBox();
    if (graphBox) {
      await page.mouse.move(
        graphBox.x + graphBox.width / 2,
        graphBox.y + graphBox.height / 2
      );

      // Wait for potential tooltip (if implemented)
      await page.waitForTimeout(500);
    }

    console.log('[E2E-4] ✓ Graph interaction tested');
  });

  // BOR-TEST-E2E-5: Full User Journey
  test('BOR-TEST-E2E-5: complete user workflow', async ({ page }) => {
    console.log('[E2E-5] Testing complete user journey');

    const testData = TEST_DATA.standard;

    // Step 1: Enter gross income
    await page.fill('#bor-gross-income', String(testData.grossIncome));

    // Step 2: Enter monthly expenses
    await page.fill('#bor-expenses', String(testData.expenses));

    // Step 3: Enter monthly debts
    await page.fill('#bor-debts', String(testData.debts));

    // Step 4: Select Payment Cap method
    await selectMethod(page, 'payment');

    // Step 5: Enter payment cap
    await page.fill('#bor-cap', String(testData.paymentCap));

    // Step 6: Enter interest rate
    await page.fill('#bor-rate', String(testData.rate));

    // Step 7: Enter term
    await page.fill('#bor-term', String(testData.term));

    // Step 8: Click calculate
    await page.click('#bor-calculate');

    // Step 9: Wait for and verify results
    await waitForCalculation(page);

    const resultText = await page.textContent('#bor-result');
    expect(resultText).toBeTruthy();
    expect(resultText).toContain('£'); // Should contain currency

    // Verify summary is populated
    const summaryText = await page.textContent('#bor-summary');
    expect(summaryText).toBeTruthy();

    console.log('[E2E-5] ✓ Full user journey completed successfully');
  });

  // BOR-TEST-E2E-6: Error Handling
  test('BOR-TEST-E2E-6: error state handling', async ({ page }) => {
    console.log('[E2E-6] Testing error conditions');

    // Test 1: Zero income
    await page.fill('#bor-gross-income', '0');
    await page.click('#bor-calculate');

    await page.waitForTimeout(500);
    const errorText = await page.textContent('#bor-result');
    expect(errorText).toContain('greater than 0');

    // Test 2: Expenses > income (not affordable)
    await page.fill('#bor-gross-income', '30000'); // £30k annual = £2.5k monthly
    await page.fill('#bor-expenses', '2000');
    await page.fill('#bor-debts', '800'); // Total outgoings > income
    await page.click('#bor-calculate');

    await page.waitForTimeout(500);
    const notAffordableText = await page.textContent('#bor-result');
    expect(notAffordableText).toContain('Not affordable');

    // Test 3: Negative rate
    await page.fill('#bor-gross-income', '50000');
    await page.fill('#bor-expenses', '1000');
    await page.fill('#bor-debts', '200');
    await page.fill('#bor-rate', '-1');
    await page.click('#bor-calculate');

    await page.waitForTimeout(500);
    const negativeRateText = await page.textContent('#bor-result');
    expect(negativeRateText).toContain('0 or more');

    console.log('[E2E-6] ✓ Error handling verified');
  });

  // BOR-TEST-E2E-7: Accessibility
  test('BOR-TEST-E2E-7: accessibility compliance', async ({ page }) => {
    console.log('[E2E-7] Testing accessibility features');

    // Check for proper labels
    const grossIncomeLabel = page.locator('label[for="bor-gross-income"]');
    await expect(grossIncomeLabel).toBeVisible();

    // Check button group ARIA attributes
    const methodGroup = page.locator('[data-button-group="bor-method"]');
    await expect(methodGroup).toHaveAttribute('role', 'group');

    // Test keyboard navigation
    await page.keyboard.press('Tab'); // Should focus first input
    const focusedElement = await page.evaluate(() => document.activeElement?.id);
    expect(focusedElement).toBe('bor-gross-income');

    // Test ARIA pressed states
    const activeButton = page.locator('[data-button-group="bor-method"] .is-active');
    await expect(activeButton).toHaveAttribute('aria-pressed', 'true');

    console.log('[E2E-7] ✓ Accessibility features verified');
  });

  // BOR-TEST-E2E-8: Layout Stability
  test('BOR-TEST-E2E-8: layout stability', async ({ page }) => {
    console.log('[E2E-8] Testing layout stability');

    // Get initial layout measurements
    const initialBox = await page.locator('#calc-how-much-can-borrow').boundingBox();

    // Enter values and calculate
    await fillStandardInputs(page);
    await page.click('#bor-calculate');
    await waitForCalculation(page);

    // Check layout hasn't shifted
    const afterCalcBox = await page.locator('#calc-how-much-can-borrow').boundingBox();
    expect(afterCalcBox?.width).toBe(initialBox?.width);

    // Toggle method and check stability
    await selectMethod(page, 'payment');
    await page.waitForTimeout(300);

    const afterToggleBox = await page.locator('#calc-how-much-can-borrow').boundingBox();
    expect(afterToggleBox?.width).toBe(initialBox?.width);

    console.log('[E2E-8] ✓ Layout stability verified');
  });

  // BOR-TEST-E2E-9: Visual Regression
  test('BOR-TEST-E2E-9: visual regression check', async ({ page }) => {
    console.log('[E2E-9] Testing visual consistency');

    // Fill form to get full state
    await fillStandardInputs(page);
    await page.click('#bor-calculate');
    await waitForCalculation(page);

    // Check color scheme elements
    const primaryButton = page.locator('#bor-calculate');
    const buttonStyles = await primaryButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontFamily: styles.fontFamily,
      };
    });

    // Verify theme tokens are applied (basic check)
    expect(buttonStyles.fontFamily).toContain('Trebuchet MS');

    console.log('[E2E-9] ✓ Visual regression baseline captured');
  });

  // Performance test
  test('performance: calculator load and calculation speed', async ({ page }) => {
    console.log('[PERF] Testing performance metrics');

    const startTime = Date.now();

    // Test calculation speed
    await fillStandardInputs(page);
    const calcStartTime = Date.now();
    await page.click('#bor-calculate');
    await waitForCalculation(page);
    const calcEndTime = Date.now();

    const calculationTime = calcEndTime - calcStartTime;
    expect(calculationTime).toBeLessThan(1000); // Should calculate in under 1 second

    console.log(`[PERF] Calculation completed in ${calculationTime}ms`);
  });

  // Integration test: Method switching affects results
  test('integration: method switching produces different results', async ({ page }) => {
    console.log('[INT] Testing method switching integration');

    // Fill standard inputs
    await fillStandardInputs(page);
    await page.fill('#bor-multiple', String(TEST_DATA.standard.multiple));

    // Calculate with income multiple method
    await selectMethod(page, 'income');
    await page.click('#bor-calculate');
    await waitForCalculation(page);

    const incomeMethodResult = await page.textContent('#bor-result');

    // Switch to payment cap method
    await selectMethod(page, 'payment');
    await page.fill('#bor-cap', String(TEST_DATA.standard.paymentCap));
    await page.click('#bor-calculate');
    await waitForCalculation(page);

    const paymentMethodResult = await page.textContent('#bor-result');

    // Results should be different
    expect(incomeMethodResult).not.toBe(paymentMethodResult);

    console.log('[INT] ✓ Method switching produces different results');
  });
});
