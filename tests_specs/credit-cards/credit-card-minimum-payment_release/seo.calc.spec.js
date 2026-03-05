import { expect, test } from '@playwright/test';

test.describe('Credit Card Minimum Payment Calculator SEO', () => {
  test('MINPAY-TEST-SEO-1: metadata, schema, FAQ parity, and sitemap', async ({ page }) => {
    const route = '/credit-card-calculators/credit-card-minimum-payment-calculator/';
    const expectedTitle =
      'Credit Card Minimum Payment Calculator – Payoff Time & Interest | CalcHowMuch';
    const expectedDescription =
      'Estimate how long it takes to pay off a credit card when making minimum payments. See payoff timeline, total interest, and payment schedule.';

    await page.goto(route);

    const charset = await page.locator('meta[charset]').getAttribute('charset');
    expect((charset || '').toLowerCase()).toBe('utf-8');

    await expect(page).toHaveTitle(expectedTitle);

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(expectedDescription);
    expect(description).not.toBe(expectedTitle);
    expect(expectedTitle).not.toContain('...');
    expect(expectedDescription).not.toContain('...');

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Credit Card Minimum Payment Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(await canonical.getAttribute('href')).toBe(
      'https://calchowmuch.com/credit-card-calculators/credit-card-minimum-payment-calculator/'
    );

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', expectedTitle);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      expectedDescription
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://calchowmuch.com/credit-card-calculators/credit-card-minimum-payment-calculator/'
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', expectedTitle);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
      'content',
      expectedDescription
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    );

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredDataText = await structuredDataScript.textContent();
    const structuredData = JSON.parse(structuredDataText || '{}');

    const graph = Array.isArray(structuredData['@graph']) ? structuredData['@graph'] : [];
    const types = graph.map((node) => node['@type']);
    expect(types).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList'])
    );

    const faqNode = graph.find((node) => node['@type'] === 'FAQPage');
    expect(Array.isArray(faqNode?.mainEntity)).toBeTruthy();
    expect(faqNode.mainEntity).toHaveLength(10);

    const visibleQuestions = await page.locator('#cc-min-explanation .cc-min-faq-item strong').allTextContents();
    const normalizedVisibleQuestions = visibleQuestions.map((text) => text.replace(/^Q:\s*/, '').trim());
    const schemaQuestions = faqNode.mainEntity.map((entry) => entry.name.trim());
    expect(schemaQuestions).toEqual(normalizedVisibleQuestions);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain(route);

    const humanSitemapResponse = await page.request.get('/sitemap.xml');
    expect(humanSitemapResponse.ok()).toBeTruthy();
    const humanSitemapText = await humanSitemapResponse.text();
    expect(humanSitemapText).toContain('/credit-card-calculators/credit-card-minimum-payment-calculator');
  });
});
