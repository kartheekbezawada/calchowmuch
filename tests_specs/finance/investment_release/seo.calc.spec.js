import { expect, test } from '@playwright/test';

test.describe('Investment Calculator SEO', () => {
  test('INV-TEST-SEO-1: metadata, structured data, and sitemap coverage', async ({ page }) => {
    await page.goto('/finance-calculators/investment-calculator/');

    await expect(page).toHaveTitle('Investment Calculator | Growth, Contributions & Returns');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Estimate ending value, total contributions, simple vs compound growth, and inflation-adjusted purchasing power with one broad investment calculator.'
    );

    await expect(page.locator('h1')).toHaveText('Investment Calculator');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://calchowmuch.com/finance-calculators/investment-calculator/'
    );

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBe('Investment Calculator | Growth, Contributions & Returns');

    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    expect(ogUrl).toBe('https://calchowmuch.com/finance-calculators/investment-calculator/');

    const structuredText = await page.locator('script[data-calculator-ld]').textContent();
    const structuredData = JSON.parse(structuredText || '{}');
    const types = structuredData['@graph'].map((node) => node['@type']);
    expect(types).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList'])
    );

    const faqNode = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faqNode.mainEntity).toHaveLength(10);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/finance-calculators/investment-calculator/');
  });
});
