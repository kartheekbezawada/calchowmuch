import { expect, test } from '@playwright/test';

test.describe('math/system-of-equations seo', () => {
  test('metadata, explanation contract, and sitemap', async ({ page }) => {
    await page.goto('/math/algebra/system-of-equations/');

    await expect(page).toHaveTitle('System of Equations Solver | 2x2 and 3x3 | CalcHowMuch');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute(
      'href',
      'https://calchowmuch.com/math/algebra/system-of-equations/'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('System of Equations Solver');

    const root = page.locator('.calculator-page-single');
    await expect(root.locator('h2')).toHaveCount(1);
    await expect(root).toContainText('How to Guide');
    await expect(root).toContainText('Important Notes');
    await expect(root).toContainText('FAQ');
    await expect(root).toContainText('Last updated: February 2026');
    await expect(root.locator('.faq-card')).toHaveCount(4);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(await sitemapResponse.text()).toContain('/math/algebra/system-of-equations/');
  });
});
