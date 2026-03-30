import { expect, test } from '@playwright/test';

test.describe('Present Value Calculator SEO', () => {
  test('PV-TEST-SEO-1: metadata, structured data, sitemap', async ({ page }) => {
    await page.goto('/finance-calculators/present-value-calculator');

    await expect(page).toHaveTitle('Present Value Calculator | Future Cash Flow Discounting');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Discount future cash flow into today's value using rate, time period, and compounding to compare offers, projects, or investments.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Present Value Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/finance-calculators/present-value-calculator/');

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBe('Present Value Calculator | Future Cash Flow Discounting');

    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDescription).toBe(
      'Discount future cash flow into today's value using rate, time period, and compounding to compare offers, projects, or investments.'
    );

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBe('https://calchowmuch.com/assets/images/og-default.png');

    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBe('summary_large_image');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    expect(structuredData['@graph']).toBeTruthy();
    const types = structuredData['@graph'].map((node) => node['@type']);
    expect(types).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList'])
    );

    const faqNode = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faqNode.mainEntity).toHaveLength(10);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/finance-calculators/present-value-calculator/');
  });
});
