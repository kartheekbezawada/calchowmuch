import { expect, test } from '@playwright/test';

test.describe('Credit Card Repayment Calculator SEO', () => {
  test('REPAYMENT-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    const route = '/credit-card-calculators/credit-card-payment-calculator/';
    const expectedTitle = 'Credit Card Payment Calculator – Monthly Payment & Payoff Plan | CalcHowMuch';
    const expectedDescription =
      'Calculate monthly credit card payments and payoff timelines. Adjust balance, APR, and payment amount to see interest costs and repayment schedules.';

    await page.goto(route);

    const charset = await page.locator('meta[charset]').getAttribute('charset');
    expect((charset || '').toLowerCase()).toBe('utf-8');

    await expect(page).toHaveTitle(expectedTitle);

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(expectedDescription);
    expect(description).not.toBe(expectedTitle);
    expect(expectedTitle).not.toContain('...');
    expect(expectedDescription).not.toContain('...');

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Credit Card Payment Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/credit-card-calculators/credit-card-payment-calculator/');

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', expectedTitle);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      expectedDescription
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://calchowmuch.com/credit-card-calculators/credit-card-payment-calculator/'
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', expectedTitle);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
      'content',
      expectedDescription
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    );

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
    expect(faqNode.mainEntity[0].name).toBe('What is a credit card payoff calculator?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain(route);
  });
});
