import { expect, test } from '@playwright/test';

test.describe('Personal Loan calculator SEO', () => {
  test('PL-SEO-1: metadata, schema parity, order, sitemap', async ({ page }) => {
    await page.goto('/loan-calculators/personal-loan-calculator/');
    await expect(page.locator('.hl-cluster-panel')).toBeVisible();

    await expect(page).toHaveTitle(
      'Personal Loan Calculator | Monthly Payment, Interest & Payoff'
    );

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Estimate personal loan monthly payment, total interest, total cost, and extra-payment savings from amount, APR, fees, and term.'
    );

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(await canonical.getAttribute('href')).toBe(
      'https://calchowmuch.com/loan-calculators/personal-loan-calculator/'
    );
    await expect(page.locator('link[href*="theme-premium-dark.css"]')).toHaveCount(0);

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Personal Loan Calculator');

    await expect(page.locator('#loan-personal-explanation h2')).toHaveText(
      'Personal Loan Complete Practical Guide'
    );

    const order = await page.evaluate(() => {
      const pos = (id) => {
        const node = document.getElementById(id);
        return node ? node.getBoundingClientRect().top + window.scrollY : -1;
      };

      const chart = pos('pl-section-chart');
      const table = pos('pl-section-table');
      const howTo = pos('pl-section-how-to-guide');
      const faq = pos('pl-section-faq');
      const notes = pos('pl-section-important-notes');

      return {
        chart,
        table,
        howTo,
        faq,
        notes,
        valid:
          chart >= 0 &&
          table >= 0 &&
          howTo >= 0 &&
          faq >= 0 &&
          notes >= 0 &&
          chart < table &&
          table < howTo &&
          howTo < faq &&
          faq < notes,
      };
    });

    expect(order.valid).toBe(true);

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
      ? faqNode.mainEntity.map((entry) => String(entry?.name || '').trim().replace(/\?$/, ''))
      : [];

    const visibleQuestions = await page
      .locator('#loan-personal-explanation .bor-faq-card h4')
      .allTextContents();
    const normalizedVisible = visibleQuestions.map((entry) => entry.trim().replace(/\?$/, ''));

    expect(schemaQuestions).toHaveLength(10);
    expect(normalizedVisible).toHaveLength(10);
    expect(new Set(schemaQuestions)).toEqual(new Set(normalizedVisible));

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/loan-calculators/personal-loan-calculator/');
  });
});
