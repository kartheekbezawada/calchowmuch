import { expect, test } from '@playwright/test';

test.describe('Birthday Day-of-Week SEO', () => {
  test('BIRTHDAY-DOW-TEST-SEO-1: metadata, single-pane layout, FAQ schema, sitemap', async ({
    page,
  }) => {
    await page.goto('/time-and-date/birthday-day-of-week');

    await expect(page).toHaveTitle('Birthday Day-of-Week Calculator | Find the Day You Were Born');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Find the weekday you were born on, preview future birthday weekdays, and spot upcoming Friday, Saturday, or Sunday birthdays for planning.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Birthday Day-of-Week Calculator');

    await expect(page.locator('.td-cluster-page-shell')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.birthday-dow-workspace')).toHaveCount(1);
    await expect(page.locator('[data-birthday-intent]')).toHaveCount(3);
    await expect(page.locator('[data-plan-view]')).toHaveCount(3);

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
    expect(types).not.toContain('BreadcrumbList');

    const faqNode = structuredData['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faqNode.mainEntity).toHaveLength(6);
    expect(faqNode.mainEntity[0].name).toBe('Is the birth weekday accurate?');

    const explanation = page.locator('#birthday-dow-explanation');
    await expect(explanation.locator('h2')).toHaveCount(1);
    await expect(explanation).toContainText('What day of the week was I born on?');
    await expect(explanation).toContainText('How to Guide');
    await expect(explanation).toContainText('FAQ');
    await expect(explanation).toContainText('Important Notes');
    await expect(explanation.locator('.birthday-dow-faq-item')).toHaveCount(6);
    await expect(explanation).toContainText('All calculations run locally in your browser - no data is stored.');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/birthday-day-of-week/');
  });
});
