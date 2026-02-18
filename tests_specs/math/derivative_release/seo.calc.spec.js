import { expect, test } from '@playwright/test';

test.describe('math/derivative seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/calculus/derivative/', async ({ page }) => {
    await page.goto('/math/calculus/derivative/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
