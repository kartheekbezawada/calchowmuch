import { expect, test } from '@playwright/test';

const ROUTE = '/car-loan-calculators/car-loan-calculator/';

test.describe('auto-loans cluster seo smoke', () => {
  test('representative route has canonical/title/robots', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
    await expect(page.locator('body[data-design-family="auto-loans"]')).toHaveCount(1);
  });
});
