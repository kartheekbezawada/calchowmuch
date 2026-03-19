import { expect, test } from '@playwright/test';

const ROUTES = [
  '/car-loan-calculators/car-loan-calculator/',
  '/car-loan-calculators/pcp-calculator/',
  '/car-loan-calculators/car-lease-calculator/',
];

function isIgnorableRuntimeError(message) {
  return (
    message.includes('cloudflareinsights.com/cdn-cgi/rum') ||
    message.includes('Access-Control-Allow-Origin') ||
    message.includes('Failed to load resource: net::ERR_FAILED')
  );
}

test.describe('auto-loans cluster e2e smoke', () => {
  test('cluster representative routes load with visible H1 and no console errors', async ({
    page,
  }) => {
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
      await expect(page.locator('.al-cluster-site-header')).toHaveCount(1);
      await expect(page.locator('.top-nav')).toHaveCount(0);
      await expect(page.locator('.left-nav')).toHaveCount(0);
      await expect(page.locator('.ads-column')).toHaveCount(0);
    }

    const filtered = runtimeErrors.filter((message) => !isIgnorableRuntimeError(message || ''));
    expect(filtered, JSON.stringify(filtered, null, 2)).toEqual([]);
  });
});
