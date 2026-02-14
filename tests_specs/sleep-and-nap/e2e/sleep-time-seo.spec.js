import { expect, test } from '@playwright/test';

test.describe('Sleep Time Calculator SEO', () => {
  test('SLEEP-TEST-SEO-1: metadata, headings, FAQ schema', async ({ page }) => {
    await page.goto('/#/time-and-date/sleep-time-calculator');

    await expect(page).toHaveTitle('Sleep Time Calculator – Best Time to Sleep and Wake Up');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe(
      'Calculate the best time to sleep or wake up based on natural sleep cycles. Simple, fast, and free sleep time calculator.'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Sleep Time Calculator');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/calculators/time-and-date/sleep-time-calculator/');

    const structuredDataScript = page.locator('script[data-calculator-ld]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    expect(structuredText).toBeTruthy();
    const structuredData = JSON.parse(structuredText || '{}');

    expect(structuredData['@type']).toBe('FAQPage');
    expect(structuredData.mainEntity).toHaveLength(5);
    expect(structuredData.mainEntity[0].name).toBe('How many hours of sleep do I need?');
  });
});
