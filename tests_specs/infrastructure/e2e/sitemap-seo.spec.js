import { test, expect } from '@playwright/test';

test.describe('Sitemap page SEO baseline', () => {
  test('SITEMAP-SEO-1: sitemap xml is reachable and contains canonical URLs', async ({ page }) => {
    const response = await page.request.get('/sitemap.xml');
    expect(response.ok(), 'Sitemap XML must load').toBeTruthy();

    const contentType = response.headers()['content-type'] || '';
    expect(contentType).toMatch(/xml|text\/plain/i);

    const xml = await response.text();
    expect(xml).toContain('<urlset');
    expect(xml).toContain('<loc>https://calchowmuch.com/</loc>');
    expect(xml).toContain('/loan-calculators/mortgage-calculator/');
    expect(xml).toContain('/faq/');
  });
});
