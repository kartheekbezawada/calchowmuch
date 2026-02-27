import { expect, test } from '@playwright/test';

test.describe('Credit Card Minimum Payment Calculator SEO', () => {
  test('MINPAY-TEST-SEO-1: metadata, schema, FAQ parity, and sitemap', async ({ page }) => {
    await page.goto('/credit-card-calculators/credit-card-minimum-payment-calculator');

    await expect(page).toHaveTitle('Credit Card Minimum Payment Calculator -- True Cost of Minimums');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'See how long it takes to pay off your credit card with minimum payments only. Calculate total interest, payoff months, and yearly payment breakdown.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Credit Card Minimum Payment');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(await canonical.getAttribute('href')).toBe(
      'https://calchowmuch.com/credit-card-calculators/credit-card-minimum-payment-calculator/'
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

    const visibleQuestions = await page.locator('#cc-min-explanation .cc-min-faq-item strong').allTextContents();
    const normalizedVisibleQuestions = visibleQuestions.map((text) => text.replace(/^Q:\s*/, '').trim());
    const schemaQuestions = faqNode.mainEntity.map((entry) => entry.name.trim());
    expect(schemaQuestions).toEqual(normalizedVisibleQuestions);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/credit-card-calculators/credit-card-minimum-payment-calculator/');

    const humanSitemapResponse = await page.request.get('/sitemap.xml');
    expect(humanSitemapResponse.ok()).toBeTruthy();
    const humanSitemapText = await humanSitemapResponse.text();
    expect(humanSitemapText).toContain('/credit-card-calculators/credit-card-minimum-payment-calculator');
  });
});
