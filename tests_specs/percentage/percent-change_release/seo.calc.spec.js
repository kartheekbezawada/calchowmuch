import { expect, test } from '@playwright/test';

test.describe('Percent Change Calculator SEO', () => {
  test('PCHG-TEST-SEO-1: metadata, schema, sitemap', async ({ page }) => {
    await page.goto('/percentage-calculators/percent-change-calculator/');

    await expect(page).toHaveTitle('Percent Change Calculator – CalcHowMuch');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate percent change from A to B with the correct +/− sign. Use our free percentage change calculator and formula instantly.'
    );

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(await canonical.getAttribute('href')).toBe('https://calchowmuch.com/percentage-calculators/percent-change-calculator/');

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Percent Change Calculator');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    const structuredData = JSON.parse(structuredText || '{}');
    const types = structuredData['@graph'].map((node) => node['@type']);
    expect(types).toEqual(expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList']));

    const faqNode = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faqNode.mainEntity).toHaveLength(10);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(await sitemapResponse.text()).toContain('/percentage-calculators/percent-change-calculator/');
  });
});
