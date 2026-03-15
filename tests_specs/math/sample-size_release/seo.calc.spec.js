import { expect, test } from '@playwright/test';

test.describe('Sample Size Calculator SEO', () => {
  test('SAMPLE-SIZE-SEO-1: metadata, single-pane layout, FAQ schema, and explanation contract', async ({
    page,
  }) => {
    await page.goto('/math/sample-size/');

    await expect(page).toHaveTitle('Sample Size Calculator | Proportion and Mean Study Planner');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Plan sample size for proportions or means with optional finite-population correction, worked examples, and research-ready guidance.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Sample Size Calculator');

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute('href', 'https://calchowmuch.com/math/sample-size/');

    await expect(page.locator('#sample-size-explanation h2')).toHaveText(
      'Sample Size Planning Practical Guide'
    );
    await expect(page.locator('#sample-size-explanation')).toContainText('How to Guide');
    await expect(page.locator('#sample-size-explanation')).toContainText('FAQ');
    await expect(page.locator('#sample-size-explanation')).toContainText('Important Notes');
    await expect(page.locator('#sample-size-explanation')).toContainText('Last updated: March 2026.');
    await expect(page.locator('#sample-size-explanation .ss-example-card')).toHaveCount(6);
    await expect(page.locator('#sample-size-explanation .ss-faq-card')).toHaveCount(10);

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
    expect(faqNode.mainEntity[0].name).toBe('When should I use the proportion mode?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/math/sample-size/');
  });
});
