import { expect, test } from '@playwright/test';

test.describe('Work Hours Calculator SEO', () => {
  test('WORK-HOURS-TEST-SEO-1: metadata, headings, FAQ schema, sitemap', async ({ page }) => {
    await page.goto('/time-and-date/work-hours-calculator/');

    await expect(page).toHaveTitle('Work Hours Calculator | Shifts, Breaks and Totals');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate single, split, or weekly work hours, subtract unpaid breaks, and view totals in HH:MM and decimal hours.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Work Hours Calculator');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/time-and-date/work-hours-calculator/');

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
    expect(faqNode.mainEntity).toHaveLength(4);
    expect(faqNode.mainEntity[0].name).toBe('Can I calculate hours for a night shift?');

    const explanation = page.locator('#work-hours-explanation');
    await expect(explanation.locator('h2')).toHaveCount(1);
    await expect(explanation.locator('h2')).toHaveText('How many work hours are in this shift or week?');
    await expect(explanation).toContainText('How to Guide');
    await expect(explanation).toContainText('FAQ');
    await expect(explanation).toContainText('Important Notes');
    await expect(explanation.locator('.work-hours-faq-item')).toHaveCount(4);
    await expect(explanation).toContainText('All calculations run locally in your browser - no data is stored.');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/work-hours-calculator/');
  });
});
