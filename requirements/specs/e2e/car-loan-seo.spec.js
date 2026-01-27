import { expect, test } from '@playwright/test';

test.describe('Car Loan Calculator SEO', () => {
  test('CAR-LOAN-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/loans/car-loan');

    await expect(page).toHaveTitle('Car Loan Calculator – Monthly Payment & Total Cost');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate car loan payments, interest, and total cost with down payment, trade-in, fees, and sales tax. Includes yearly payoff table and FAQs.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Car Loan Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/loans/car-loan/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    expect(structuredData['@type']).toBe('FAQPage');
    expect(structuredData.mainEntity).toHaveLength(4);
    expect(structuredData.mainEntity[0].name).toBe('How is the amount financed calculated?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/loans/car-loan/');
  });
});
