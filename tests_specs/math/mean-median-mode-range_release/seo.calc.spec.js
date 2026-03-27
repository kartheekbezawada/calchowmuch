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

test.describe('math/mean-median-mode-range seo', () => {
  test('metadata, explanation contract, schema parity, and sitemap are present', async ({
    page,
  }) => {
    await page.goto('/math/mean-median-mode-range/');

    await expect(page).toHaveTitle(
      'Mean Median Mode Range Calculator | Data Summary'
    );
    await expect(page.locator('h1')).toHaveText('Mean Median Mode Range Calculator');
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('link[href*="theme-premium-dark.css"]')).toHaveCount(0);

    const explanation = page.locator('#mmmr-explanation');
    await expect(explanation.locator('h2')).toHaveText(
      'Mean Median Mode Range Calculator Practical Guide'
    );
    await expect(explanation.locator('.faq-card')).toHaveCount(6);
    await expect(explanation.locator('.stats-related-card')).toHaveCount(3);

    const jsonLdObjects = await page.evaluate(collectStructuredData);
    const graphNodes = jsonLdObjects.flatMap((node) =>
      Array.isArray(node?.['@graph']) ? node['@graph'] : [node]
    );
    const faqNode = graphNodes.find((node) => {
      const type = node?.['@type'];
      return type === 'FAQPage' || (Array.isArray(type) && type.includes('FAQPage'));
    });

    expect(faqNode.mainEntity).toHaveLength(6);
    expect(faqNode.mainEntity[0].name).toBe('When should I use the mean?');

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    expect(await sitemapResponse.text()).toContain('/math/mean-median-mode-range/');
  });
});
