import { expect, test } from '@playwright/test';

test.describe('Days Until a Date Calculator SEO', () => {
  test('DAYS-UNTIL-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/time-and-date/days-until-a-date-calculator');

    await expect(page).toHaveTitle('Days Until a Date Calculator | Countdown, Days Since & Weekdays');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Count days until a future date, days since a past date, or weekdays between two dates with countdown, range, and inclusive-count options.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Days Until Date Calculator');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('#calc-days-until')).toHaveCount(1);
    await expect(page.locator('[data-mode]')).toHaveCount(2);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/time-and-date/days-until-a-date-calculator/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    if (Array.isArray(structuredData['@graph'])) {
      const types = structuredData['@graph'].map((node) => node['@type']);
      expect(types).toEqual(expect.arrayContaining(['WebPage', 'FAQPage']));
      expect(types).not.toContain('SoftwareApplication');
      expect(types).not.toContain('BreadcrumbList');

      const faqNode = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage');
      expect(faqNode.mainEntity).toHaveLength(4);
      expect(faqNode.mainEntity[0].name).toBe('Can I use this for past dates?');
    } else {
      expect(structuredData['@type']).toBe('FAQPage');
      expect(structuredData.mainEntity).toHaveLength(4);
      expect(structuredData.mainEntity[0].name).toBe('Can I use this for past dates?');
    }

    const explanation = page.locator('#days-until-explanation');
    await expect(explanation.locator('h2')).toHaveCount(1);
    await expect(explanation).toContainText('How many days until a date?');
    await expect(explanation).toContainText('How to Guide');
    await expect(explanation).toContainText('FAQ');
    await expect(explanation).toContainText('Important Notes');
    await expect(explanation.locator('.days-until-faq-item')).toHaveCount(4);
    await expect(explanation).toContainText('All calculations run locally in your browser - no data is stored.');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/days-until-a-date-calculator/');
  });
});
