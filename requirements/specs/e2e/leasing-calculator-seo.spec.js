import { expect, test } from '@playwright/test';

test.describe('Leasing Calculator SEO', () => {
  test('LEASING-SEO-1: metadata, heading, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/loans/leasing-calculator');

    await expect(page).toHaveTitle('Leasing Calculator - Monthly Payment, Residual & Total Cost');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Estimate lease monthly payment, residual impact, finance charge, and total lease cost with premium sliders, three table views, and FAQs.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Leasing Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/loans/leasing-calculator/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    expect(structuredData['@type']).toBe('FAQPage');
    expect(structuredData.mainEntity).toHaveLength(10);
    expect(structuredData.mainEntity[0].name).toBe(
      'How does a leasing calculator estimate monthly payment?'
    );

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/loans/leasing-calculator/');
  });
});
