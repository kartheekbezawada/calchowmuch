import { expect, test } from '@playwright/test';

test.describe('Car Loan Calculator SEO', () => {
  test('CAR-LOAN-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/car-loan-calculators/car-loan-calculator');

    await expect(page).toHaveTitle('Car Loan Calculator – Monthly Payment & Total Cost');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate car loan EMI, total interest, and total payment using premium slider-based inputs for price, down payment, trade-in, fees, tax, APR, and term.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Car Loan Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/car-loan-calculators/car-loan-calculator/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    expect(structuredData['@type']).toBe('FAQPage');
    expect(structuredData.mainEntity).toHaveLength(4);
    expect(structuredData.mainEntity[0].name).toBe('How is amount financed calculated?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/car-loan-calculators/car-loan-calculator/');
  });
});
