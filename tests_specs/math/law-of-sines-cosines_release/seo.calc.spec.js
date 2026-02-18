import { expect, test } from '@playwright/test';

test.describe('math/law-of-sines-cosines seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /math/trigonometry/law-of-sines-cosines/', async ({ page }) => {
    await page.goto('/math/trigonometry/law-of-sines-cosines/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
