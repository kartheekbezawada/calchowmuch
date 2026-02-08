import { expect, test } from '@playwright/test';

test.describe('Balance Transfer Calculator SEO', () => {
  test('BALTRANSFER-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/loans/balance-transfer-installment-plan');

    await expect(page).toHaveTitle(
      'Balance Transfer Calculator – Savings with Promo APR & Fees'
    );

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate your balance transfer savings including transfer fees, promo APR periods, and post-promo rates. See total cost and payoff timeline.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Balance Transfer Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/loans/balance-transfer-installment-plan/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    const types = structuredData['@graph'].map((node) => node['@type']);
    expect(types).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList'])
    );

    const faqNode = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faqNode.mainEntity).toHaveLength(10);
    expect(faqNode.mainEntity[0].name).toBe('What is a credit card balance transfer?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/loans/balance-transfer-installment-plan/');
  });
});
