import { expect, test } from '@playwright/test';

test.describe('math/percentage-increase seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /percentage-calculators/percentage-increase/', async ({ page }) => {
    await page.goto('/percentage-calculators/percentage-increase/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
