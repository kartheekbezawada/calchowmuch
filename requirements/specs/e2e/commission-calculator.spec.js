import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Commission Calculator', () => {
  test('COMM-TEST-E2E-1: flat and tiered commission workflows', async ({ page }) => {
    await page.goto('/percentage-calculators/commission-calculator');

    await expect(page.locator('.top-nav-link.is-active .nav-label')).toHaveText('Percentage Calculators');
    await expect(page.locator('.nav-item.is-active')).toHaveText('Commission Calculator');

    await page.fill('#comm-sales', '20000');
    await page.fill('#comm-rate', '7.5');
    await page.click('#comm-calc');

    const flatResult = await page.locator('#comm-result').textContent();
    expect(parseNumber(flatResult)).toBeCloseTo(1500, 2);

    await page.click('[data-button-group="comm-mode"] button[data-value="tiered"]');
    const tierSection = page.locator('#comm-tiered-section');
    await expect(tierSection).not.toBeHidden();

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
  });
});
