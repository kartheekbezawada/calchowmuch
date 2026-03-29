import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Investment Calculator', () => {
  test('INV-TEST-E2E-1: planning flow, advanced options, visuals, and comparison table', async ({
    page,
  }) => {
    await page.goto('/finance-calculators/investment-calculator/');

    await expect(page.locator('h1')).toHaveText('Investment Calculator');
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://calchowmuch.com/finance-calculators/investment-calculator/'
    );

    await expect(page.locator('#inv-advanced-section')).toHaveClass(/is-hidden/);
    const baseline = parseNumber(await page.locator('#inv-result').textContent());
    expect(baseline).toBeGreaterThan(0);

    await page.fill('#inv-years', '10');
    await page.fill('#inv-recurring', '0');
    await expect(page.locator('#inv-stale-note')).toBeVisible();
    expect(parseNumber(await page.locator('#inv-result').textContent())).toBeCloseTo(baseline, 0);

    await page.click('#inv-advanced-toggle');
    await expect(page.locator('#inv-advanced-toggle')).toHaveAttribute('aria-expanded', 'true');
    await page.click('[data-button-group="inv-comparison-mode"] button[data-value="lump-sum-only"]');
    await page.click('#inv-calc');
    await expect(page.locator('#inv-stale-note')).toBeHidden();

    const resultValue = parseNumber(await page.locator('#inv-result').textContent());
    expect(resultValue).toBeGreaterThan(15000);
    await expect(page.locator('#inv-mode-badge')).toHaveText('Lump sum only');
    await expect(page.locator('#inv-line-chart')).toBeVisible();
    await expect(page.locator('#inv-donut')).toBeVisible();
    await expect(page.locator('#inv-table-body tr')).toHaveCount(11);

    const beforeContributionCase = parseNumber(await page.locator('#inv-result').textContent());
    await page.fill('#inv-recurring', '300');
    await page.click('[data-button-group="inv-comparison-mode"] button[data-value="include-recurring-contributions"]');
    await expect(page.locator('#inv-stale-note')).toBeVisible();
    await page.click('#inv-calc');
    const afterContributionCase = parseNumber(await page.locator('#inv-result').textContent());
    expect(afterContributionCase).toBeGreaterThan(beforeContributionCase);
    await expect(page.locator('#inv-mode-badge')).toHaveText('Include contributions');
  });
});
