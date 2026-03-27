import { expect, test } from '@playwright/test';

test.describe('math/basic SEO migration guard', () => {
  test('ships static SEO, FAQ, and schema in generated HTML', async ({ page }) => {
    await page.goto('/math/basic/');

    await expect(page).toHaveTitle('Basic Calculator | Add, Subtract, Multiply, Divide');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /add, subtract, multiply, or divide everyday numbers/i
    );
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('link[href*="theme-premium-dark.css"]')).toHaveCount(0);
    await expect(page.locator('h3', { hasText: 'FAQ' })).toBeVisible();
    await expect(page.locator('.faq-card')).toHaveCount(4);
    await expect(page.locator('a[href="/math/fraction-calculator/"]')).toBeVisible();

    const structuredData = await page.locator('script[data-static-ld="true"]').textContent();
    expect(structuredData).toContain('"@type":"WebPage"');
    expect(structuredData).toContain('"@type":"SoftwareApplication"');
    expect(structuredData).toContain('"@type":"FAQPage"');
    expect(structuredData).toContain('"@type":"BreadcrumbList"');
  });
});
