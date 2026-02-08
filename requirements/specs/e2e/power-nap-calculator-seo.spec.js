import { expect, test } from '@playwright/test';

test.describe('Power Nap Calculator SEO', () => {
  test('POWER-NAP-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/time-and-date/power-nap-calculator');

    await expect(page).toHaveTitle('Power Nap Calculator – Best Nap Length and Wake-Up Time');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate the best wake-up time for power naps. See options for 10, 20, 30, 60, and 90-minute naps with recommended durations.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Power Nap Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/time-and-date/power-nap-calculator/');

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
    expect(faqNode.mainEntity[0].name).toBe('What is the ideal power nap length?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/power-nap-calculator/');
  });
});
