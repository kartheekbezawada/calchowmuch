import { expect, test } from '@playwright/test';

test.describe('Find Percentage of a Number Calculator SEO', () => {
  test('PON-TEST-SEO-1: metadata, schema, sitemap', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-of-a-number-calculator/');

    await expect(page).toHaveTitle('Percentage of a Number Calculator | Calculate X% of Y');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate what X% of Y equals with the standard percent-to-decimal formula for discounts, tax, tips, commission, and quick percentage checks.'
    );

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(await canonical.getAttribute('href')).toBe(
      'https://calchowmuch.com/percentage-calculators/percentage-of-a-number-calculator/'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Find Percentage of a Number Calculator');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    const structuredData = JSON.parse(structuredText || '{}');
    const types = structuredData['@graph'].map((node) => node['@type']);
    expect(types).toEqual(expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList']));

    const faqNode = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faqNode.mainEntity).toHaveLength(10);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(await sitemapResponse.text()).toContain('/percentage-calculators/percentage-of-a-number-calculator/');
  });
});
