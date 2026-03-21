import { expect, test } from '@playwright/test';

test.describe('Inflation Calculator SEO', () => {
  test('INF-TEST-SEO-1: metadata, structured data, sitemap', async ({ page }) => {
    await page.goto('/finance-calculators/inflation-calculator/');

    await expect(page).toHaveTitle(
      'Inflation Calculator – CPI-Based Value & Purchasing Power Over Time | CalcHowMuch'
    );

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate how money values change with U.S. CPI data, compare past and present amounts, track cumulative inflation, and spot purchasing power instantly.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Inflation Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute(
      'href',
      'https://calchowmuch.com/finance-calculators/inflation-calculator/'
    );

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Inflation Calculator – CPI-Based Value & Purchasing Power Over Time | CalcHowMuch'
    );
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      'Calculate how money values change with U.S. CPI data, compare past and present amounts, track cumulative inflation, and spot purchasing power instantly.'
    );

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredData = JSON.parse((await structuredDataScript.textContent()) || '{}');
    const types = structuredData['@graph'].map((node) => node['@type']);

    expect(types).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList'])
    );

    const faqNode = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faqNode.mainEntity).toHaveLength(10);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(await sitemapResponse.text()).toContain('/finance-calculators/inflation-calculator/');
  });
});
