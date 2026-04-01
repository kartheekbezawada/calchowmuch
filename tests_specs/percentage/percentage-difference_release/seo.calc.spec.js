import { expect, test } from '@playwright/test';

test.describe('Percentage Difference Calculator SEO', () => {
  test('PDIFF-TEST-SEO-1: metadata, schema, sitemap, and explanation parity', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-difference-calculator/');

    await expect(page).toHaveTitle('Percentage Difference Calculator | Compare Two Values Fairly');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Compare two values with the symmetric percentage difference formula that uses their average as the baseline when neither number is the original.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Percentage Difference Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/percentage-calculators/percentage-difference-calculator/');

    await expect(page.locator('#pct-diff-explanation .pv-results-table')).toHaveCount(1);
    await expect(page.locator('#pct-diff-explanation .bor-faq-card')).toHaveCount(10);
    await expect(page.locator('#pct-diff-explanation .faq-box')).toHaveCount(0);
    await expect(page.locator('#pct-diff-explanation')).not.toContainText('Scenario Summary');

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
    expect(sitemapText).toContain('/percentage-calculators/percentage-difference-calculator/');
  });
});
