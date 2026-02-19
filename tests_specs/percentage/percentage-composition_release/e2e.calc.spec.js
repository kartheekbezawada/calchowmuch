import { expect, test } from '@playwright/test';

test.describe('Percentage Composition Calculator', () => {
  test('PCOMP-TEST-E2E-1: single-pane structure, calculated mode, known mode, and no legacy blocks', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-composition-calculator/');

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('#composition-explanation .pv-results-table')).toHaveCount(1);
    await expect(page.locator('#composition-explanation .bor-faq-card')).toHaveCount(10);
    await expect(page.locator('#composition-explanation .faq-box')).toHaveCount(0);
    await expect(page.locator('#composition-explanation')).not.toContainText('Scenario Summary');

    await page.click('#composition-calc', { force: true });
    await expect(page.locator('#composition-result')).toContainText('Item A: 300.00 (30.00%)');
    await expect(page.locator('#composition-result')).toContainText('Item B: 200.00 (20.00%)');
    await expect(page.locator('#composition-result')).toContainText('Item C: 500.00 (50.00%)');

    await page.click('.composition-toggle-track', { force: true });
    await page.fill('#composition-known-total', '1000');
    await page.fill('.composition-item-row:nth-of-type(1) .composition-row-value', '200');
    await page.fill('.composition-item-row:nth-of-type(2) .composition-row-value', '300');
    await page.fill('.composition-item-row:nth-of-type(3) .composition-row-value', '0');
    await page.click('#composition-calc', { force: true });

    await expect(page.locator('#composition-result')).toContainText('Remainder (Other): 500.00 (50.00%)');
  });

  test('PCOMP-TEST-E2E-2: add/remove rows and zero-total guard', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-composition-calculator/');

    await page.click('#composition-add-row');
    await page.fill('.composition-item-row:last-of-type .composition-row-value', '100');
    await page.click('#composition-calc', { force: true });
    await expect(page.locator('#composition-result')).toContainText('Item 4: 100.00');

    await page.click('.composition-item-row:last-of-type .composition-remove-row');
    await page.fill('.composition-item-row:nth-of-type(1) .composition-row-value', '0');
    await page.fill('.composition-item-row:nth-of-type(2) .composition-row-value', '0');
    await page.fill('.composition-item-row:nth-of-type(3) .composition-row-value', '0');
    await page.click('#composition-calc', { force: true });

    await expect(page.locator('#composition-result')).toContainText('undefined');
  });
});
