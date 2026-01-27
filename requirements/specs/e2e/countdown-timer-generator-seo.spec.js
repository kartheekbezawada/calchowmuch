import { expect, test } from '@playwright/test';

test.describe('Countdown Timer Generator SEO', () => {
  test('COUNTDOWN-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/time-and-date/countdown-timer-generator');

    await expect(page).toHaveTitle('Countdown Timer Generator – Live Countdown to a Date');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Create a live countdown to any future date and time. Simple, fast, and free countdown timer generator.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Countdown Timer Generator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe(
      'https://calchowmuch.com/calculators/time-and-date/countdown-timer-generator/'
    );

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    expect(structuredData['@type']).toBe('FAQPage');
    expect(structuredData.mainEntity).toHaveLength(4);
    expect(structuredData.mainEntity[0].name).toBe('Does the countdown include the current second?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/countdown-timer-generator/');
  });
});
