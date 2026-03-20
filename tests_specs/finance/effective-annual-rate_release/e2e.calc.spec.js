import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

async function setInputValue(page, selector, value) {
  await page.$eval(
    selector,
    (element, nextValue) => {
      const input = /** @type {HTMLInputElement} */ (element);
      input.value = String(nextValue);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    value
  );
}

test.describe('Effective Annual Rate Calculator', () => {
  test('EAR-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/finance-calculators/effective-annual-rate-calculator/');

    await expect(page.locator('.fi-cluster-site-header')).toBeVisible();
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveText('Effective Annual Rate Calculator');

    await page.click('#ear-calc');

    const expected = (Math.pow(1 + 0.12 / 1, 1) - 1) * 100;
    const resultValue = parseNumber(await page.locator('#ear-result').textContent());
    expect(resultValue).toBeCloseTo(expected, 3);

    await setInputValue(page, '#ear-nominal-rate', 18);
    await expect(page.locator('#ear-stale-note')).toBeVisible();
    expect(parseNumber(await page.locator('#ear-result').textContent())).toBeCloseTo(expected, 3);

    await page.click('[data-button-group="ear-frequency"] button[data-value="quarterly"]');
    expect(parseNumber(await page.locator('#ear-result').textContent())).toBeCloseTo(expected, 3);
    await page.click('#ear-calc');

    const quarterlyValue = parseNumber(await page.locator('#ear-result').textContent());
    const quarterlyExpected = (Math.pow(1 + 0.18 / 4, 4) - 1) * 100;
    expect(quarterlyValue).toBeCloseTo(quarterlyExpected, 3);

    await expect(page.locator('[data-ear="metric-compounding"]').first()).toHaveText('Quarterly');
  });
});
