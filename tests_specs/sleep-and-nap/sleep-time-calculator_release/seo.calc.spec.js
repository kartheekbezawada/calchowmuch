import { expect, test } from '@playwright/test';

test.describe('Sleep Time Calculator SEO', () => {
  test('SLEEP-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/time-and-date/sleep-time-calculator/');

    await expect(page).toHaveTitle('Sleep Time Calculator | Bedtime and Wake-Up Cycles');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Find bedtime or wake-up times based on 90-minute sleep cycles and a fall-asleep buffer.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Sleep Time Calculator');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/time-and-date/sleep-time-calculator/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    const types = structuredData['@graph'].map((node) => node['@type']);
    expect(types).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList'])
    );

    const faqNode = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faqNode.mainEntity).toHaveLength(10);
    expect(faqNode.mainEntity[0].name).toBe('How many hours of sleep do I need?');

    const explanation = page.locator('#sleep-time-explanation');
    await expect(explanation.locator('.sleep-explanation-card h2')).toHaveCount(1);
    await expect(explanation.locator('.sleep-explanation-card h2')).toHaveText(
      'When should you go to sleep or wake up?'
    );
    await expect(explanation).toContainText('How to Guide');
    await expect(explanation).toContainText('FAQ');
    await expect(explanation).toContainText('Important Notes');
    await expect(explanation.locator('.sleep-faq-item')).toHaveCount(10);
    await expect(explanation).toContainText('All calculations run locally in your browser - no data is stored.');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/sleep-time-calculator/');
  });
});
