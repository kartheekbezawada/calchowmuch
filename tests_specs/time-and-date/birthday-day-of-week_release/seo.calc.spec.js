import { expect, test } from '@playwright/test';

test.describe('Birthday Day-of-Week SEO', () => {
  test('BIRTHDAY-DOW-TEST-SEO-1: metadata, single-pane layout, FAQ schema, sitemap', async ({
    page,
  }) => {
    await page.goto('/time-and-date/birthday-day-of-week');

    await expect(page).toHaveTitle('Birthday Day-of-Week Calculator | Find Your Birth Weekday');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Find the weekday you were born on, preview a future birthday year, and spot the next Friday, Saturday, or Sunday birthday.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Birthday Day-of-Week Calculator');

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
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

    await expect(page.locator('#birthday-dow-explanation')).toContainText('What you can do here');
    await expect(page.locator('#birthday-dow-explanation')).toContainText('celebration timing');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/time-and-date/birthday-day-of-week/');
  });
});
