import { expect, test } from '@playwright/test';

test.describe('Hire Purchase Calculator SEO', () => {
  test('HIRE-PURCHASE-SEO-1: metadata, heading, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/loans/hire-purchase');

    await expect(page).toHaveTitle('Hire Purchase Calculator - Monthly Payment, Balloon & Total Cost');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Estimate hire purchase monthly payment, final balloon amount, total interest, and total payable with premium slider inputs and amortization views.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Hire Purchase Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/loans/hire-purchase/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    expect(structuredData['@type']).toBe('FAQPage');
    expect(structuredData.mainEntity).toHaveLength(10);
    expect(structuredData.mainEntity[0].name).toBe(
      'How does a hire purchase calculator estimate monthly payment?'
    );

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/loans/hire-purchase/');
  });
});
