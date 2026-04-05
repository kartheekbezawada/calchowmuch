import { expect, test } from '@playwright/test';

test.describe('Percentage Composition Calculator SEO', () => {
  test('PCOMP-TEST-SEO-1: metadata, schema, sitemap, and migrated explanation parity', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-composition-calculator/');

    await expect(page).toHaveTitle('Percentage Composition Calculator | Percent Share of a Total');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      "Calculate each item's percentage share of a total, compare components, and see any remainder percentage from a known or calculated total."
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Percentage Composition Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/percentage-calculators/percentage-composition-calculator/');

    await expect(page.locator('#composition-explanation .pv-results-table')).toHaveCount(0);
    await expect(page.locator('#composition-explanation .bor-faq-card')).toHaveCount(6);
    await expect(page.locator('#composition-explanation .faq-box')).toHaveCount(0);
    await expect(page.locator('#composition-explanation')).not.toContainText('Scenario Summary');
    await expect(page.locator('#composition-explanation')).toContainText('Frequently Asked Questions');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    const structuredData = JSON.parse(structuredText || '{}');

    const types = structuredData['@graph'].map((node) => node['@type']);
    expect(types).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList'])
    );

    const faqNode = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faqNode.mainEntity).toHaveLength(10);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/percentage-calculators/percentage-composition-calculator/');
  });
});
