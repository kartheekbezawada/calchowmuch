import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Percentage Difference Calculator', () => {
  test('PDIFF-TEST-E2E-1: calculates symmetric percentage difference and renders new explanation UX', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-difference-calculator/');

    await expect(page.locator('.top-nav-link.is-active .nav-label').first()).toHaveText(
      'Percentage Calculators'
    );
    await expect(
      page
        .locator('.fin-nav-item.is-active, .math-nav-item.is-active, .nav-item.is-active')
        .filter({ hasText: 'Percentage Difference' })
        .first()
    ).toContainText('Percentage Difference');

    await expect(page.locator('#pct-diff-explanation .pv-results-table')).toHaveCount(1);
    await expect(page.locator('#pct-diff-explanation .bor-faq-card')).toHaveCount(10);
    await expect(page.locator('#pct-diff-explanation')).not.toContainText('Scenario Summary');

    await page.fill('#pct-diff-a', '80');
    await page.fill('#pct-diff-b', '100');
    await page.click('#pct-diff-calc', { force: true });

    const resultText = await page.locator('#pct-diff-result').textContent();
    expect(parseNumber(resultText)).toBeCloseTo(22.22, 2);

    await page.fill('#pct-diff-a', '100');
    await page.fill('#pct-diff-b', '80');
    await page.click('#pct-diff-calc', { force: true });

    const swappedText = await page.locator('#pct-diff-result').textContent();
    expect(parseNumber(swappedText)).toBeCloseTo(22.22, 2);
  });

  test('PDIFF-TEST-E2E-2: handles divide-by-zero baseline', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-difference-calculator/');

    await page.fill('#pct-diff-a', '0');
    await page.fill('#pct-diff-b', '0');
    await page.click('#pct-diff-calc', { force: true });

    await expect(page.locator('#pct-diff-result')).toContainText('undefined');
  });
});
