import { expect, test } from '@playwright/test';

test.describe('Remortgage / Switching Calculator SEO', () => {
  test('REMO-SEO-1: metadata, schema, FAQ parity, sitemap, and section order', async ({ page }) => {
    await page.goto('/loan-calculators/remortgage-calculator/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#calculator-title')).toHaveText('Remortgage Calculator (Switching)');

    await expect(page).toHaveTitle('Remortgage Calculator | Break-Even, Payment & Savings');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Compare your current mortgage with a new rate or term to estimate payment change, break-even timing, and total savings.'
    );

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(await canonical.getAttribute('href')).toBe(
      'https://calchowmuch.com/loan-calculators/remortgage-calculator/'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Remortgage Calculator (Switching)');

    await expect(page.locator('#remo-section-table')).toHaveCount(1);
    await expect(page.locator('#remo-section-guide')).toHaveCount(1);
    await expect(page.locator('#remo-section-related')).toHaveCount(1);
    await expect(page.locator('#remo-section-faq')).toHaveCount(1);
    await expect(page.locator('#remo-section-important-notes')).toHaveCount(1);
    await expect(page.locator('#remo-section-important-notes')).toContainText('Last updated:');

    const sectionOrder = await page.evaluate(() => {
      const ids = [
        'remo-section-table',
        'remo-section-guide',
        'remo-section-related',
        'remo-section-faq',
        'remo-section-important-notes',
      ];
      const tops = ids.map((id) => {
        const node = document.getElementById(id);
        return node ? node.getBoundingClientRect().top + window.scrollY : -1;
      });
      return tops.every((value) => value >= 0) && tops.every((value, index) => index === 0 || value > tops[index - 1]);
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
      .locator('#loan-remortgage-explanation #remo-section-faq .remo-faq-card h4')
      .allTextContents();
    const normalizedVisibleQuestions = visibleQuestions.map((entry) => entry.trim()).filter(Boolean);
    expect(normalizedVisibleQuestions).toHaveLength(10);
    expect(new Set(schemaQuestions)).toEqual(new Set(normalizedVisibleQuestions));

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(await sitemapResponse.text()).toContain('/loan-calculators/remortgage-calculator/');
  });
});
