import { expect, test } from '@playwright/test';

test.describe('math/limit seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/calculus/limit/', async ({ page }) => {
    await page.goto('/math/calculus/limit/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
