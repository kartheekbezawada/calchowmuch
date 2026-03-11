import { expect, test } from '@playwright/test';

test.describe('Leasing Calculator SEO', () => {
  test('LEASING-SEO-1: metadata, heading, FAQ schema, sitemap', async ({ page }) => {
    const expectedTitle = 'Car Lease Calculator | Payment, Residual & Cost';
    const expectedDescription =
      'Estimate car lease payments, residual value, finance charge, and total lease cost using price, money factor, upfront payment, and term.';

    await page.goto('/car-loan-calculators/car-lease-calculator');

    await expect(page).toHaveTitle(expectedTitle);
    expect(expectedTitle).not.toContain('...');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(expectedDescription);
    expect(description).not.toBe(expectedTitle);
    expect(description).not.toContain('...');
    expect(expectedDescription).not.toContain('...');

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Car Lease Calculator');

    const charset = await page.locator('meta[charset]').getAttribute('charset');
    expect((charset || '').toLowerCase()).toBe('utf-8');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/car-loan-calculators/car-lease-calculator/');

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      expectedTitle
    );
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      expectedDescription
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonicalHref);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      expectedTitle
    );
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
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');
    const graph = Array.isArray(structuredData['@graph']) ? structuredData['@graph'] : [];
    const webpageSchema = graph.find((entry) => entry?.['@type'] === 'WebPage');
    const softwareSchema = graph.find((entry) => entry?.['@type'] === 'SoftwareApplication');
    const breadcrumbSchema = graph.find((entry) => entry?.['@type'] === 'BreadcrumbList');
    const faqSchema = graph.find((entry) => entry?.['@type'] === 'FAQPage');

    expect(webpageSchema?.name).toBe('Car Lease Calculator | Payment, Residual & Cost');
    expect(webpageSchema?.primaryImageOfPage?.url).toBe(
      'https://calchowmuch.com/assets/images/og-default.png'
    );
    expect(softwareSchema?.name).toBe('Car Lease Calculator');
    expect(breadcrumbSchema?.itemListElement).toHaveLength(3);
    expect(faqSchema?.mainEntity).toHaveLength(10);
    expect(faqSchema?.mainEntity?.[0]?.name).toBe(
      'How does a leasing calculator estimate monthly payment?'
    );

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/car-loan-calculators/car-lease-calculator/');
  });
});
