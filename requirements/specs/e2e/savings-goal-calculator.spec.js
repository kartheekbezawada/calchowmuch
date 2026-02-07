import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text || '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Savings Goal Calculator', () => {
  test('SG-TEST-E2E-1: mode switching and calculation output', async ({ page }) => {
    await page.goto('/finance/savings-goal');

    await expect(page.locator('.top-nav-link.is-active .nav-label')).toHaveText('Finance');
    await expect(page.locator('.nav-item.is-active')).toHaveText('Savings Goal');

    await page.fill('#sg-goal', '10000');
    await page.fill('#sg-current', '1000');
    await page.fill('#sg-monthly', '500');
    await page.click('#sg-optional-toggle');
    await page.fill('#sg-rate', '0');
    await page.click('#sg-calc');

    const timeResult = await page.locator('#sg-result').textContent();
    expect(timeResult).toContain('18 months');

    await page.click('[data-button-group="sg-mode"] button[data-value="monthly-needed"]');
    await page.fill('#sg-goal', '20000');
    await page.fill('#sg-current', '2000');
    await page.fill('#sg-target-time', '36');
    await page.fill('#sg-rate', '0');
    await page.click('#sg-calc');

    const monthlyResultText = await page.locator('#sg-result').textContent();
    const monthlyAmount = parseNumber(monthlyResultText);
    expect(monthlyAmount).toBeCloseTo(500, 1);

    await expect(page.locator('[data-sg="primary"]').first()).not.toHaveText('N/A');
  });
});
