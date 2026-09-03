import { expect, test } from '@playwright/test';

test.describe('Debt Payoff Calculator SEO', () => {
  test('DEBT-PAYOFF-SEO-1: metadata, schema, explanation structure, and sitemap', async ({
    page,
  }) => {
    const route = '/credit-card-calculators/debt-payoff-calculator/';
    await page.goto(route);

    await expect(page).toHaveTitle(
      'Debt Payoff Calculator | Snowball vs Avalanche & Payoff Date'
    );
    await expect(page.locator('h1')).toHaveText('Debt Payoff Calculator');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://calchowmuch.com/credit-card-calculators/debt-payoff-calculator/'
    );

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'See when you could be debt-free. Order multiple debts by snowball or avalanche, compare total interest and payoff months, and find which debt to pay off first.'
    );

    const structuredText = await page.locator('script[data-calculator-ld]').textContent();
    const structuredData = JSON.parse(structuredText || '{}');
    const graph = structuredData['@graph'] || [];
    expect(graph.map((node) => node['@type'])).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'BreadcrumbList', 'FAQPage'])
    );

    const faq = graph.find((node) => node['@type'] === 'FAQPage');
    expect(faq.mainEntity).toHaveLength(13);

    const explanation = page.locator('#debt-payoff-explanation');
    await expect(explanation.getByRole('heading', { level: 2 })).toHaveText(
      'How does this debt payoff calculator help?'
    );
    await expect(explanation).toContainText('How to Guide');
    await expect(explanation).toContainText('Snowball vs avalanche');
    await expect(explanation).toContainText('Worked scenarios');
    await expect(explanation).toContainText('Important Notes');
    await expect(explanation.locator('.faq-card')).toHaveCount(13);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(await sitemapResponse.text()).toContain(route);
  });
});
