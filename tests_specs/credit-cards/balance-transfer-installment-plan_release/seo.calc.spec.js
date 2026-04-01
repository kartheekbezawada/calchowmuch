import { expect, test } from '@playwright/test';

test.describe('Balance Transfer Credit Card Calculator SEO', () => {
  test('BALANCE-TRANSFER-SEO-1: metadata, social tags, schema, and sitemap', async ({ page }) => {
    const route = '/credit-card-calculators/balance-transfer-credit-card-calculator/';
    const expectedTitle = 'Balance Transfer Calculator | Promo APR, Fee & Savings';
    const expectedDescription =
      'Compare transfer fees, promo APR, revert APR, payoff timing, and total cost to see whether a balance transfer saves money.';

    await page.goto(route);
    await expect(page).toHaveTitle(expectedTitle);

    const charset = await page.locator('meta[charset]').getAttribute('charset');
    expect((charset || '').toLowerCase()).toBe('utf-8');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(expectedDescription);
    expect(description).not.toBe(expectedTitle);
    expect(expectedTitle).not.toContain('...');
    expect(expectedDescription).not.toContain('...');

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Balance Transfer Credit Card Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(await canonical.getAttribute('href')).toBe(
      'https://calchowmuch.com/credit-card-calculators/balance-transfer-credit-card-calculator/'
    );

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', expectedTitle);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      expectedDescription
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://calchowmuch.com/credit-card-calculators/balance-transfer-credit-card-calculator/'
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', expectedTitle);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
      'content',
      expectedDescription
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    );

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredDataText = await structuredDataScript.textContent();
    const structuredData = JSON.parse(structuredDataText || '{}');

    const graph = Array.isArray(structuredData['@graph']) ? structuredData['@graph'] : [];
    const types = graph.map((node) => node['@type']);
    expect(types).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList'])
    );

    const softwareNode = graph.find((node) => node['@type'] === 'SoftwareApplication');
    expect(softwareNode?.name).toBe('Balance Transfer Credit Card Calculator');

    const breadcrumbNode = graph.find((node) => node['@type'] === 'BreadcrumbList');
    expect(Array.isArray(breadcrumbNode?.itemListElement)).toBeTruthy();
    expect(breadcrumbNode.itemListElement).toHaveLength(3);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain(route);
  });
});
