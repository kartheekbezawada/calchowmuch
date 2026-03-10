import { expect, test } from '@playwright/test';

test.describe('Power Nap Calculator SEO', () => {
  test('POWER-NAP-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/time-and-date/power-nap-calculator');

    await expect(page).toHaveTitle('Power Nap Calculator | Calculate How Much Online Calculator');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Power Nap Calculator calculator with fast inputs and clear results. Calculate How Much provides explanations, examples, and assumptions to help you plan confidently.'
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
    expect(types).toEqual(expect.arrayContaining(['SoftwareApplication', 'BreadcrumbList']));
    expect(types).not.toContain('FAQPage');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/power-nap-calculator/');
  });
});
