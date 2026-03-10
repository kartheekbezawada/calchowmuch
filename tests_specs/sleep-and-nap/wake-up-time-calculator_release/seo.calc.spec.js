import { expect, test } from '@playwright/test';

test.describe('Wake-Up Time Calculator SEO', () => {
  test('WAKEUP-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/time-and-date/wake-up-time-calculator');

    await expect(page).toHaveTitle('Wake-Up Time Calculator | Calculate How Much Online Calculator');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Wake-Up Time Calculator calculator with fast inputs and clear results. Calculate How Much provides explanations, examples, and assumptions to help you plan confidently.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Wake-Up Time Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/time-and-date/wake-up-time-calculator/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    const graph = Array.isArray(structuredData['@graph']) ? structuredData['@graph'] : [];
    const nodeTypes = graph.map((node) => node['@type']);
    expect(nodeTypes).toContain('SoftwareApplication');
    expect(nodeTypes).toContain('BreadcrumbList');
    expect(nodeTypes).not.toContain('FAQPage');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/wake-up-time-calculator/');
  });
});
