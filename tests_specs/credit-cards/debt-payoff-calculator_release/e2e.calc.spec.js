import { expect, test } from '@playwright/test';

test.describe('Debt Payoff Calculator', () => {
  test('DEBT-PAYOFF-E2E-1: loads with answer-first results, payoff order, charts, and table', async ({
    page,
  }) => {
    await page.goto('/credit-card-calculators/debt-payoff-calculator/');

    await expect(page.locator('.center-column > .panel')).toHaveCount(1);
    await expect(page.locator('.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.dp-related-row')).toHaveCount(0);
    await expect(page.locator('#debt-payoff-kicker')).toHaveText('At your current plan');
    await expect(page.locator('#debt-payoff-headline')).toContainText('You could be debt-free by');
    await expect(page.locator('#debt-payoff-kpis .dp-kpi-card')).toHaveCount(3);
    await expect(page.locator('#debt-payoff-deltas .dp-delta-card')).toHaveCount(2);
    await expect(page.locator('#debt-payoff-order li')).toHaveCount(3);
    await expect(page.locator('#debt-payoff-next-steps a')).toHaveCount(4);
    await expect(page.locator('#debt-payoff-line-chart polyline')).toHaveCount(1);
    await expect(page.locator('#debt-payoff-table-body tr')).not.toHaveCount(0);
  });

  test('DEBT-PAYOFF-E2E-2: goal-date mode and dynamic debt row actions work', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/credit-card-calculators/debt-payoff-calculator/');

    await page.locator('[data-mode="goal-date"]').click();
    await expect(page.locator('[data-field-mode="standard"]')).toBeHidden();
    await expect(page.locator('[data-field-mode="goal-date"]')).toBeVisible();
    await page.locator('#debt-payoff-target-date').fill('2028-12-01');
    await page.locator('#debt-payoff-add-row').click();
    const lastRow = page.locator('.dp-debt-row').last();
    await lastRow.locator('[data-field="name"]').fill('Utility plan');
    await lastRow.locator('[data-field="balance"]').fill('900');
    await lastRow.locator('[data-field="minimumPayment"]').fill('45');
    await lastRow.locator('[data-field="apr"]').fill('7.5');
    await lastRow.locator('[data-field="type"]').fill('Installment');
    await page.locator('#debt-payoff-calculate').click();

    await expect(page.locator('#debt-payoff-goal-banner')).toBeVisible();
    await expect(page.locator('#debt-payoff-headline')).toContainText('To be debt-free by');
    await expect(page.locator('#debt-payoff-goal-copy')).toContainText('need about');

    await page.locator('#debt-payoff-copy-summary').click();
    await expect(page.locator('#debt-payoff-copy-feedback')).toContainText('Summary copied');
  });

  test('DEBT-PAYOFF-E2E-3: alternate chart and yearly table view render without overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/credit-card-calculators/debt-payoff-calculator/');

    await page.locator('[data-series="alternate"]').click();
    await expect(page.locator('#debt-payoff-line-caption')).toContainText('zero balance');

    await page.locator('[data-table-view="yearly"]').click();
    await expect(page.locator('#debt-payoff-table-head')).toContainText('Year');
    await expect(page.locator('#debt-payoff-table-context')).toContainText('yearly roll-up');

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth - overflow.clientWidth).toBeLessThanOrEqual(1);
  });
});
