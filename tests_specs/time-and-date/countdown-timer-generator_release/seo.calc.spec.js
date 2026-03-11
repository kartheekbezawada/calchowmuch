import { expect, test } from '@playwright/test';

test.describe('Countdown Timer Generator SEO', () => {
  test('COUNTDOWN-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/time-and-date/countdown-timer-generator');

    await expect(page).toHaveTitle('Countdown Timer Generator | Time Left to Any Date');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Create a countdown to any future date and time and see the remaining days, hours, minutes, and seconds.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Countdown Timer Generator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/time-and-date/countdown-timer-generator/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    const types = structuredData['@graph'].map((node) => node['@type']);
    expect(types).toEqual(expect.arrayContaining(['WebPage', 'FAQPage']));
    expect(types).not.toContain('SoftwareApplication');
    expect(types).not.toContain('BreadcrumbList');

    const faqNode = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faqNode.mainEntity).toHaveLength(4);
    expect(faqNode.mainEntity[0].name).toBe('Does the countdown include the current second?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/countdown-timer-generator/');
  });
});
