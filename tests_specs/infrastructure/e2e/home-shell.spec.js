import { expect, test } from '@playwright/test';

test.describe('Official standalone homepage', () => {
  test('HOME-MOBILE-001: mobile viewport uses compact cards and disables particle canvas', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const cards = page.locator('[data-cluster-card]');
    await expect(cards.first()).toBeVisible();

    const firstCardMetrics = await cards.first().evaluate((node) => {
      const style = window.getComputedStyle(node);
      return {
        height: Math.round(node.getBoundingClientRect().height),
        animationName: style.animationName,
      };
    });

    expect(firstCardMetrics.height).toBeLessThan(320);
    expect(firstCardMetrics.animationName).toBe('none');
    await expect(page.locator('#particleCanvas')).toBeHidden();
  });

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
    await expect(page.locator('#homepage-clusters-title')).toHaveText('Browse Calculator Clusters');

    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('.center-column')).toHaveCount(0);
    await expect(page.locator('.ads-column')).toHaveCount(0);

    const headingSnapshot = await page.evaluate(() =>
      Array.from(document.querySelectorAll('h1, h2, h3')).map((node) => ({
        tag: node.tagName.toLowerCase(),
        text: (node.textContent || '').trim(),
      }))
    );
    expect(headingSnapshot[0]?.tag).toBe('h1');
    const firstH2Index = headingSnapshot.findIndex((heading) => heading.tag === 'h2');
    const firstH3Index = headingSnapshot.findIndex((heading) => heading.tag === 'h3');
    expect(firstH2Index).toBeGreaterThan(-1);
    expect(firstH3Index).toBeGreaterThan(firstH2Index);
    expect(headingSnapshot.some((heading) => heading.text.length === 0)).toBeFalsy();

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

  test('HOME-SEO-001: homepage has Organization/WebSite/WebPage JSON-LD with SearchAction and no FAQPage', async ({
    page,
  }) => {
    await page.goto('/');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const canonicalHref = await canonical.getAttribute('href');
    expect(canonicalHref).toBe('https://calchowmuch.com/');

    const structuredDataScript = page.locator('script[data-homepage-ld="true"]');
    await expect(structuredDataScript).toHaveCount(1);
    const structuredText = await structuredDataScript.textContent();
    const structuredData = JSON.parse(structuredText || '{}');
    const graph = Array.isArray(structuredData['@graph']) ? structuredData['@graph'] : [];
    const types = graph.map((node) => node['@type']);

    expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite', 'WebPage']));
    expect(types).not.toContain('FAQPage');

    const organizationNode = graph.find((node) => node['@type'] === 'Organization');
    expect(organizationNode?.name).toBe('Calculate How Much');

    const websiteNode = graph.find((node) => node['@type'] === 'WebSite');
    expect(websiteNode?.url).toBe('https://calchowmuch.com/');
    expect(websiteNode?.potentialAction?.['@type']).toBe('SearchAction');
    expect(websiteNode?.potentialAction?.target?.urlTemplate).toBe(
      'https://calchowmuch.com/calculators/?q={search_term_string}'
    );
    expect(websiteNode?.potentialAction?.['query-input']).toBe('required name=search_term_string');

    const webpageNode = graph.find((node) => node['@type'] === 'WebPage');
    expect(webpageNode?.url).toBe(canonicalHref);
    expect(webpageNode?.['@id']).toBe(`${canonicalHref}#webpage`);
  });

  test('HOME-SEO-002: /calculators/?q= query contract filters results and handles empty matches', async ({
    page,
  }) => {
    await page.goto('/calculators/?q=mortgage');
    await expect(page.locator('#global-calculator-search')).toHaveValue('mortgage');

    const visibleMortgageLinks = page.locator('section ul li:not([hidden]) a');
    const visibleMortgageCount = await visibleMortgageLinks.count();
    expect(visibleMortgageCount).toBeGreaterThan(0);
    const visibleMortgageRows = await visibleMortgageLinks.evaluateAll((nodes) =>
      nodes.map((node) => `${node.textContent || ''} ${node.getAttribute('href') || ''}`.toLowerCase())
    );
    expect(visibleMortgageRows.some((value) => value.includes('mortgage'))).toBeTruthy();

    await page.goto('/calculators/?q=zzzzzz');
    await expect(page.locator('#global-calculator-search')).toHaveValue('zzzzzz');
    await expect(page.locator('#all-calculators-no-results')).toBeVisible();
    expect(await page.locator('section ul li:not([hidden]) a').count()).toBe(0);

    await page.goto('/calculators/');
    await expect(page.locator('#all-calculators-no-results')).toBeHidden();
    expect(await page.locator('section ul li:not([hidden]) a').count()).toBeGreaterThan(0);
  });
});
