import { expect, test } from '@playwright/test';

test.describe('Time Between Two Dates Calculator SEO', () => {
  test('DATE-DIFF-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/time-and-date/time-between-two-dates-calculator');

    await expect(page).toHaveTitle('Time Between Two Dates Calculator | Date Difference');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate the difference between two dates or date-times in days, weeks, months, hours, and minutes.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Time Between Two Dates Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/time-and-date/time-between-two-dates-calculator/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    const graph = Array.isArray(structuredData['@graph']) ? structuredData['@graph'] : [];
    const nodeTypes = graph.map((node) => node['@type']);
    expect(nodeTypes).toContain('WebPage');
    expect(nodeTypes).toContain('SoftwareApplication');
    expect(nodeTypes).toContain('BreadcrumbList');
    expect(nodeTypes).toContain('FAQPage');

    const faqNode = graph.find((node) => node['@type'] === 'FAQPage');
    expect(Array.isArray(faqNode?.mainEntity)).toBeTruthy();
    expect(faqNode.mainEntity).toHaveLength(4);
    expect(faqNode.mainEntity[0].name).toBe('Why do months and days give different answers?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/time-between-two-dates-calculator/');
  });
});
