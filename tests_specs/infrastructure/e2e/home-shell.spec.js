import { test, expect } from '@playwright/test';

test.describe('Home page shell-only content', () => {
  test('HOME-ISS-001: shell integrity and non-interactive content', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.site-header')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(1);
    await expect(page.locator('.left-nav')).toHaveCount(1);
    await expect(page.locator('.center-column')).toHaveCount(1);
    await expect(page.locator('.site-footer')).toHaveCount(1);

    const inputCount = await page.locator('.layout-main input, .layout-main select, .layout-main textarea').count();
    const tableCount = await page.locator('table').count();
    expect(inputCount).toBe(0);
    expect(tableCount).toBe(0);

    await expect(page.locator('.header-search-input')).toHaveCount(1);

    const calculatorPane = page.locator('.center-column .panel').first();
    const explanationPane = page.locator('.center-column .panel').nth(1);
    await expect(calculatorPane.locator('button')).toHaveCount(0);

    const explanationText = await explanationPane.innerText();
    expect(explanationText.trim().length).toBeGreaterThan(0);

    const leftNavItems = page.locator('.left-nav .nav-item');
    expect(await leftNavItems.count()).toBeGreaterThan(0);
    await expect(leftNavItems.first()).toBeVisible();
    await expect(page.locator('.top-nav .is-active')).toHaveCount(0);

    const topNavLabels = page.locator('.top-nav .top-nav-link .nav-label');
    await expect(topNavLabels).toHaveText([
      'Math',
      'Home Loan',
      'Credit Cards',
      'Auto Loans',
      'Finance',
      'Time & Date',
      'Percentage',
    ]);

    const financeTopLink = page
      .locator('.top-nav .top-nav-link')
      .filter({ has: page.locator('.nav-label', { hasText: 'Finance' }) })
      .first();
    const percentageTopLink = page
      .locator('.top-nav .top-nav-link')
      .filter({ has: page.locator('.nav-label', { hasText: 'Percentage' }) })
      .first();
    await expect(financeTopLink.locator('.nav-icon:not(.nav-icon-right)')).toHaveText('$');
    await expect(financeTopLink.locator('.nav-icon-right')).toHaveText('£');
    await expect(percentageTopLink.locator('.nav-icon:not(.nav-icon-right)')).toHaveText('%');

    const footerLinks = page.locator('.site-footer a');
    await expect(footerLinks).toHaveCount(5);
    await expect(footerLinks.nth(4)).toHaveText('Sitemap');
  });
});
