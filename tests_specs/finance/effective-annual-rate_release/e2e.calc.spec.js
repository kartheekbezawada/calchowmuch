import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Effective Annual Rate Calculator', () => {
  test('EAR-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/finance-calculators/effective-annual-rate-calculator/');

    const topNavActive = page.locator('.top-nav-link.is-active .nav-label');
    await expect(topNavActive).toHaveText('Finance');

    const leftActive = page.locator('.fin-nav-item.is-active');
    await expect(leftActive).toContainText('Effective Annual Rate (EAR)');

    await page.fill('#ear-nominal-rate', '12');
    await page.click('#ear-calc');

    const resultText = await page.locator('#ear-result').textContent();
    const resultValue = parseNumber(resultText);
    const expected = (Math.pow(1 + 0.12 / 1, 1) - 1) * 100;
    expect(resultValue).toBeCloseTo(expected, 3);

    await page.click('[data-button-group="ear-frequency"] button[data-value="quarterly"]');
    await page.click('#ear-calc');

    const quarterlyResultText = await page.locator('#ear-result').textContent();
    const quarterlyValue = parseNumber(quarterlyResultText);
    const quarterlyExpected = (Math.pow(1 + 0.12 / 4, 4) - 1) * 100;
    expect(quarterlyValue).toBeCloseTo(quarterlyExpected, 3);

    await expect(page.locator('[data-ear="ear-rate"]').first()).not.toHaveText('N/A');
  });
});
