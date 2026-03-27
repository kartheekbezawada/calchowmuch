import { expect, test } from '@playwright/test';

function collectStructuredData() {
  const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  const parsed = [];

  for (const script of scripts) {
    const raw = (script.textContent || '').trim();
    if (!raw) continue;

    try {
      const value = JSON.parse(raw);
      if (Array.isArray(value)) {
        parsed.push(...value);
      } else {
        parsed.push(value);
      }
    } catch {
      // Ignore unrelated blocks.
    }
  }

  return parsed;
}

test.describe('math/series-convergence seo', () => {
  test('metadata, explanation contract, schema parity, and sitemap are present', async ({
    page,
  }) => {
    await page.goto('/math/calculus/series-convergence/');

    await expect(page).toHaveTitle(
      'Series Convergence Calculator | Ratio, Root and Comparison Tests | CalcHowMuch'
    );

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute(
      'href',
      'https://calchowmuch.com/math/calculus/series-convergence/'
    );

    await expect(page.locator('h1')).toHaveText('Series Convergence Calculator');
    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.calculator-page-single')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('link[href*="theme-premium-dark.css"]')).toHaveCount(0);

    const explanation = page.locator('#series-explanation');
    await expect(explanation.locator('h2')).toHaveText(
      'Series Convergence Calculator Practical Guide'
    );

    const headings = (await explanation.locator('h3').allTextContents()).map((text) => text.trim());
    expect(headings).toEqual([
      'How to Guide',
      'Quick Answer Table',
      'Formula Guide',
      'Worked Example',
      'FAQ',
      'Related Calculators',
      'Important Notes',
    ]);

    await expect(explanation.locator('.faq-card')).toHaveCount(6);
    await expect(explanation.locator('.series-related-card')).toHaveCount(3);
    await expect(explanation).toContainText('Last updated: March 2026');

    const jsonLdObjects = await page.evaluate(collectStructuredData);
    const graphNodes = jsonLdObjects.flatMap((node) =>
      Array.isArray(node?.['@graph']) ? node['@graph'] : [node]
    );
    const types = graphNodes.map((node) => node?.['@type']).flat();

    expect(types).toEqual(
      expect.arrayContaining(['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList'])
    );

    const faqNode = graphNodes.find((node) => {
      const type = node?.['@type'];
      return type === 'FAQPage' || (Array.isArray(type) && type.includes('FAQPage'));
    });
    expect(faqNode.mainEntity).toHaveLength(6);
    expect(faqNode.mainEntity[0].name).toBe('What does convergence mean for a series?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(await sitemapResponse.text()).toContain('/math/calculus/series-convergence/');
  });
});
