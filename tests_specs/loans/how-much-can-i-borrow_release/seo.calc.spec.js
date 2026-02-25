import { expect, test } from '@playwright/test';

test.describe('How Much Can I Borrow Calculator SEO', () => {
  test('BOR-TEST-SEO-1: metadata, schema, FAQ parity, sitemap', async ({ page }) => {
    await page.goto('/loan-calculators/how-much-can-i-borrow/');

    await expect(page).toHaveTitle('How Much Can I Borrow | Mortgage Affordability | CalcHowMuch');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Estimate your maximum mortgage borrowing using income multiples or payment-to-income checks, then compare monthly payments and total property budget.'
    );

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(await canonical.getAttribute('href')).toBe(
      'https://calchowmuch.com/loan-calculators/how-much-can-i-borrow/'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('How Much Can I Borrow Calculator');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    const graph = Array.isArray(structuredData['@graph']) ? structuredData['@graph'] : [];
    const types = graph.map((node) => node['@type']);
    expect(types).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList'])
    );

    const faqNode = graph.find((node) => node['@type'] === 'FAQPage');
    const schemaQuestions = Array.isArray(faqNode?.mainEntity)
      ? faqNode.mainEntity.map((entry) => String(entry?.name || '').trim()).filter(Boolean)
      : [];
    expect(schemaQuestions).toHaveLength(10);
    expect(schemaQuestions[0]).toBe('Is this a guaranteed amount I can borrow?');

    const visibleQuestions = await page
      .locator('#loan-borrow-explanation .bor-faq-card h4')
      .allTextContents();
    const normalizedVisible = visibleQuestions.map((entry) => entry.trim()).filter(Boolean);
    expect(normalizedVisible).toHaveLength(10);
    expect(new Set(schemaQuestions)).toEqual(new Set(normalizedVisible));

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/loan-calculators/how-much-can-i-borrow/');
  });
});
