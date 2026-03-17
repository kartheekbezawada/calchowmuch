import { expect, test } from '@playwright/test';

test.describe('Age Calculator SEO', () => {
  test('AGE-TEST-SEO-1: metadata, headings, FAQ schema, and sitemap', async ({ page }) => {
    await page.goto('/time-and-date/age-calculator/');

    await expect(page).toHaveTitle('Age Calculator | Exact Age, Total Days & Next Birthday');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Find exact age in years, months, and days from a birth date or any as-of date. See total days, total weeks, and your next birthday countdown.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Age Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute(
      'href',
      'https://calchowmuch.com/time-and-date/age-calculator/'
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

    const appNode = graph.find((node) => node['@type'] === 'SoftwareApplication');
    expect(appNode.applicationCategory).toBe('UtilityApplication');

    const faqNode = graph.find((node) => node['@type'] === 'FAQPage');
    expect(Array.isArray(faqNode?.mainEntity)).toBeTruthy();
    expect(faqNode.mainEntity).toHaveLength(10);
    expect(faqNode.mainEntity[0].name).toBe(
      'How do I calculate exact age in years, months, and days?'
    );

    const explanation = page.locator('#age-explanation');
    await expect(explanation).toContainText('Find exact age without the clutter');
    await expect(explanation).toContainText('Questions people ask before trusting the answer');
    await expect(explanation.locator('.age-faq-item')).toHaveCount(10);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/age-calculator/');
  });
});
