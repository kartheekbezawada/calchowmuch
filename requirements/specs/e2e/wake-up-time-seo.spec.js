import { expect, test } from '@playwright/test';

test.describe('Wake-Up Time Calculator SEO', () => {
  test('WAKEUP-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/#/time-and-date/wake-up-time-calculator');

    await expect(page).toHaveTitle('Wake-Up Time Calculator – When Should I Wake Up?');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate the best wake-up time based on when you go to sleep and full sleep cycles. Simple, fast, and free wake-up time calculator.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Wake-Up Time Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe(
      'https://calchowmuch.com/calculators/time-and-date/wake-up-time-calculator/'
    );

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    expect(structuredData['@type']).toBe('FAQPage');
    expect(structuredData.mainEntity).toHaveLength(5);
    expect(structuredData.mainEntity[0].name).toBe('How many sleep cycles should I aim for?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/calculators/time-and-date/wake-up-time-calculator/');
  });
});
