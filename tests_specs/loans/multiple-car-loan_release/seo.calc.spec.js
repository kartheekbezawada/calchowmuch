import { expect, test } from '@playwright/test';

test.describe('Multiple Car Loan Calculator SEO', () => {
  test('MULTI-CAR-LOAN-SEO-1: metadata, heading, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/car-loan-calculators/auto-loan-calculator');

    await expect(page).toHaveTitle('Multiple Car Loan Calculator - Compare Two Auto Loans');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Compare two car loans side by side and estimate combined monthly payment, total interest, and total paid with amortization views and FAQs.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Multiple Car Loan Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/car-loan-calculators/auto-loan-calculator/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    expect(structuredData['@type']).toBe('FAQPage');
    expect(structuredData.mainEntity).toHaveLength(10);
    expect(structuredData.mainEntity[0].name).toBe(
      'What does this multiple car loan calculator compare?'
    );

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/car-loan-calculators/auto-loan-calculator/');
  });
});
