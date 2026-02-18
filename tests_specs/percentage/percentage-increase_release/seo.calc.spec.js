import { expect, test } from '@playwright/test';

test.describe('Percentage Increase Calculator SEO', () => {
  test('PINC-TEST-SEO-1: metadata, schema, sitemap, and explanation parity', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-increase/');

    await expect(page).toHaveTitle('Percentage Increase Calculator – CalcHowMuch');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate percentage increase from an original value to a new value instantly. Use our free percent increase calculator and formula.'
    );

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(await canonical.getAttribute('href')).toBe(
      'https://calchowmuch.com/percentage-calculators/percentage-increase/'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Percentage Increase Calculator');

    await expect(page.locator('#pct-inc-explanation .pv-results-table')).toHaveCount(1);
    await expect(page.locator('#pct-inc-explanation .bor-faq-card')).toHaveCount(10);
    await expect(page.locator('#pct-inc-explanation .faq-box')).toHaveCount(0);
    await expect(page.locator('#pct-inc-explanation')).not.toContainText('Scenario Summary');

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
    expect(await sitemapResponse.text()).toContain('/percentage-calculators/percentage-increase/');
  });
});
