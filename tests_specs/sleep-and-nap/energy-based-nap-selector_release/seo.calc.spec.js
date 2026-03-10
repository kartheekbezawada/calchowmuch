import { expect, test } from '@playwright/test';

test.describe('Energy-Based Nap Selector SEO', () => {
  test('ENAP-TEST-SEO-1: metadata, schema, and sitemap coverage', async ({ page }) => {
    await page.goto('/time-and-date/energy-based-nap-selector');

    await expect(page).toHaveTitle('Energy-Based Nap Selector - Quick, Strong, or Full Nap Timing');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Pick Quick, Strong, or Full and get deterministic nap recommendations with wake-up times, alternatives, and late-night guidance.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Energy-Based Nap Selector');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/time-and-date/energy-based-nap-selector/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    const structuredData = JSON.parse(structuredText || '{}');

    const graph = Array.isArray(structuredData['@graph']) ? structuredData['@graph'] : [];
    const nodeTypes = graph.map((node) => node['@type']);
    expect(nodeTypes).toContain('WebPage');
    expect(nodeTypes).toContain('FAQPage');

    const faqNode = graph.find((node) => node['@type'] === 'FAQPage');
    expect(Array.isArray(faqNode?.mainEntity)).toBeTruthy();
    expect(faqNode.mainEntity).toHaveLength(10);
    expect(faqNode.mainEntity[0].name).toBe('What does the Energy-Based Nap Selector do?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/energy-based-nap-selector/');

    const humanSitemap = await page.request.get('/sitemap.xml');
    expect(humanSitemap.ok()).toBeTruthy();
    const humanSitemapText = await humanSitemap.text();
    expect(humanSitemapText).toContain('/time-and-date/energy-based-nap-selector');
  });
});
