import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Effective Annual Rate Calculator', () => {
  test('EAR-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/finance/effective-annual-rate');

    const topNavActive = page.locator('.top-nav-link.is-active .nav-label');
    await expect(topNavActive).toHaveText('Finance');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Effective Annual Rate (EAR)');

    const optionalSection = page.locator('#ear-optional-section');
    await expect(optionalSection).toHaveClass(/is-hidden/);

    await page.fill('#ear-nominal-rate', '12');
    await page.click('[data-button-group="ear-frequency"] button[data-value="monthly"]');
    await page.click('#ear-calc');

    const resultText = await page.locator('#ear-result').textContent();
    const resultValue = parseNumber(resultText);
    const expected = (Math.pow(1 + 0.12 / 12, 12) - 1) * 100;
    expect(resultValue).toBeCloseTo(expected, 3);

    await page.click('#ear-optional-toggle');
    await expect(optionalSection).not.toHaveClass(/is-hidden/);

    await page.fill('#ear-custom-periods', '52');
    await page.click('#ear-calc');

    const customResultText = await page.locator('#ear-result').textContent();
    const customValue = parseNumber(customResultText);
    const customExpected = (Math.pow(1 + 0.12 / 52, 52) - 1) * 100;
    expect(customValue).toBeCloseTo(customExpected, 3);

    await expect(page.locator('[data-ear="ear-rate"]').first()).not.toHaveText('N/A');
  });
});
