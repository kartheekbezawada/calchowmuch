import { expect, test } from '@playwright/test';

test.describe('Inflation Calculator SEO', () => {
  test('INF-TEST-SEO-1: metadata, structured data, sitemap', async ({ page }) => {
    await page.goto('/finance-calculators/inflation-calculator/');

    await expect(page).toHaveTitle(
      'Inflation Calculator | CPI Purchasing Power'
    );

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Compare what money from one U.S. CPI month is worth in another and see equivalent value, cumulative inflation, and annualized inflation.'
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
      'Inflation Calculator | CPI Purchasing Power'
    );
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      'Compare what money from one U.S. CPI month is worth in another and see equivalent value, cumulative inflation, and annualized inflation.'
    );

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredData = JSON.parse((await structuredDataScript.textContent()) || '{}');
    const types = structuredData['@graph'].map((node) => node['@type']);

    expect(types).toEqual(
      expect.arrayContaining([
        'WebSite',
        'Organization',
        'WebPage',
        'SoftwareApplication',
        'FAQPage',
        'BreadcrumbList',
      ])
    );

    const webPageNode = structuredData['@graph'].find((node) => node['@type'] === 'WebPage');
    expect(webPageNode.name).toBe('Inflation Calculator');
    expect(webPageNode.about).toEqual({
      '@id': 'https://calchowmuch.com/finance-calculators/inflation-calculator/#softwareapplication',
    });
    expect(webPageNode.mainEntity).toEqual({
      '@id': 'https://calchowmuch.com/finance-calculators/inflation-calculator/#softwareapplication',
    });
    expect(webPageNode.breadcrumb).toEqual({
      '@id': 'https://calchowmuch.com/finance-calculators/inflation-calculator/#breadcrumbs',
    });

    const breadcrumbNode = structuredData['@graph'].find(
      (node) => node['@type'] === 'BreadcrumbList'
    );
    expect(breadcrumbNode.itemListElement).toHaveLength(3);
    expect(breadcrumbNode.itemListElement[1]).toEqual({
      '@type': 'ListItem',
      position: 2,
      name: 'Finance Calculators',
      item: 'https://calchowmuch.com/finance-calculators/',
    });

    const faqNode = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faqNode.mainEntity).toHaveLength(10);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(await sitemapResponse.text()).toContain('/finance-calculators/inflation-calculator/');
  });
});
