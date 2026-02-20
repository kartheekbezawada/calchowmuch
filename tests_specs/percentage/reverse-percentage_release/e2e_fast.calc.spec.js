import { expect, test } from '@playwright/test';

const BLOCKED_PATTERNS = [
  'googlesyndication.com',
  'doubleclick.net',
  'google-analytics.com',
  'googletagmanager.com',
  'cloudflareinsights.com',
];

test.describe('Reverse Percentage Calculator (fast e2e)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (BLOCKED_PATTERNS.some((pattern) => url.includes(pattern))) {
        return route.abort();
      }
      return route.continue();
    });
  });

  test('REVPCT-FAST-E2E-1: single-pane journey, formula output, and explanation migration contract', async ({
    page,
  }) => {
    await page.goto('/percentage-calculators/reverse-percentage-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    await expect(page.locator('.panel.panel-scroll.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('#revpct-explanation .pv-results-table')).toHaveCount(1);
    await expect(page.locator('#revpct-explanation .bor-faq-card')).toHaveCount(10);
    await expect(page.locator('#revpct-explanation .faq-box')).toHaveCount(0);
    await expect(page.locator('#revpct-explanation')).not.toContainText('Scenario Summary');

    await page.fill('#revpct-percent', '20');
    await page.fill('#revpct-final', '60');
    await page.click('#revpct-calc', { force: true });

    await expect(page.locator('#revpct-result')).toContainText('Original Value: 300.00');
    await expect(page.locator('#revpct-result-detail')).toContainText(
      'Formula: Original = (60.00 × 100) ÷ 20.00 = 300.00.'
    );
    await expect(page.locator('#revpct-explanation [data-revpct="original"]').first()).toHaveText(
      '300.00'
    );
  });

  test('REVPCT-FAST-E2E-2: input validation and zero-percent guard', async ({ page }) => {
    await page.goto('/percentage-calculators/reverse-percentage-calculator/', {
      waitUntil: 'domcontentloaded',
    });

    await page.fill('#revpct-percent', '');
    await page.fill('#revpct-final', '60');
    await page.click('#revpct-calc', { force: true });
    await expect(page.locator('#revpct-result')).toContainText('Enter a valid percentage.');

    await page.fill('#revpct-percent', '0');
    await page.fill('#revpct-final', '60');
    await page.click('#revpct-calc', { force: true });
    await expect(page.locator('#revpct-result')).toContainText(
      'Original value is undefined when the percentage is zero.'
    );
  });
});
