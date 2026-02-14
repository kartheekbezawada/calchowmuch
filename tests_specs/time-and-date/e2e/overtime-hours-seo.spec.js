import { expect, test } from '@playwright/test';

test.describe('Overtime Hours Calculator SEO', () => {
  test('OVERTIME-TEST-SEO-1: metadata, headings, structured data, sitemap', async ({ page }) => {
    await page.goto('/time-and-date/overtime-hours-calculator');

    await expect(page).toHaveTitle(
      'Overtime Hours Calculator – Regular Hours vs Overtime (Daily & Weekly)'
    );

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate total work hours and split them into regular and overtime hours. Supports single shifts, split shifts, custom weekly cycles, night shifts, and night overtime.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Overtime Hours Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/time-and-date/overtime-hours-calculator/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    expect(structuredData['@graph']).toHaveLength(2);
    expect(structuredData['@graph'][0]['@type']).toBe('FAQPage');
    expect(structuredData['@graph'][1]['@type']).toBe('WebPage');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/overtime-hours-calculator/');
  });
});
