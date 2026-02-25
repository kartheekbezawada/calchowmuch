import { expect, test } from '@playwright/test';

test.describe('Investment Return Calculator SEO', () => {
  test('IR-SEO-1 metadata, structured data, and sitemap', async ({ page }) => {
    await page.goto('/finance-calculators/investment-return-calculator/');

    await expect(page).toHaveTitle(/Investment Return Calculator/i);

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toContain('investment return');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute(
      'href',
      'https://calchowmuch.com/finance-calculators/investment-return-calculator/'
    );

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index,follow');

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Investment Return Calculator');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredJson = JSON.parse((await structuredDataScript.textContent()) || '{}');

    const graph = Array.isArray(structuredJson['@graph']) ? structuredJson['@graph'] : [];
    const schemaTypes = graph.map((node) => node?.['@type']);

    expect(schemaTypes).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList'])
    );

    const faqNode = graph.find((node) => node?.['@type'] === 'FAQPage');
    expect(Array.isArray(faqNode?.mainEntity)).toBe(true);
    expect(faqNode.mainEntity).toHaveLength(10);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/finance-calculators/investment-return-calculator/');
  });
});
