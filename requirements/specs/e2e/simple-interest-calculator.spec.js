import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Simple Interest Calculator', () => {
  test('SI-TEST-E2E-1: user journey and calculation output', async ({ page }) => {
    await page.goto('/finance/simple-interest');

    await expect(page.locator('.top-nav-link.is-active .nav-label')).toHaveText('Finance');
    await expect(page.locator('.nav-item.is-active')).toHaveText('Simple Interest');

    const optionalSection = page.locator('#si-optional-section');
    await expect(optionalSection).toHaveClass(/is-hidden/);

    await page.fill('#si-principal', '10000');
    await page.fill('#si-rate', '6');
    await page.fill('#si-time', '3');
    await page.click('#si-calc');

    const totalInterestText = await page.locator('#si-result').textContent();
    expect(parseNumber(totalInterestText)).toBeCloseTo(1800, 3);

    const endingText = await page.locator('#si-result-detail').textContent();
    expect(parseNumber(endingText)).toBeCloseTo(11800, 3);

    await page.click('#si-optional-toggle');
    await expect(optionalSection).not.toHaveClass(/is-hidden/);

    await page.click('[data-button-group="si-basis"] button[data-value="per-month"]');
    await page.fill('#si-time', '6');
    await page.click('[data-button-group="si-time-unit"] button[data-value="months"]');
    await page.click('#si-calc');

    const monthlyInterestText = await page.locator('#si-result').textContent();
    expect(parseNumber(monthlyInterestText)).toBeCloseTo(3600, 3);

    await expect(page.locator('[data-si="ending-amount"]').first()).not.toHaveText('N/A');
  });
});
