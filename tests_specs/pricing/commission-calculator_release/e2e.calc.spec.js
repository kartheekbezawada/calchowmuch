import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Commission Calculator', () => {
  test('COMM-TEST-E2E-1: flat and tiered commission workflows', async ({ page }) => {
    await page.goto('/pricing-calculators/commission-calculator');

    await expect(page.locator('.pct-cluster-site-label')).toHaveText('Pricing Calculators');
    await expect(page.locator('.pct-cluster-page-shell')).toHaveCount(1);
    await expect(
      page
        .locator('.fin-nav-item.is-active, .math-nav-item.is-active, .nav-item.is-active')
        .first()
    ).toContainText('Sales Commission Calculator');
    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('[data-comm-mode-label="flat"].is-active')).toContainText(
      'Flat Rate'
    );
    await expect(page.locator('#comm-calc')).toBeVisible();

    await page.fill('#comm-sales', '20000');
    await page.fill('#comm-rate', '7.5');
    await page.click('#comm-calc');

    const flatResult = await page.locator('#comm-result').textContent();
    expect(parseNumber(flatResult)).toBeCloseTo(1500, 2);
    await expect(page.locator('#comm-tier-summary .comm-tier-summary-item')).toHaveCount(0);
    await expect(page.locator('#comm-tier-summary')).toContainText('Flat rate 7.50% applies to the full sale amount.');
    await expect(page.locator('#comm-chart-placeholder')).toBeVisible();
    await expect(page.locator('#comm-chart-donut')).toBeHidden();
    await expect(page.locator('.comm-chart-card')).toBeVisible();
    await expect(page.locator('#comm-chart-legend .comm-chart-legend-item')).toHaveCount(1);

    await page.click('label.mode-switch-toggle[for="comm-tiered-toggle"] .mode-switch-track');
    const tierSection = page.locator('#comm-tiered-section');
    await expect(tierSection).not.toBeHidden();
    await expect(page.locator('[data-comm-mode-label="tiered"].is-active')).toContainText(
      'Tiered Plan'
    );
    await expect(page.locator('#comm-calc')).toBeVisible();

    await page.click('#comm-add-tier');
    const rows = page.locator('.commission-tier-row');
    await expect(rows).toHaveCount(4);

    await page.fill('.commission-tier-row:nth-child(1) .comm-tier-up-to', '10000');
    await page.fill('.commission-tier-row:nth-child(1) .comm-tier-rate', '5');
    await page.fill('.commission-tier-row:nth-child(2) .comm-tier-up-to', '25000');
    await page.fill('.commission-tier-row:nth-child(2) .comm-tier-rate', '7');
    await page.fill('.commission-tier-row:nth-child(3) .comm-tier-up-to', '');
    await page.fill('.commission-tier-row:nth-child(3) .comm-tier-rate', '10');
    await rows.nth(3).locator('.comm-remove-tier').click();

    await page.fill('#comm-sales', '40000');
    await page.click('#comm-calc');

    const tieredResult = await page.locator('#comm-result').textContent();
    expect(parseNumber(tieredResult)).toBeCloseTo(3050, 2);

    await expect(page.locator('#comm-breakdown-body tr')).toHaveCount(3);
    await expect(page.locator('#comm-tier-summary .comm-tier-summary-item')).toHaveCount(3);
    await expect(page.locator('#comm-tier-summary')).toContainText('$0.00 to $10,000.00');
    await expect(page.locator('#comm-tier-summary')).toContainText('Above $25,000.00');
    await expect(page.locator('#comm-tier-summary')).toContainText('$1,500.00');
    await expect(page.locator('#comm-tier-summary')).toContainText('49.18% share');
    await expect(page.locator('#comm-chart-placeholder')).toBeHidden();
    await expect(page.locator('#comm-chart-donut')).toBeVisible();
    await expect(page.locator('#comm-chart-subtitle')).toContainText('3 tiers contributing');
    await expect(page.locator('#comm-chart-center-value')).toContainText('49.18%');
    await expect(page.locator('#comm-chart-legend .comm-chart-legend-item')).toHaveCount(3);
    await expect(page.locator('#comm-chart-legend')).toContainText('$1,500.00');
  });
});
