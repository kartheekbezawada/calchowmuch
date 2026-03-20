import { expect, test } from '@playwright/test';

function normalize(text) {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

test.describe('Investment Return Calculator', () => {
  test('IR-E2E-1 core flow, advanced mode, table/graph toggles, and button-only behavior', async ({ page }) => {
    await page.goto('/finance-calculators/investment-return-calculator/');

    await expect(page.locator('h1')).toHaveText('Investment Return Calculator');
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);

    const result = page.locator('#ir-result');
    await expect(result).toBeVisible();
    const baselineResult = normalize(await result.textContent());

    await page.fill('#ir-return', '9');
    await page.waitForTimeout(120);
    const afterInputResult = normalize(await result.textContent());
    expect(afterInputResult).toBe(baselineResult);

    await page.click('#ir-calc');
    await expect
      .poll(async () => normalize(await result.textContent()), {
        timeout: 2000,
      })
      .not.toBe(baselineResult);

    await page.fill('#ir-return', '10');
    await expect(page.locator('#ir-return')).toHaveValue('10');

    await page.click('#ir-advanced-toggle');
    await expect(page.locator('#ir-advanced-section')).not.toHaveClass(/is-hidden/);

    await page.fill('#ir-var-rate-1', '4');
    await page.click('#ir-add-event');

    const lastEvent = page.locator('.ir-event-row').last();
    await lastEvent.locator('[data-ir-event-year]').fill('3');
    await lastEvent.locator('[data-ir-event-amount]').fill('-500');
    await lastEvent.locator('button[data-value="start"]').click();

    await page.click('[data-button-group="ir-crash-enabled"] button[data-value="on"]');
    await page.fill('#ir-crash-year', '2');
    await page.fill('#ir-crash-drop', '15');
    await page.click('#ir-calc');

    await expect(page.locator('#ir-breakdown-body tr')).toHaveCount(20);

    await page.click('[data-button-group="ir-breakdown-mode"] button[data-value="monthly"]');
    await expect(page.locator('#ir-breakdown-head')).toContainText('Month');

    await expect(page.locator('#ir-breakdown-body tr').first()).toBeVisible();
  });
});
