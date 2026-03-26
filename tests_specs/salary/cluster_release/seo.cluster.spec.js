import { expect, test } from '@playwright/test';
import {
  SALARY_CALCULATOR_CONFIGS,
  SALARY_HUB_DESCRIPTION,
  SALARY_HUB_ROUTE,
  SALARY_HUB_TITLE,
} from '../shared/config.js';

test.describe('salary cluster seo smoke', () => {
  test('hub route has expected metadata and links all salary calculators', async ({ page }) => {
    await page.goto(SALARY_HUB_ROUTE);

    await expect(page).toHaveTitle(SALARY_HUB_TITLE);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', SALARY_HUB_DESCRIPTION);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://calchowmuch.com/salary-calculators/');

    for (const config of Object.values(SALARY_CALCULATOR_CONFIGS)) {
      await expect(page.locator(`a[href="${config.route}"]`).first()).toBeVisible();
    }

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain(SALARY_HUB_ROUTE);
  });
});
