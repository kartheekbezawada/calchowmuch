import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Compound Interest Calculator', () => {
  test('CI-TEST-E2E-1: user journey and results', async ({ page }) => {
    await page.goto('/finance/compound-interest');

    const topNavActive = page.locator('.top-nav-link.is-active .nav-label');
    await expect(topNavActive).toHaveText('Finance');

    const leftActive = page.locator('.nav-item.is-active');
    await expect(leftActive).toHaveText('Compound Interest');

    const optionalSection = page.locator('#ci-optional-section');
    await expect(optionalSection).toHaveClass(/is-hidden/);

    await page.fill('#ci-principal', '10000');
    await page.fill('#ci-rate', '5');
    await page.fill('#ci-time', '10');
    await page.click('[data-button-group="ci-compounding"] button[data-value="monthly"]');
    await page.click('#ci-calc');

    const resultText = await page.locator('#ci-result').textContent();
    expect(resultText).toContain('Ending Balance');
    const resultValue = parseNumber(resultText);
    const expected = 10000 * Math.pow(1 + 0.05 / 12, 120);
    expect(resultValue).toBeCloseTo(expected, 0);

    await page.click('#ci-optional-toggle');
    await expect(optionalSection).not.toHaveClass(/is-hidden/);

    await page.fill('#ci-contribution', '100');
    await page.click('#ci-calc');

    const contribResultText = await page.locator('#ci-result').textContent();
    const contribValue = parseNumber(contribResultText);
    expect(contribValue).toBeGreaterThan(expected);

    await expect(page.locator('[data-ci="ending-balance"]').first()).not.toHaveText('N/A');
  });
});
