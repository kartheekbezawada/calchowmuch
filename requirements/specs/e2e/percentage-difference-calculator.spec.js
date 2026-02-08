import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Percentage Difference Calculator', () => {
  test('PDIFF-TEST-E2E-1: calculates symmetric percentage difference', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-difference');

    await expect(page.locator('.top-nav-link.is-active .nav-label').first()).toHaveText(
      'Percentage'
    );
    await expect(
      page
        .locator('.math-nav-item.is-active, .nav-item.is-active')
        .filter({ hasText: 'Percentage Difference' })
        .first()
    ).toHaveText('Percentage Difference');

    await page.fill('#pct-diff-a', '80');
    await page.fill('#pct-diff-b', '100');
    await page.click('#pct-diff-calc');

    const resultText = await page.locator('#pct-diff-result').textContent();
    expect(parseNumber(resultText)).toBeCloseTo(22.22, 2);

    await page.fill('#pct-diff-a', '100');
    await page.fill('#pct-diff-b', '80');
    await page.click('#pct-diff-calc');

    const swappedText = await page.locator('#pct-diff-result').textContent();
    expect(parseNumber(swappedText)).toBeCloseTo(22.22, 2);
  });

  test('PDIFF-TEST-E2E-2: handles divide-by-zero baseline', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-difference');

    await page.fill('#pct-diff-a', '0');
    await page.fill('#pct-diff-b', '0');
    await page.click('#pct-diff-calc');

    await expect(page.locator('#pct-diff-result')).toContainText('undefined');
  });
});
