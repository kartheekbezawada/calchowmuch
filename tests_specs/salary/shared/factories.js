import { expect, test } from '@playwright/test';
import { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';

function isIgnorableRuntimeError(message) {
  return (
    message.includes('cloudflareinsights.com/cdn-cgi/rum') ||
    message.includes('Access-Control-Allow-Origin') ||
    message.includes('Failed to load resource: net::ERR_FAILED')
  );
}

export function parseNumericText(text) {
  const cleaned = String(text || '').replace(/[^0-9.-]+/g, '');
  return cleaned ? Number(cleaned) : Number.NaN;
}

export function registerSalaryE2ETest(config) {
  test.describe(config.h1, () => {
    test(`${config.h1} route renders and calculates`, async ({ page }) => {
      const runtimeErrors = [];
      page.on('pageerror', (error) => runtimeErrors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') {
          runtimeErrors.push(message.text());
        }
      });

      await page.goto(config.route);

      await expect(page.locator('h1').first()).toHaveText(config.h1);
      await expect(page.locator('.sal-calc-shell')).toHaveCount(1);
      await expect(page.locator('.calculator-page-single')).toHaveCount(1);
      await config.runE2E({ page, expect, parseNumericText });

      const filtered = runtimeErrors.filter((message) => !isIgnorableRuntimeError(message || ''));
      expect(filtered, JSON.stringify(filtered, null, 2)).toEqual([]);
    });
  });
}

export function registerSalarySeoTest(config) {
  test.describe(`${config.h1} SEO`, () => {
    test(`${config.h1} route emits expected metadata and sitemap entry`, async ({ page }) => {
      await page.goto(config.route);

      await expect(page).toHaveTitle(config.title);

      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toBe(config.description);

      await expect(page.locator('h1').first()).toHaveText(config.h1);

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      await expect(canonical).toHaveAttribute('href', `https://calchowmuch.com${config.route}`);

      const structuredDataScript = page.locator('script[data-calculator-ld]');
      await expect(structuredDataScript).toHaveCount(1);
      const structuredText = await structuredDataScript.textContent();
      expect(structuredText || '').toContain('SoftwareApplication');
      expect(structuredText || '').toContain('FAQPage');
      expect(structuredText || '').toContain(`https://calchowmuch.com${config.route}`);

      const sitemapResponse = await page.request.get('/sitemap.xml');
      expect(sitemapResponse.ok()).toBeTruthy();
      const sitemapText = await sitemapResponse.text();
      expect(sitemapText).toContain(config.route);
    });
  });
}

export function registerSalaryCwvTest(config) {
  test.describe(`${config.h1} cwv guard`, () => {
    test('route satisfies CLS/LCP thresholds', async ({ page }) => {
      const metrics = await measureRouteCwv(page, config.route);
      assertCwv(metrics, config.route);
    });
  });
}
