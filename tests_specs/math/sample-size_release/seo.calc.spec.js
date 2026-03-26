import { expect, test } from '@playwright/test';

test.describe('Sample Size Calculator SEO', () => {
  test('SAMPLE-SIZE-SEO-1: metadata, schema, and explanation contract are present', async ({
    page,
  }) => {
    await page.goto('/math/sample-size/');

    await expect(page).toHaveTitle(
      'Sample Size Calculator — Proportion & Mean Study Planner | CalcHowMuch'
    );

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Plan your study sample size for proportions or means with confidence intervals, finite-population correction, worked examples, formulas, and research-ready guidance.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Sample Size Calculator');

    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('link[href*="theme-premium-dark.css"]')).toHaveCount(0);
    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute('href', 'https://calchowmuch.com/math/sample-size/');

    const explanation = page.locator('#sample-size-explanation');
    await expect(explanation.locator('h2')).toHaveText('Sample Size Calculator Complete Practical Guide');

    const headingTexts = await explanation.locator('h2, h3').allTextContents();
    expect(headingTexts).toEqual([
      'Sample Size Calculator Complete Practical Guide',
      'How to Guide',
      'All Formulas Used on This Page',
      'What Does the Sample Size Calculator Tell Me?',
      'Worked Examples',
      'Scenario Analysis',
      'Visual Reference',
      'FAQ',
      'Related Calculators',
      'Important Notes',
    ]);

    await expect(explanation).toContainText('Last updated: March 2026.');
    await expect(explanation.locator('.ss-example-card')).toHaveCount(6);
    await expect(explanation.locator('.ss-faq-card')).toHaveCount(10);
    await expect(explanation.locator('.ss-visual-card')).toHaveCount(3);
    await expect(explanation.locator('.ss-related-card')).toHaveCount(3);

    const structuredDataScript = page.locator('script[data-calculator-ld]').first();
    await expect(structuredDataScript).toHaveCount(1);
    const structuredData = JSON.parse((await structuredDataScript.textContent()) || '{}');
    const graph = Array.isArray(structuredData['@graph']) ? structuredData['@graph'] : [];
    const types = graph.map((node) => node['@type']);

    expect(types).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'BreadcrumbList', 'FAQPage'])
    );

    const faqNode = graph.find((node) => node['@type'] === 'FAQPage');
    expect(faqNode.mainEntity).toHaveLength(10);
    expect(faqNode.mainEntity[0].name).toBe('When should I use the proportion study mode?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/math/sample-size/');
  });
});
