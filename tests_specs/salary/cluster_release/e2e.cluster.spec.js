import { expect, test } from '@playwright/test';
import { SALARY_CALCULATOR_CONFIGS, SALARY_HUB_ROUTE } from '../shared/config.js';

function isIgnorableRuntimeError(message) {
  return (
    message.includes('cloudflareinsights.com/cdn-cgi/rum') ||
    message.includes('Access-Control-Allow-Origin') ||
    message.includes('Failed to load resource: net::ERR_FAILED')
  );
}

const ROUTES = [SALARY_HUB_ROUTE, ...Object.values(SALARY_CALCULATOR_CONFIGS).map((config) => config.route)];

test.describe('salary cluster e2e smoke', () => {
  test('cluster routes load with visible H1 and no console errors', async ({ page }) => {
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
      await expect(page.locator('.sal-cluster-site-links a', { hasText: 'All Calculators' })).toHaveAttribute(
        'href',
        '/'
      );
    }

    const filtered = runtimeErrors.filter((message) => !isIgnorableRuntimeError(message || ''));
    expect(filtered, JSON.stringify(filtered, null, 2)).toEqual([]);
  });
});
