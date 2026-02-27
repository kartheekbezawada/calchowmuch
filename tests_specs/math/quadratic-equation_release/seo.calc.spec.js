import { expect, test } from '@playwright/test';

test.describe('math/quadratic-equation seo', () => {
  test('metadata, structure, and sitemap coverage', async ({ page }) => {
    await page.goto('/math/algebra/quadratic-equation/');

    await expect(page).toHaveTitle('Quadratic Equation Solver Calculator | CalcHowMuch');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute(
      'href',
      'https://calchowmuch.com/math/algebra/quadratic-equation/'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Quadratic Equation Solver');

    const expRoot = page.locator('.calculator-page-single');
    await expect(expRoot.locator('h2')).toHaveCount(1);
    await expect(expRoot.locator('h2')).toContainText('Practical Guide');

    const h3Texts = await expRoot.locator('h3').allTextContents();
    const normalized = h3Texts.map((text) => text.trim());
    expect(normalized).toContain('How to Guide');
    expect(normalized).toContain('Important Notes');
    expect(normalized).toContain('FAQ');

    await expect(expRoot).toContainText('Last updated: February 2026');
    await expect(expRoot.locator('.faq-card')).toHaveCount(4);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/math/algebra/quadratic-equation/');
  });
});
