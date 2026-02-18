import { expect, test } from '@playwright/test';

test.describe('Credit Card Consolidation Calculator SEO', () => {
  test('CONSOLIDATION-TEST-SEO-1: metadata, schema, FAQ parity, and sitemap', async ({ page }) => {
    await page.goto('/credit-card-calculators/credit-card-consolidation-calculator');

    await expect(page).toHaveTitle('Credit Card Consolidation Calculator -- Compare & Save');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Compare paying credit cards separately vs consolidating into a fixed-rate loan. See monthly payment, interest savings, and total cost difference.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Credit Card Consolidation Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(await canonical.getAttribute('href')).toBe(
      'https://calchowmuch.com/credit-card-calculators/credit-card-consolidation-calculator/'
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

    const faqNode = graph.find((node) => node['@type'] === 'FAQPage');
    expect(Array.isArray(faqNode?.mainEntity)).toBeTruthy();
    expect(faqNode.mainEntity).toHaveLength(10);

    const visibleQuestions = await page.locator('#cc-con-explanation .bor-faq-card h4').allTextContents();
    const normalizedVisibleQuestions = visibleQuestions.map((text) => text.trim());
    const schemaQuestions = faqNode.mainEntity.map((entry) => entry.name.trim());
    expect(schemaQuestions).toEqual(normalizedVisibleQuestions);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/credit-card-calculators/credit-card-consolidation-calculator/');

    const humanSitemapResponse = await page.request.get('/sitemap/');
    expect(humanSitemapResponse.ok()).toBeTruthy();
    const humanSitemapText = await humanSitemapResponse.text();
    expect(humanSitemapText).toContain('/credit-card-calculators/credit-card-consolidation-calculator');
  });
});
