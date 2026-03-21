import { expect, test } from '@playwright/test';

function parseNumber(text) {
  return Number(String(text ?? '').replace(/[^0-9.-]+/g, ''));
}

test.describe('Monthly Savings Needed Calculator', () => {
  test('MSN-TEST-E2E-1: route renders in finance shell and calculates monthly target', async ({
    page,
  }) => {
    await page.goto('/finance-calculators/monthly-savings-needed-calculator/');

    await expect(page.locator('h1')).toHaveText('Monthly Savings Needed Calculator');
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);

    const baselineValue = parseNumber(await page.locator('#msn-result').textContent());

    await page.fill('#msn-goal', '30000');
    await page.fill('#msn-current', '4000');
    await page.fill('#msn-years', '4');
    await page.fill('#msn-months', '6');
    await page.fill('#msn-rate', '4');
    await expect(page.locator('#msn-stale-note')).toBeVisible();
    expect(parseNumber(await page.locator('#msn-result').textContent())).toBeCloseTo(
      baselineValue,
      2
    );

    await page.click('#msn-calc');
    await expect(page.locator('#msn-stale-note')).toBeHidden();

    const resultValue = parseNumber(await page.locator('#msn-result').textContent());
    expect(resultValue).toBeGreaterThan(0);

    await expect(page.locator('[data-msn="snap-monthly"]')).not.toHaveText('');
    await expect(page.locator('[data-msn="snap-balance"]')).not.toHaveText('');
  });
});
