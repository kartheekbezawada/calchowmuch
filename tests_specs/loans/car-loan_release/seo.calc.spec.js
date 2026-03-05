import { expect, test } from '@playwright/test';

test.describe('Car Loan Calculator SEO', () => {
  test('CAR-LOAN-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/car-loan-calculators/car-loan-calculator');

    await expect(page).toHaveTitle('Car Loan Calculator – Monthly Payment & Interest | CalcHowMuch');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate car loan monthly payments, interest cost, and payoff schedule. Adjust loan amount, APR, and term to see total loan cost.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Car Loan Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/car-loan-calculators/car-loan-calculator/');

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

    expect(webpageSchema?.name).toBe('Car Loan Calculator – Monthly Payment & Interest | CalcHowMuch');
    expect(softwareSchema?.name).toBe('Car Loan Calculator');
    expect(breadcrumbSchema?.itemListElement).toHaveLength(3);
    expect(faqSchema?.mainEntity).toHaveLength(4);
    expect(faqSchema?.mainEntity?.[0]?.name).toBe('How is amount financed calculated?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/car-loan-calculators/car-loan-calculator/');
  });
});
