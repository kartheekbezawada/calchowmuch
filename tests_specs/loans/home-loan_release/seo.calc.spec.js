import { expect, test } from '@playwright/test';

test.describe('Home Loan calculator SEO', () => {
  test('HOME-LOAN-TEST-SEO-1: metadata, schema parity, sitemap, and intent block order', async ({ page }) => {
    await page.goto('/loan-calculators/mortgage-calculator/');

    await expect(page).toHaveTitle('Home Loan Calculator | Mortgage Payment Planner | CalcHowMuch');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Estimate monthly mortgage payments, amortization, payoff timeline, and interest savings from extra payments with our free Home Loan Calculator.'
    );

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(await canonical.getAttribute('href')).toBe(
      'https://calchowmuch.com/loan-calculators/mortgage-calculator/'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Home Loan Calculator');

    await expect(page.locator('#mtg-section-practical-guide')).toHaveCount(1);
    await expect(page.locator('#mtg-section-how-to-guide')).toHaveCount(1);
    await expect(page.locator('#mtg-section-trust')).toHaveCount(1);
    await expect(page.locator('#mtg-section-faq')).toHaveCount(1);
    await expect(page.locator('#mtg-section-trust')).toContainText('Last updated:');

    const sectionOrder = await page.evaluate(() => {
      const getTop = (id) => {
        const node = document.getElementById(id);
        return node ? node.getBoundingClientRect().top + window.scrollY : -1;
      };

      const practicalGuide = getTop('mtg-section-practical-guide');
      const howTo = getTop('mtg-section-how-to-guide');
      const importantNotes = getTop('mtg-section-trust');
      const faq = getTop('mtg-section-faq');

      return {
        practicalGuide,
        howTo,
        importantNotes,
        faq,
        valid:
          practicalGuide >= 0 &&
          howTo >= 0 &&
          importantNotes >= 0 &&
          faq >= 0 &&
          practicalGuide < howTo &&
          howTo < importantNotes &&
          importantNotes < faq,
      };
    });
    expect(sectionOrder.valid).toBe(true);

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
      ? faqNode.mainEntity
          .map((entry) => String(entry?.name || '').trim().replace(/\?$/, ''))
          .filter(Boolean)
      : [];

    const visibleQuestions = await page
      .locator('#loan-mtg-explanation #mtg-section-faq .bor-faq-card h4')
      .allTextContents();
    const normalizedVisibleQuestions = visibleQuestions
      .map((entry) => entry.trim().replace(/\?$/, ''))
      .filter(Boolean);

    expect(schemaQuestions).toHaveLength(10);
    expect(normalizedVisibleQuestions).toHaveLength(10);
    expect(new Set(schemaQuestions)).toEqual(new Set(normalizedVisibleQuestions));

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(await sitemapResponse.text()).toContain('/loan-calculators/mortgage-calculator/');
  });
});
