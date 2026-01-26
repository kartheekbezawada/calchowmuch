import { expect, test } from '@playwright/test';

test.describe('Days Until a Date Calculator SEO', () => {
  test('DAYS-UNTIL-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/#/time-and-date/days-until-a-date-calculator');

    await expect(page).toHaveTitle('Days Until a Date Calculator – How Many Days Until');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate how many days are left until a specific date. Simple, fast, and free days until a date calculator.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Days Until a Date Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe(
      'https://calchowmuch.com/calculators/time-and-date/days-until-a-date-calculator/'
    );

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    expect(structuredData['@type']).toBe('FAQPage');
    expect(structuredData.mainEntity).toHaveLength(4);
    expect(structuredData.mainEntity[0].name).toBe('Does the calculator include today in the count?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/calculators/time-and-date/days-until-a-date-calculator/');
  });
});
