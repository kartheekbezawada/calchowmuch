import { expect, test } from '@playwright/test';

test.describe('Official standalone homepage', () => {
  test('HOME-ISS-001: root route renders standalone cluster cards without calculator shell panes', async ({
    page,
    request,
  }) => {
    await page.goto('/');

    await expect(page.locator('body')).toHaveAttribute('data-page', 'home');
    await expect(page.locator('body')).toHaveAttribute('data-route-archetype', 'content_shell');
    await expect(page.locator('body')).toHaveAttribute('data-design-family', 'neutral');

    await expect(page.locator('.preview-header')).toHaveCount(1);
    await expect(page.locator('#homepage-hero-title')).toHaveText('Calculate How Much');
    await expect(page.locator('#homepage-search')).toHaveCount(1);

    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.center-column')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);

    const registryResponse = await request.get('/config/clusters/cluster-registry.json');
    expect(registryResponse.ok()).toBeTruthy();
    const registry = await registryResponse.json();
    const expectedClusters = (registry.clusters || []).filter(
      (cluster) => cluster.clusterId !== 'homepage' && cluster.showOnHomepage !== false
    );

    const cards = page.locator('[data-cluster-card]');
    await expect(cards).toHaveCount(expectedClusters.length);

    for (const cluster of expectedClusters) {
      const card = page.locator(`[data-cluster-id="${cluster.clusterId}"]`);
      await expect(card).toHaveCount(1);
      const routeLinks = card.locator('[data-route-link]');
      const routeLinkCount = await routeLinks.count();
      expect(routeLinkCount).toBeGreaterThanOrEqual(1);
      expect(routeLinkCount).toBeLessThanOrEqual(4);

      const totalRoutes = Number((await card.getAttribute('data-total-routes')) || '0');
      if (totalRoutes >= 3) {
        expect(routeLinkCount).toBeGreaterThanOrEqual(3);
      }
    }

    await expect(page.getByText('Create Your Own')).toHaveCount(0);

    const footerLinks = page.locator('.site-footer a');
    await expect(footerLinks).toHaveCount(5);
    await expect(footerLinks.nth(0)).toHaveText('Privacy');
    await expect(footerLinks.nth(1)).toHaveText('Terms & Conditions');
    await expect(footerLinks.nth(2)).toHaveText('Contact');
    await expect(footerLinks.nth(3)).toHaveText('FAQs');
    await expect(footerLinks.nth(4)).toHaveText('Sitemap');
  });
});
