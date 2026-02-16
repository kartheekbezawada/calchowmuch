import { expect, test } from '@playwright/test';

const FINANCE_ROUTES = [
  '/finance/present-value',
  '/finance/future-value',
  '/finance/present-value-of-annuity',
  '/finance/future-value-of-annuity',
  '/finance/simple-interest',
  '/finance/compound-interest',
  '/finance/effective-annual-rate',
  '/finance/savings-goal',
  '/finance/investment-growth',
];

const PERCENTAGE_ROUTES = [
  '/percentage-calculators/percent-change',
  '/percentage-calculators/percentage-difference',
  '/percentage-calculators/percentage-increase',
  '/percentage-calculators/percentage-decrease',
  '/percentage-calculators/percentage-composition',
  '/percentage-calculators/reverse-percentage',
  '/percentage-calculators/percent-to-fraction-decimal',
  '/percentage-calculators/what-percent-is-x-of-y',
  '/percentage-calculators/percentage-of-a-number',
  '/percentage-calculators/commission-calculator',
  '/percentage-calculators/discount-calculator',
  '/percentage-calculators/margin-calculator',
  '/percentage-calculators/markup-calculator',
];

const ALL_ROUTES = [...FINANCE_ROUTES, ...PERCENTAGE_ROUTES];

function normalize(text) {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function findFirstVisibleEditableInput(pane, { allowRange = false } = {}) {
  const selectors = [
    'input[type="number"]',
    'input[type="text"]',
    'input[type="search"]',
    'input[type="tel"]',
  ];

  if (allowRange) {
    selectors.push('input[type="range"]');
  }

  for (const selector of selectors) {
    const inputs = pane.locator(selector);
    const count = await inputs.count();
    for (let index = 0; index < count; index += 1) {
      const input = inputs.nth(index);
      if (!(await input.isVisible())) {
        continue;
      }
      if (await input.isDisabled()) {
        continue;
      }
      if ((await input.getAttribute('readonly')) !== null) {
        continue;
      }
      return input;
    }
  }

  return null;
}

async function setChangedNumericValue(input) {
  const inputType = await input.getAttribute('type');
  if (inputType === 'range') {
    await input.evaluate((el) => {
      const min = Number(el.min || 0);
      const max = Number(el.max || 100);
      const step = Number(el.step || 1);
      const current = Number(el.value || min);
      let next = current + (Number.isFinite(step) && step > 0 ? step : 1);
      if (next > max) {
        next = current - (Number.isFinite(step) && step > 0 ? step : 1);
      }
      el.value = String(next);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    return;
  }

  const raw = await input.inputValue();
  const parsed = Number.parseFloat(raw);
  let nextValue = '7';
  if (Number.isFinite(parsed)) {
    nextValue = String(parsed + (Math.abs(parsed) < 1e-9 ? 7 : 1));
  }
  if (nextValue === raw) {
    nextValue = `${nextValue}1`;
  }
  await input.fill(nextValue);
}

async function verifyButtonOnlyRecalculation(page, route) {
  await page.goto(route);

  const pane = page.locator('.center-column .panel').first();
  const result = pane.locator('.result').first();
  const explanation = page.locator('.explanation-pane').first();
  const calculateButton = pane.locator('button[id$="-calc"]').first();

  await expect(result).toBeVisible();
  await expect(explanation).toBeVisible();
  await expect(calculateButton).toBeVisible();

  const baselineResult = normalize(await result.textContent());
  const baselineExplanation = normalize(await explanation.textContent());

  const input = await findFirstVisibleEditableInput(pane, {
    allowRange: route.startsWith('/finance/'),
  });
  expect(input, `${route} must expose at least one visible editable input`).not.toBeNull();
  await setChangedNumericValue(input);
  await page.waitForTimeout(150);

  const afterInputResult = normalize(await result.textContent());
  const afterInputExplanation = normalize(await explanation.textContent());
  expect(afterInputResult, `${route} result changed before clicking calculate`).toBe(baselineResult);
  expect(afterInputExplanation, `${route} explanation changed before clicking calculate`).toBe(
    baselineExplanation
  );

  await calculateButton.click();

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
        message: `${route} did not update after clicking calculate`,
      }
    )
    .toBe(true);
}

test.describe('Button-Only Recalculation (Finance + Percentage)', () => {
  test('BTN-ONLY-E2E-1: all target calculators update only after Calculate click', async ({
    page,
  }) => {
    for (const route of ALL_ROUTES) {
      await test.step(route, async () => {
        await verifyButtonOnlyRecalculation(page, route);
      });
    }
  });
});
