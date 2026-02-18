import { expect, test } from '@playwright/test';

const ROUTE = '/math/algebra/factoring/';

test.describe('math cluster seo smoke', () => {
  test('representative route has canonical/title/robots', async ({ page }) => {
    await page.goto(ROUTE);
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
  });
});
