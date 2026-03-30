import { expect, test } from '@playwright/test';

test.describe('Time to Savings Goal Calculator SEO', () => {
  test('TSG-TEST-SEO-1: metadata, structured data, sitemap', async ({ page }) => {
    await page.goto('/finance-calculators/time-to-savings-goal-calculator');

    await expect(page).toHaveTitle('Time to Savings Goal Calculator | Months to Reach Target');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Estimate how many months it could take to reach a savings goal using current balance, recurring deposits, interest rate, and compounding.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Time to Savings Goal Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe(
      'https://calchowmuch.com/finance-calculators/time-to-savings-goal-calculator/'
    );

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();

    const structuredData = JSON.parse(structuredText || '{}');
    expect(structuredData['@graph']).toBeTruthy();

    const types = structuredData['@graph'].map((node) => node['@type']);
    expect(types).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList'])
    );

    const faqNode = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faqNode.mainEntity).toHaveLength(10);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/finance-calculators/time-to-savings-goal-calculator/');
  });
});
