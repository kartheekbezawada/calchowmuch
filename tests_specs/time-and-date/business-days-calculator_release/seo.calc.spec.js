import { expect, test } from '@playwright/test';

test.describe('Business Days Calculator SEO', () => {
  test('BUSINESS-DAYS-SEO-1: metadata, schema, explanation structure, and sitemap', async ({
    page,
  }) => {
    const route = '/time-and-date/business-days-calculator/';
    await page.goto(route);

    await expect(page).toHaveTitle(
      'Business Days Calculator | Count Working Days and Shift Deadlines'
    );
    await expect(page.locator('h1')).toHaveText('Business Days Calculator');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://calchowmuch.com/time-and-date/business-days-calculator/'
    );

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Count business days between two dates or add and subtract working days with a custom workweek plus US and UK observed holiday presets.'
    );

    const structuredText = await page.locator('script[data-calculator-ld]').textContent();
    const structuredData = JSON.parse(structuredText || '{}');
    const graph = structuredData['@graph'] || [];
    expect(graph.map((node) => node['@type'])).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'BreadcrumbList', 'FAQPage'])
    );
    const faq = graph.find((node) => node['@type'] === 'FAQPage');
    expect(faq.mainEntity).toHaveLength(4);

    const explanation = page.locator('#business-days-explanation');
    await expect(explanation.getByRole('heading', { level: 2 })).toHaveText(
      'What does this business days calculator do?'
    );
    await expect(explanation).toContainText('How to Guide');
    await expect(explanation).toContainText('Important Notes');
    await expect(explanation.locator('.faq-card')).toHaveCount(4);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(await sitemapResponse.text()).toContain(route);
  });
});
