import { expect, test } from '@playwright/test';

test.describe('Percent to Fraction/Decimal Converter SEO', () => {
  test('PTFD-TEST-SEO-1: metadata, schema, sitemap', async ({ page }) => {
    await page.goto('/percentage-calculators/percent-to-fraction-decimal-calculator/');

    await expect(page).toHaveTitle('Percent to Fraction and Decimal Calculator | Convert %');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Convert a percentage into a decimal and simplified fraction using the standard divide-by-100 method.'
    );

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(await canonical.getAttribute('href')).toBe(
      'https://calchowmuch.com/percentage-calculators/percent-to-fraction-decimal-calculator/'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Percent to Fraction & Decimal Converter');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    const structuredData = JSON.parse(structuredText || '{}');
    const types = structuredData['@graph'].map((node) => node['@type']);
    expect(types).toEqual(expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList']));

    const faqNode = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faqNode.mainEntity).toHaveLength(10);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(await sitemapResponse.text()).toContain('/percentage-calculators/percent-to-fraction-decimal-calculator/');
  });
});
