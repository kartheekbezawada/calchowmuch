import { expect, test } from '@playwright/test';

test.describe('math/trig-functions seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/trigonometry/trig-functions/', async ({ page }) => {
    await page.goto('/math/trigonometry/trig-functions/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
