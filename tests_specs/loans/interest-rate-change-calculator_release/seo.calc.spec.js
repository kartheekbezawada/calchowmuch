import { expect, test } from '@playwright/test';

test.describe('Interest Rate Change Calculator SEO', () => {
  test('RATE-CHANGE-SEO-1: metadata, schema, FAQ parity, sitemap, and section order', async ({
    page,
  }) => {
    await page.goto('/loan-calculators/interest-rate-change-calculator/', {
      waitUntil: 'domcontentloaded',
    });
    await expect(page.locator('#calculator-title')).toHaveText('Interest Rate Change Calculator');

    await expect(page).toHaveTitle('Interest Rate Change Calculator | Rate Impact | CalcHowMuch');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Compare current and new mortgage rates to estimate monthly payment differences, total interest impact, and scenario timing over your remaining term.'
    );

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(await canonical.getAttribute('href')).toBe(
      'https://calchowmuch.com/loan-calculators/interest-rate-change-calculator/'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Interest Rate Change Calculator');

    await expect(page.locator('#rate-section-lifetime')).toHaveCount(1);
    await expect(page.locator('#rate-section-amortization')).toHaveCount(1);
    await expect(page.locator('#rate-section-how-to-guide')).toHaveCount(1);
    await expect(page.locator('#rate-section-faq')).toHaveCount(1);
    await expect(page.locator('#rate-section-notes')).toHaveCount(1);
    await expect(page.locator('#rate-section-notes')).toContainText('Last updated:');

    const sectionOrder = await page.evaluate(() => {
      const ids = [
        'rate-section-lifetime',
        'rate-section-amortization',
        'rate-section-how-to-guide',
        'rate-section-faq',
        'rate-section-notes',
      ];
      const tops = ids.map((id) => {
        const node = document.getElementById(id);
        return node ? node.getBoundingClientRect().top + window.scrollY : -1;
      });
      return (
        tops.every((value) => value >= 0) &&
        tops.every((value, index) => index === 0 || value > tops[index - 1])
      );
    });
    expect(sectionOrder).toBe(true);

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
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

    const visibleQuestions = await page
      .locator('#loan-rate-change-explanation #rate-section-faq .bor-faq-card h4')
      .allTextContents();
    const normalizedVisibleQuestions = visibleQuestions.map((entry) => entry.trim()).filter(Boolean);
    expect(normalizedVisibleQuestions).toHaveLength(10);
    expect(new Set(schemaQuestions)).toEqual(new Set(normalizedVisibleQuestions));

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(await sitemapResponse.text()).toContain('/loan-calculators/interest-rate-change-calculator/');
  });
});
