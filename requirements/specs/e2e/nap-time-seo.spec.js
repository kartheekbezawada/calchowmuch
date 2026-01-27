import { expect, test } from '@playwright/test';

test.describe('Nap Time Calculator SEO', () => {
  test('NAP-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/time-and-date/nap-time-calculator');

    await expect(page).toHaveTitle('Nap Time Calculator – Quick Nap, Power Nap, or Afternoon Nap');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Choose a nap type and start time to get a recommended wake-up time. Compare quick naps, power naps, and afternoon naps with pros, cons, and FAQs.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Nap Time Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/time-and-date/nap-time-calculator/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    expect(structuredData['@type']).toBe('FAQPage');
    expect(structuredData.mainEntity).toHaveLength(5);
    expect(structuredData.mainEntity[0].name).toBe('Which nap is best for work breaks?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/nap-time-calculator/');
  });
});
