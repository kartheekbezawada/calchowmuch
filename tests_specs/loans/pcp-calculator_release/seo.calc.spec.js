import { expect, test } from '@playwright/test';

test.describe('PCP Calculator SEO', () => {
  test('PCP-SEO-1: metadata, heading, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/car-loan-calculators/pcp-calculator');

    await expect(page).toHaveTitle('PCP Car Finance Calculator – Monthly Payment & GFV | CalcHowMuch');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate PCP car finance payments including deposit, monthly payments, final balloon payment (GFV), and total interest.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('PCP Car Finance Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/car-loan-calculators/pcp-calculator/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');
    const graph = Array.isArray(structuredData['@graph']) ? structuredData['@graph'] : [];
    const webpageSchema = graph.find((entry) => entry?.['@type'] === 'WebPage');
    const softwareSchema = graph.find((entry) => entry?.['@type'] === 'SoftwareApplication');
    const breadcrumbSchema = graph.find((entry) => entry?.['@type'] === 'BreadcrumbList');
    const faqSchema = graph.find((entry) => entry?.['@type'] === 'FAQPage');

    expect(webpageSchema?.name).toBe('PCP Car Finance Calculator – Monthly Payment & GFV | CalcHowMuch');
    expect(softwareSchema?.name).toBe('PCP Car Finance Calculator');
    expect(breadcrumbSchema?.itemListElement).toHaveLength(3);
    expect(faqSchema?.mainEntity).toHaveLength(10);
    expect(faqSchema?.mainEntity?.[0]?.name).toBe(
      'How does a PCP calculator estimate monthly payment?'
    );

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/car-loan-calculators/pcp-calculator/');
  });
});
