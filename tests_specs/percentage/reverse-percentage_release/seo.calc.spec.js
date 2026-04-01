import { expect, test } from '@playwright/test';

test.describe('Reverse Percentage Calculator SEO', () => {
  test('REVPCT-TEST-SEO-1: metadata, structured data, sitemap', async ({ page }) => {
    await page.goto('/percentage-calculators/reverse-percentage-calculator/');

    await expect(page).toHaveTitle('Reverse Percentage Calculator | Find the Original Value');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Find the original value before a percentage was applied when you know the final value and the percentage rate.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Reverse Percentage');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe(
      'https://calchowmuch.com/percentage-calculators/reverse-percentage-calculator/'
    );

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();

    const ogDescription = await page
      .locator('meta[property="og:description"]')
      .getAttribute('content');
    expect(ogDescription).toBeTruthy();

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();

    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBe('summary_large_image');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    const structuredData = JSON.parse(structuredText || '{}');

    expect(structuredData['@graph']).toBeTruthy();
    const types = structuredData['@graph'].map((node) => node['@type']);
    expect(types).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList'])
    );

    const faqNode = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faqNode).toBeTruthy();
    expect(faqNode.mainEntity).toHaveLength(10);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/percentage-calculators/reverse-percentage-calculator/');

    const pageHtml = await page.content();
    expect(pageHtml).not.toContain(
      'critical source: /calculators/percentage-calculators/percent-change-calculator/calculator.css'
    );
  });
});
