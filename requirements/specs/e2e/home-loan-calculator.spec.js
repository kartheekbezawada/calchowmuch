import { test, expect } from '@playwright/test';

test.describe('Home Loan calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/loans/home-loan/');
    await page.waitForSelector('#mtg-calculate');
  });

  test('HOME-LOAN-TEST-E2E-1: calculates and populates explanation outputs', async ({ page }) => {
    await page.fill('#mtg-price', '400000');
    await page.locator('[data-button-group="mtg-down-type"] button[data-value="percent"]').click();
    const downLabel = page.locator('#mtg-down-value-label');
    await expect(downLabel).toHaveText('Down Payment Percent');
    await page.fill('#mtg-down-value', '20');
    await page.fill('#mtg-term', '30');
    await page.fill('#mtg-rate', '6.5');
    const advancedSummary = page.locator('.advanced-options summary');
    await advancedSummary.click();
    await page.fill('#mtg-extra', '200');

    await page.click('#mtg-calculate');

    const result = page.locator('#mtg-result');
    await expect(result).toContainText('Monthly Payment');

    const priceValue = page.locator('[data-mtg="price"]');
    await expect(priceValue).not.toHaveText('');

    const tableRows = page.locator('#mtg-table-monthly-body tr');
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('HOME-LOAN-TEST-E2E-2: view toggle switches table visibility', async ({ page }) => {
    await page.click('#mtg-calculate');

    const yearlyButton = page.locator('#mtg-view-yearly');
    const monthlyButton = page.locator('#mtg-view-monthly');
    const yearlyWrap = page.locator('#mtg-table-yearly-wrap');
    const monthlyWrap = page.locator('#mtg-table-monthly-wrap');

    await expect(yearlyWrap).toHaveClass(/is-hidden/);
    await expect(monthlyWrap).not.toHaveClass(/is-hidden/);

    await yearlyButton.click();
    await expect(yearlyWrap).not.toHaveClass(/is-hidden/);
    await expect(monthlyWrap).toHaveClass(/is-hidden/);

    await monthlyButton.click();
    await expect(monthlyWrap).not.toHaveClass(/is-hidden/);
  });

  test('HOME-LOAN-TEST-FAQ-E2E-1: FAQ section renders with styling', async ({ page }) => {
    const faqHeading = page.locator('#loan-mtg-explanation h3', {
      hasText: 'Frequently Asked Questions',
    });
    await expect(faqHeading).toBeVisible();

    const faqItems = page.locator('#loan-mtg-explanation .faq-item');
    await expect(faqItems).toHaveCount(10);

    const firstFaq = faqItems.first();
    await expect(firstFaq.locator('h4')).toBeVisible();
    await expect(firstFaq.locator('p')).toBeVisible();

    await expect(firstFaq).toHaveCSS('display', 'grid');
    await expect(firstFaq).toHaveCSS('gap', '6px');
    await expect(firstFaq).toHaveCSS('padding-top', '12px');
    await expect(firstFaq).toHaveCSS('border-top-style', 'solid');
    await expect(firstFaq).toHaveCSS('border-top-width', '1px');

    const hasHorizontalScroll = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth > root.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });
});
