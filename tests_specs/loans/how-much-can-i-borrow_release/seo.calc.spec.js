import { expect, test } from '@playwright/test';

test.describe('loans/how-much-can-i-borrow seo scope placeholder', () => {
  test.skip('migrated SEO content pending for /loan-calculators/how-much-can-i-borrow/', async ({ page }) => {
    await page.goto('/loan-calculators/how-much-can-i-borrow/');
    await expect(page.locator('title')).toHaveCount(1);
  });
});
