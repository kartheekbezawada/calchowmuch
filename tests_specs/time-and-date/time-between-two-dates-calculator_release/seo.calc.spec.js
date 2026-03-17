import { expect, test } from '@playwright/test';

test.describe('Time Between Two Dates Calculator SEO', () => {
  test('DATE-DIFF-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/time-and-date/time-between-two-dates-calculator/');

    await expect(page).toHaveTitle('Time Between Two Dates Calculator | Days, Months & Business Days');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Find days, weeks, months, business days, and exact hours between two dates. Use date-only or date-time mode, inclusive counting, and copy-ready summaries.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Time Between Two Dates Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute(
      'href',
      'https://calchowmuch.com/time-and-date/time-between-two-dates-calculator/'
    );

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredData = JSON.parse((await structuredDataScript.textContent()) || '{}');
    const graph = Array.isArray(structuredData['@graph']) ? structuredData['@graph'] : [];
    const nodeTypes = graph.map((node) => node['@type']);

    expect(nodeTypes).toContain('WebPage');
    expect(nodeTypes).toContain('SoftwareApplication');
    expect(nodeTypes).toContain('BreadcrumbList');
    expect(nodeTypes).toContain('FAQPage');

    const faqNode = graph.find((node) => node['@type'] === 'FAQPage');
    expect(Array.isArray(faqNode?.mainEntity)).toBeTruthy();
    expect(faqNode.mainEntity).toHaveLength(6);
    expect(faqNode.mainEntity[0].name).toBe('How do I calculate the days between two dates?');

    const explanation = page.locator('#date-diff-explanation');
    await expect(explanation.locator('h2')).toHaveCount(6);
    await expect(explanation).toContainText('Find the days between dates without the clutter');
    await expect(explanation).toContainText('Questions people ask before trusting the answer');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/time-between-two-dates-calculator/');
  });
});
