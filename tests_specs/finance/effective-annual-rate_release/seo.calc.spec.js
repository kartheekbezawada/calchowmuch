import { expect, test } from '@playwright/test';

test.describe('Effective Annual Rate Calculator SEO', () => {
  test('EAR-TEST-SEO-1: metadata, structured data, sitemap', async ({ page }) => {
    await page.goto('/finance-calculators/effective-annual-rate-calculator');

    await expect(page).toHaveTitle('Effective Annual Rate (EAR) Calculator – CalcHowMuch');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate the effective annual rate (EAR) from a nominal interest rate and compounding frequency. Compare true annual interest rates accurately.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Effective Annual Rate Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/finance-calculators/effective-annual-rate-calculator/');

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBe('Effective Annual Rate (EAR) Calculator – CalcHowMuch');

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
    expect(sitemapText).toContain('/finance-calculators/effective-annual-rate-calculator/');
  });
});
