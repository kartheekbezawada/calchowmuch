import { expect, test } from '@playwright/test';

test.describe('PCP Calculator SEO', () => {
  test('PCP-SEO-1: metadata, heading, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/loans/pcp-calculator');

    await expect(page).toHaveTitle('PCP Calculator - Monthly Payment, GFV & Total Cost');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Estimate PCP monthly payment, final payment (GFV + option fee), total interest, and total payable with premium slider inputs, three table views, and FAQs.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('PCP Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/loans/pcp-calculator/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    expect(structuredData['@type']).toBe('FAQPage');
    expect(structuredData.mainEntity).toHaveLength(10);
    expect(structuredData.mainEntity[0].name).toBe(
      'How does a PCP calculator estimate monthly payment?'
    );

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/loans/pcp-calculator/');
  });
});
