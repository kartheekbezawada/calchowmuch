import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Margin Calculator', () => {
  test('MARG-TEST-E2E-1: mode toggle and calculations', async ({ page }) => {
    await page.goto('/pricing-calculators/margin-calculator');

    await expect(page.locator('.pct-cluster-site-label')).toHaveText('Pricing Calculators');
    await expect(page.locator('.pct-cluster-page-shell')).toHaveCount(1);
    await expect(
      page
        .locator('.fin-nav-item.is-active, .math-nav-item.is-active, .nav-item.is-active')
        .filter({ hasText: 'Margin Calculator' })
        .first()
    ).toContainText('Margin Calculator');

    await page.fill('#margin-cost', '60');
    await page.fill('#margin-price', '100');
    await page.click('#margin-calc');

    const modeAResult = await page.locator('#margin-result').textContent();
    expect(parseNumber(modeAResult)).toBeCloseTo(40, 2);

    await page.click(
      'label.mode-switch-toggle[for="margin-cost-margin-toggle"] .mode-switch-track'
    );
    await expect(page.locator('#margin-mode-cost-margin')).not.toBeHidden();

    await page.fill('#margin-cost', '60');
    await page.fill('#margin-percent', '40');
    await page.click('#margin-calc');

    const detail = await page.locator('#margin-result-detail').textContent();
    expect(detail).toContain('Selling Price: $100.00');
    expect(detail).toContain('Profit: $40.00');
  });
});
