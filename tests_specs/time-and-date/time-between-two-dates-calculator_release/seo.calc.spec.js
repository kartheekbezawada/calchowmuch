import { expect, test } from '@playwright/test';

test.describe('Time Between Two Dates Calculator SEO', () => {
  test('DATE-DIFF-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/time-and-date/time-between-two-dates-calculator/');

    await expect(page).toHaveTitle('Time Between Two Dates Calculator | Days, Weeks, Months & Hours');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Find the exact time between two dates in days, weeks, months, business days, and hours with date-only or date-time mode, inclusive counting, and copy-ready summaries.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Time Between Two Dates Calculator');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);

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
    await expect(explanation.locator('h2')).toHaveCount(1);
    await expect(explanation).toContainText('How much time is between two dates?');
    await expect(explanation).toContainText('How to Guide');
    await expect(explanation).toContainText('FAQ');
    await expect(explanation).toContainText('Important Notes');
    await expect(explanation.locator('.td-faq-item')).toHaveCount(6);
    await expect(explanation).toContainText('All calculations run locally in your browser - no data is stored.');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/time-between-two-dates-calculator/');
  });
});
