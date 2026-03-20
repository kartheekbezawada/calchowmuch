import { expect, test } from '@playwright/test';

function normalize(text) {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

test.describe('Time to Savings Goal Calculator', () => {
  test('TSG-TEST-E2E-1: route renders in finance shell and calculates timeline', async ({
    page,
  }) => {
    await page.goto('/finance-calculators/time-to-savings-goal-calculator/');

    await expect(page.locator('h1')).toHaveText('Time to Savings Goal Calculator');
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);

    const baselineText = normalize(await page.locator('#tsg-result').textContent());

    await page.fill('#tsg-goal', '30000');
    await page.fill('#tsg-current', '4000');
    await page.fill('#tsg-contribution', '550');
    await page.fill('#tsg-rate', '4');
    await expect(page.locator('#tsg-stale-note')).toBeVisible();
    expect(normalize(await page.locator('#tsg-result').textContent())).toBe(baselineText);

    await page.click('#tsg-calc');
    await expect(page.locator('#tsg-stale-note')).toBeHidden();

    const resultText = normalize(await page.locator('#tsg-result').textContent());
    expect(resultText.length).toBeGreaterThan(0);
    expect(resultText).toContain('Year');

    await expect(page.locator('[data-tsg="snap-goal"]')).not.toHaveText('');
    await expect(page.locator('[data-tsg="snap-interest"]')).not.toHaveText('');
  });
});
