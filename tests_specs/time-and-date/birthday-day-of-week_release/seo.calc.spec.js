import { expect, test } from '@playwright/test';

test.describe('Birthday Day-of-Week SEO', () => {
  test('BIRTHDAY-DOW-TEST-SEO-1: metadata, single-pane layout, FAQ schema, sitemap', async ({
    page,
  }) => {
    await page.goto('/time-and-date/birthday-day-of-week');

    await expect(page).toHaveTitle('What Day of the Week Was I Born? | Birth Day by Date of Birth');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Enter your date of birth to find out what day of the week you were born on. See the weekday for your next birthday, the year ahead, and the next 12 years.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('What day of the week was I born?');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.birthday-dow-workspace')).toHaveCount(1);
    // NOTE (2026-08-24): `[data-birthday-intent]` and `[data-plan-view]` assertions were removed
    // from this SEO spec. Those attributes exist nowhere in the source or generated HTML — only
    // in this file and in e2e.calc.spec.js — so they resolved to 0 and failed permanently,
    // blocking every assertion after them. They are interaction assertions that do not belong in
    // an SEO spec regardless. The same dead references remain in e2e.calc.spec.js, which still
    // fails; that is a pre-existing product/test divergence (the specs describe intent chips and
    // plan-view tabs the shipped page does not have) and needs a separate decision.

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute(
      'href',
      'https://calchowmuch.com/time-and-date/birthday-day-of-week/'
    );

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    const structuredData = JSON.parse(structuredText || '{}');

    const types = structuredData['@graph'].map((node) => node['@type']);
    expect(types).toEqual(expect.arrayContaining(['WebPage', 'FAQPage']));
    expect(types).not.toContain('SoftwareApplication');
    expect(types).toContain('BreadcrumbList');
    const breadcrumbNode = structuredData['@graph'].find((node) => node['@type'] === 'BreadcrumbList');
    expect(breadcrumbNode.itemListElement).toHaveLength(3);
    expect(breadcrumbNode.itemListElement.map((item) => item.name)).toEqual([
      'Home',
      'Time & Date',
      // Deliberately a short noun phrase, not the H1 — Google renders this as the SERP
      // breadcrumb trail where a question reads badly. See module.js for the reasoning.
      'Birth Day Calculator',
    ]);

    const faqNode = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faqNode.mainEntity).toHaveLength(10);
    expect(faqNode.mainEntity[0].name).toBe('Is the birth weekday accurate?');

    const explanation = page.locator('#birthday-dow-explanation');
    // Was `toHaveCount(1)`, which had been failing silently behind the dead locator above: the
    // generator injects "More Age Calculator tools" and "Related Time & Date calculators" H2
    // sections inside this container, so the scoped count is 3. Assert the explanation's own
    // leading H2 instead, which is the one this page controls.
    await expect(explanation.locator('h2').first()).toHaveText(
      'Your birth weekday, and how the date was worked out'
    );
    // The H1 phrase must not be duplicated as an H2 anywhere on the page — the two H2 slots
    // target separate query clusters instead. See seo_fixes/.../fix-1.md
    await expect(
      page.locator('h2', { hasText: /^What day of the week was I born\?$/ })
    ).toHaveCount(0);
    await expect(explanation).toContainText('How to Guide');
    await expect(explanation).toContainText('FAQ');
    await expect(explanation).toContainText('Important Notes');
    // Manual-method content added to close the how-to query cluster (fix-2).
    await expect(explanation).toContainText('Doomsday rule');
    await expect(explanation.locator('.birthday-dow-faq-item')).toHaveCount(10);
    await expect(explanation).toContainText('All calculations run locally in your browser - no data is stored.');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/birthday-day-of-week/');
  });
});
