import { test, expect } from '@playwright/test';

test.describe('Sitemap footer link', () => {
  test('SITEMAP-TEST-E2E-1: footer link navigates to sitemap page', async ({ page }) => {
    await page.goto('/');

    const footerLinks = page.locator('.site-footer a');
    await expect(footerLinks).toHaveCount(5);
    await expect(footerLinks.nth(0)).toHaveText('Privacy');
    await expect(footerLinks.nth(1)).toHaveText('Terms & Conditions');
    await expect(footerLinks.nth(2)).toHaveText('Contact');
    await expect(footerLinks.nth(3)).toHaveText('FAQs');
    await expect(footerLinks.nth(4)).toHaveText('Sitemap');

    await footerLinks.nth(4).click();
    await expect(page).toHaveURL(/\/sitemap\/?$/);
    await expect(page.locator('h1')).toHaveText('Sitemap');
    const headingCount = await page.locator('h2').count();
    const linkCount = await page.locator('#sitemap-content a').count();
    expect(headingCount).toBeGreaterThan(0);
    expect(linkCount).toBeGreaterThan(0);
  });
});
