import { expect, test } from '@playwright/test';

const ROUTE = '/credit-card-calculators/';
const EXPECTED_TITLE = 'Credit Card Calculators | Minimum Payment, Payoff, Balance Transfer';

test.describe('Credit Card Calculators hub SEO', () => {
  test('CCHUB-TEST-SEO-1: metadata, schema, and sitemap', async ({ page }) => {
    await page.goto(ROUTE);

    await expect(page).toHaveTitle(EXPECTED_TITLE);

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Credit Card Calculators');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(await canonical.getAttribute('href')).toBe(
      'https://calchowmuch.com/credit-card-calculators/'
    );

    const ld = page.locator('script[data-calculator-ld]');
    await expect(ld).toHaveCount(1);
    const graph = JSON.parse((await ld.textContent()) || '{}')['@graph'] || [];
    const types = graph.map((node) => node['@type']);
    expect(types).toEqual(
      expect.arrayContaining(['WebSite', 'Organization', 'CollectionPage', 'ItemList', 'BreadcrumbList'])
    );

    // The five cluster calculators must each be listed.
    const itemList = graph.find((node) => node['@type'] === 'ItemList');
    expect(itemList.itemListElement).toHaveLength(5);

    const sitemap = await page.request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();
    expect(await sitemap.text()).toContain('https://calchowmuch.com/credit-card-calculators/');
  });

  test('CCHUB-TEST-SEO-2: resolves the breadcrumb ancestor the calculators point at', async ({
    page,
  }) => {
    // Every calculator in this cluster declares /credit-card-calculators/ as breadcrumb position 2.
    // Before this hub existed that URL 404'd on every crawl. See fix-4.
    const response = await page.request.get(ROUTE);
    expect(response.status()).toBe(200);

    await page.goto('/credit-card-calculators/credit-card-minimum-payment-calculator/');
    const ld = page.locator('script[data-calculator-ld]');
    const graph = JSON.parse((await ld.textContent()) || '{}')['@graph'] || [];
    const crumbs = graph.find((node) => node['@type'] === 'BreadcrumbList');
    const ancestor = crumbs.itemListElement.find((item) => item.position === 2);
    expect(ancestor.item).toBe('https://calchowmuch.com/credit-card-calculators/');

    const ancestorResponse = await page.request.get(ancestor.item);
    expect(ancestorResponse.status()).toBe(200);
  });
});
