import { expect, test } from '@playwright/test';

const routes = [
  { name: 'Sitemap', path: '/sitemap/', h1: 'Sitemap' },
  { name: 'Privacy', path: '/privacy/', h1: 'Privacy Policy' },
  { name: 'Terms', path: '/terms/', h1: 'Terms & Conditions' },
  { name: 'Contact', path: '/contact/', h1: 'Contact' },
  { name: 'FAQs', path: '/faqs/', h1: 'FAQs' },
];

routes.forEach(({ name, path, h1 }) => {
  test(`${name} page uses GTEP layout`, async ({ page }) => {
    await page.goto(path);

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(h1);

    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.center-column')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);
    await expect(page.locator('.layout-main')).toHaveCount(0);
    await expect(page.locator('script[src*="mpa-nav.js"]')).toHaveCount(0);

    const footerLinks = page.locator('.gtep-footer a');
    await expect(footerLinks).toHaveCount(5);
    await expect(footerLinks.nth(0)).toHaveText('Privacy');
    await expect(footerLinks.nth(1)).toHaveText('Terms & Conditions');
    await expect(footerLinks.nth(2)).toHaveText('Contact');
    await expect(footerLinks.nth(3)).toHaveText('FAQs');
    await expect(footerLinks.nth(4)).toHaveText('Sitemap');
  });
});
