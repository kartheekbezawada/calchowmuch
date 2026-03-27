import { expect, test } from '@playwright/test';

test.describe('Fraction Calculator SEO', () => {
  test('FRAC-TEST-SEO-1: metadata, schema, FAQ parity, and sitemap', async ({ page }) => {
    await page.goto('/math/fraction-calculator/');

    await expect(page).toHaveTitle(
      'Fraction Calculator | Math Operations & Simplify'
    );

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Use this free fraction calculator to add, subtract, multiply, divide, simplify, and convert fractions with clear worked steps for students.'
    );

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(await canonical.getAttribute('href')).toBe('https://calchowmuch.com/math/fraction-calculator/');

    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('link[href*="theme-premium-dark.css"]')).toHaveCount(0);

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText('Fraction Calculator');
    await expect(page.locator('#fraction-explanation h2')).toHaveText('Fraction Calculator Quick Guide');
    await expect(page.locator('#fraction-explanation .fc-summary-table tbody tr')).toHaveCount(6);
    await expect(page.locator('#fc-faq .faq-card')).toHaveCount(10);
    await expect(page.locator('#fraction-explanation .fc-link-card[href="/math/basic/"]')).toBeVisible();
    await expect(
      page.locator('#fraction-explanation .fc-link-card[href="/math/sample-size/"]')
    ).toBeVisible();

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredData = JSON.parse((await structuredDataScript.textContent()) || '{}');
    const graph = structuredData['@graph'];
    const types = graph.map((node) => node['@type']);
    expect(types).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList'])
    );

    const faqNode = graph.find((node) => node['@type'] === 'FAQPage');
    expect(faqNode.mainEntity).toHaveLength(10);

    const breadcrumbNode = graph.find((node) => node['@type'] === 'BreadcrumbList');
    expect(breadcrumbNode.itemListElement).toHaveLength(3);
    expect(breadcrumbNode.itemListElement[2].name).toBe('Fraction Calculator');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(await sitemapResponse.text()).toContain('/math/fraction-calculator/');
  });
});
