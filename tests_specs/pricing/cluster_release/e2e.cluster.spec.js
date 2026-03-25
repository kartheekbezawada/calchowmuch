import { expect, test } from '@playwright/test';

const ROUTES = [
  '/pricing-calculators/commission-calculator/',
  '/pricing-calculators/discount-calculator/',
  '/pricing-calculators/margin-calculator/',
  '/pricing-calculators/markup-calculator/',
];

function isIgnorableRuntimeError(message) {
  return (
    message.includes('cloudflareinsights.com/cdn-cgi/rum') ||
    message.includes('Access-Control-Allow-Origin') ||
    message.includes('Failed to load resource: net::ERR_FAILED')
  );
}

test.describe('pricing cluster e2e smoke', () => {
  test('cluster representative routes load with visible H1 and no console errors', async ({ page }) => {
    const runtimeErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        runtimeErrors.push(message.text());
      }
    });

    for (const route of ROUTES) {
      await page.goto(route);
      await expect(page.locator('h1').first()).toBeVisible();
    }

    const filtered = runtimeErrors.filter((message) => !isIgnorableRuntimeError(message || ''));
    expect(filtered, JSON.stringify(filtered, null, 2)).toEqual([]);
  });
});
