import { expect, test } from '@playwright/test';

test.describe('Investment Return Calculator SEO', () => {
  test('IR-SEO-1 metadata, structured data, and sitemap', async ({ page }) => {
    await page.goto('/finance-calculators/investment-return-calculator/');

    await expect(page).toHaveTitle('Investment Return Calculator | CAGR, Profit & Growth');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Estimate investment return, portfolio growth, profit, and CAGR using lump sums, contributions, inflation, and tax settings.'
    );

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

    await expect(page.locator('#ir-explanation-content > h2')).toHaveText(
      'How Is Your Portfolio Performing Over Time?'
    );
    await expect(
      page.locator('#ir-explanation-content .mtg-exp-section h3', { hasText: 'How to Guide' })
    ).toHaveCount(1);
    await expect(
      page.locator('#ir-explanation-content .mtg-exp-section h3', { hasText: 'Important Notes' })
    ).toHaveCount(1);
    await expect(
      page.locator('#ir-explanation-content .mtg-exp-section--faq .bor-faq-card')
    ).toHaveCount(10);

    const guideWordCount = await page.evaluate(() => {
      const section = Array.from(
        document.querySelectorAll('#ir-explanation-content section.mtg-exp-section')
      ).find(
        (node) =>
          node.querySelector('h3')?.textContent?.replace(/\s+/g, ' ').trim() === 'How to Guide'
      );

      if (!section) {
        return -1;
      }

      const text = section.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      return text ? text.split(' ').filter(Boolean).length : 0;
    });
    expect(guideWordCount).toBeGreaterThanOrEqual(800);
    expect(guideWordCount).toBeLessThanOrEqual(1200);

    const contentOrder = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('#ir-explanation-content > section'));
      const faqIndex = sections.findIndex((node) =>
        node.classList.contains('mtg-exp-section--faq')
      );
      const notesIndex = sections.findIndex(
        (node) =>
          node.querySelector('h3')?.textContent?.replace(/\s+/g, ' ').trim() === 'Important Notes'
      );
      return { faqIndex, notesIndex };
    });
    expect(contentOrder.faqIndex).toBeGreaterThanOrEqual(0);
    expect(contentOrder.notesIndex).toBeGreaterThanOrEqual(0);
    expect(contentOrder.notesIndex).toBeGreaterThan(contentOrder.faqIndex);

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
