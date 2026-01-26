import { expect, test } from '@playwright/test';

test.describe('Birthday Day-of-Week SEO', () => {
  test('BIRTHDAY-DOW-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/time-and-date/birthday-day-of-week');

    await expect(page).toHaveTitle('Birthday Day-of-Week Calculator – What Day Were You Born?');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Find the day of the week you were born on, and see what weekday your birthday falls on in any year. Simple, fast, and free.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Birthday Day-of-Week Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/time-and-date/birthday-day-of-week/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    expect(structuredData['@type']).toBe('FAQPage');
    expect(structuredData.mainEntity).toHaveLength(4);
    expect(structuredData.mainEntity[0].name).toBe('Is the result accurate?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/birthday-day-of-week/');
  });
});
