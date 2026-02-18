import { expect, test } from '@playwright/test';

const ROUTES = ["/math/algebra/factoring/","/math/algebra/polynomial-operations/","/math/algebra/quadratic-equation/"];

test.describe('math cluster e2e smoke', () => {
  test('cluster representative routes load and show H1', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      await expect(page.locator('h1').first()).toBeVisible();
    }
  });
});
