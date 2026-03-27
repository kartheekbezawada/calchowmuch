import { expect, test } from '@playwright/test';

test.describe('Official standalone homepage', () => {
  test('HOME-MOBILE-001: mobile viewport uses compact cards without legacy particle canvas', async ({
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
    await expect(page.locator('#particleCanvas')).toHaveCount(0);
  });

  test('HOME-ISS-001: root route renders standalone cluster cards without calculator shell panes', async ({
    page,
    request,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('body')).toHaveAttribute('data-page', 'home');
    await expect(page.locator('body')).toHaveAttribute('data-route-archetype', 'content_shell');
    await expect(page.locator('body')).toHaveAttribute('data-design-family', 'neutral');

    await expect(page.locator('.preview-header')).toHaveCount(1);
    await expect(page.locator('#homepage-hero-title')).toHaveText(
      'All Calculators — Finance, Loan, Mortgage & Math Tools'
    );
    await expect(page.locator('#homepage-search')).toHaveCount(1);
    await expect(page.locator('#homepage-clusters-title')).toHaveText('Browse Calculator Clusters');
    await expect(page.locator('#homepage-popular-title')).toHaveText('Popular Calculators');
    await expect(page.locator('#homepage-faq-title')).toHaveText('Frequently Asked Questions');

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
    expect(firstH2Index).toBeGreaterThan(-1);
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

    const homeLoanCard = page.locator('[data-cluster-id="home-loan"]');
    await expect(homeLoanCard).toHaveCount(1);
    await expect(homeLoanCard.locator('[data-route-link]')).toHaveCount(4);
    await expect(homeLoanCard.locator('[data-route-link]', { hasText: 'Home Loan' })).toHaveCount(0);
    await expect(homeLoanCard.locator('[data-cluster-toggle]')).toHaveAttribute('aria-expanded', 'false');

    await expect(page.getByText('Create Your Own')).toHaveCount(0);

    const footerLinks = page.locator('.site-footer a');
    await expect(footerLinks).toHaveCount(5);
    await expect(footerLinks.nth(0)).toHaveText('Privacy');
    await expect(footerLinks.nth(1)).toHaveText('Terms & Conditions');
    await expect(footerLinks.nth(2)).toHaveText('Contact');
    await expect(footerLinks.nth(3)).toHaveText('FAQs');
    await expect(footerLinks.nth(4)).toHaveText('Sitemap');
  });

  test('HOME-SEO-001: homepage has Organization/WebSite/WebPage/FAQ JSON-LD with SearchAction', async ({
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

    expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite', 'WebPage', 'FAQPage']));

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

    const faqNode = graph.find((node) => node['@type'] === 'FAQPage');
    expect(Array.isArray(faqNode?.mainEntity)).toBeTruthy();
    expect(faqNode.mainEntity.length).toBeGreaterThanOrEqual(10);
  });

  test('HOME-SEARCH-001: homepage search shows inline suggestions and matching calculators', async ({
    page,
  }) => {
    await page.goto('/');

    const searchInput = page.locator('#homepage-search');
    await searchInput.fill('credit card');

    const suggestions = page.locator('#homepage-search-suggestions');
    await expect(suggestions).toBeVisible();
    const creditCardSuggestion = suggestions.locator(
      'a.search-suggestion[href="/credit-card-calculators/credit-card-payment-calculator/"]'
    );
    await expect(creditCardSuggestion).toHaveCount(1);
    await expect(creditCardSuggestion.locator('.search-suggestion-title')).toHaveText('Repayment');
    await expect(creditCardSuggestion.locator('.search-suggestion-meta')).toHaveText(
      'Loans • Credit Cards'
    );
    await expect(suggestions.locator('a.search-suggestion')).toHaveCount(5);
    await expect(
      suggestions.locator('a.search-suggestion-view-all[href="/calculators/?q=credit%20card"]')
    ).toHaveCount(1);

    const creditCardCard = page.locator('[data-cluster-id="credit-cards"]');
    await expect(creditCardCard).toBeVisible();
    await expect(
      creditCardCard.locator(
        '[data-route-link][href="/credit-card-calculators/credit-card-payment-calculator/"]'
      )
    ).toHaveCount(1);

    await creditCardSuggestion.click();

    await expect(page).toHaveURL('/credit-card-calculators/credit-card-payment-calculator/');

    await page.goto('/');
    await searchInput.fill('mortgage');

    await expect(page.locator('#homepage-search-suggestions')).toBeVisible();
    await expect(
      page
        .locator('#homepage-search-suggestions')
        .locator('a.search-suggestion[href="/loan-calculators/mortgage-calculator/"]')
    ).toHaveCount(1);

    const homeLoanCard = page.locator('[data-cluster-id="home-loan"]');
    await expect(homeLoanCard).toBeVisible();
    await expect(
      homeLoanCard.locator('[data-route-link][href="/loan-calculators/mortgage-calculator/"]')
    ).toHaveCount(1);
    await expect(homeLoanCard.locator('[data-cluster-toggle]')).toHaveAttribute('aria-expanded', 'false');

    await searchInput.fill('birthday');

    const timeAndDateCard = page.locator('[data-cluster-id="time-and-date"]');
    await expect(timeAndDateCard).toBeVisible();
    await expect(page.locator('#homepage-search-suggestions')).toBeVisible();
    await expect(
      timeAndDateCard.locator('[data-route-link][href="/time-and-date/birthday-day-of-week/"]')
    ).toHaveCount(1);

    await page.goto('/');
    await searchInput.fill('percentage');

    const percentageCard = page.locator('[data-cluster-id="percentage"]');
    await expect(percentageCard.locator('[data-route-link]')).toHaveCount(4);
    await expect(
      percentageCard.locator('[data-route-link][href="/percentage-calculators/reverse-percentage-calculator/"]')
    ).toHaveCount(0);

    await page
      .locator('#homepage-search-suggestions')
      .locator('a.search-suggestion-view-all[href="/calculators/?q=percentage"]')
      .click();

    await expect(page).toHaveURL('/');
    await expect(page.locator('#homepage-search-suggestions')).toBeHidden();
    await expect(page.locator('.categories')).toHaveAttribute('data-results-mode', 'expanded');
    await expect(page.locator('.categories')).toHaveAttribute('data-expanded-query', 'percentage');
    await expect(
      percentageCard.locator('[data-route-link][href="/percentage-calculators/reverse-percentage-calculator/"]')
    ).toHaveCount(1);
  });

  test('HOME-CARD-001: cluster explore toggles inline expansion and preserves route navigation', async ({
    page,
  }) => {
    await page.goto('/');

    const salaryCard = page.locator('[data-cluster-id="salary"]');
    const homeLoanCard = page.locator('[data-cluster-id="home-loan"]');
    const salaryToggle = salaryCard.locator('[data-cluster-toggle]');
    const homeLoanToggle = homeLoanCard.locator('[data-cluster-toggle]');

    await expect(salaryCard.locator('[data-route-link]')).toHaveCount(4);
    await expect(salaryToggle).toHaveAttribute('aria-expanded', 'false');

    await salaryToggle.press('Enter');

    await expect(salaryToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(salaryToggle).toContainText('Collapse');
    expect(await salaryCard.locator('[data-route-link]').count()).toBeGreaterThan(4);
    await expect(
      salaryCard.locator('[data-route-link][href="/salary-calculators/commission-calculator/"]')
    ).toHaveCount(1);

    await homeLoanToggle.click();

    await expect(salaryToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(salaryCard.locator('[data-route-link]')).toHaveCount(4);
    await expect(homeLoanToggle).toHaveAttribute('aria-expanded', 'true');
    expect(await homeLoanCard.locator('[data-route-link]').count()).toBeGreaterThan(4);

    await homeLoanToggle.press('Space');

    await expect(homeLoanToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(homeLoanCard.locator('[data-route-link]')).toHaveCount(4);

    await page.goto('/');
    const searchInput = page.locator('#homepage-search');
    await searchInput.fill('percentage');

    const percentageCard = page.locator('[data-cluster-id="percentage"]');
    const percentageToggle = percentageCard.locator('[data-cluster-toggle]');
    await expect(percentageCard.locator('[data-route-link]')).toHaveCount(4);
    await expect(
      percentageCard.locator('[data-route-link][href="/percentage-calculators/reverse-percentage-calculator/"]')
    ).toHaveCount(0);

    await percentageToggle.click();

    await expect(percentageToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(
      percentageCard.locator('[data-route-link][href="/percentage-calculators/reverse-percentage-calculator/"]')
    ).toHaveCount(1);

    await percentageCard
      .locator('[data-route-link][href="/percentage-calculators/reverse-percentage-calculator/"]')
      .click();

    await expect(page).toHaveURL('/percentage-calculators/reverse-percentage-calculator/');
  });

  test('HOME-SEO-002: /calculators/?q= query contract filters multi-word matches and handles empty matches', async ({
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

    await page.goto('/calculators/?q=home%20loan');
    await expect(page.locator('#global-calculator-search')).toHaveValue('home loan');
    await expect(
      page.locator('section ul li:not([hidden]) a[href="/loan-calculators/mortgage-calculator/"]')
    ).toHaveCount(1);

    await page.goto('/calculators/?q=credit%20card');
    await expect(page.locator('#global-calculator-search')).toHaveValue('credit card');
    await expect(
      page.locator(
        'section ul li:not([hidden]) a[href="/credit-card-calculators/credit-card-payment-calculator/"]'
      )
    ).toHaveCount(1);

    await page.goto('/calculators/?q=zzzzzz');
    await expect(page.locator('#global-calculator-search')).toHaveValue('zzzzzz');
    await expect(page.locator('#all-calculators-no-results')).toBeVisible();
    expect(await page.locator('section ul li:not([hidden]) a').count()).toBe(0);

    await page.goto('/calculators/');
    await expect(page.locator('#all-calculators-no-results')).toBeHidden();
    expect(await page.locator('section ul li:not([hidden]) a').count()).toBeGreaterThan(0);
  });
});
