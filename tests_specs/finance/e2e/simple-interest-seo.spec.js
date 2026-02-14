import { expect, test } from '@playwright/test';

test.describe('Simple Interest Calculator SEO', () => {
  test('SI-TEST-SEO-1: metadata, structured data, sitemap', async ({ page }) => {
    await page.goto('/finance/simple-interest');

    await expect(page).toHaveTitle('Simple Interest Calculator – CalcHowMuch');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate simple interest to find total interest and ending amount using principal, rate, and time. Compare simple vs compound interest quickly.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Simple Interest Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/finance/simple-interest/');

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBe('Simple Interest Calculator – CalcHowMuch');

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
    expect(sitemapText).toContain('/finance/simple-interest/');
  });
});
