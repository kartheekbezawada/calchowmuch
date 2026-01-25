import { test, expect } from '@playwright/test';

test.describe('Sitemap page SEO baseline', () => {
  test('SITEMAP-SEO-1: title/meta/h1/canonical present', async ({ page, baseURL }) => {
    const response = await page.goto('/sitemap/', { waitUntil: 'domcontentloaded' });
    expect(response && response.ok(), 'Sitemap page must load').toBeTruthy();

    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.toLowerCase()).toContain('sitemap');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description, 'Meta description must exist').toBeTruthy();

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Sitemap');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref, 'Canonical href must exist').toBeTruthy();

    if (canonicalHref) {
      const canonicalUrl = new URL(canonicalHref, baseURL);
      expect(canonicalUrl.pathname).toBe('/sitemap/');
    }

    const headingCount = await page.locator('h2').count();
    const linkCount = await page.locator('#sitemap-content a').count();
    expect(headingCount).toBeGreaterThan(0);
    expect(linkCount).toBeGreaterThan(0);
  });
});
