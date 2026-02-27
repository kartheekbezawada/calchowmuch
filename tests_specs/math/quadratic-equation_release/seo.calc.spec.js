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
      // Ignore parse failures for unrelated script blocks.
    }
  }

  return parsed;
}

test.describe('math/quadratic-equation seo', () => {
  test('metadata, explanation order, FAQ depth, schema parity, and sitemap', async ({ page }) => {
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

    const root = page.locator('.calculator-page-single');
    await expect(root.locator('h2')).toHaveCount(1);

    const h3Texts = (await root.locator('h3').allTextContents()).map((text) => text.trim());
    const howToIndex = h3Texts.indexOf('How to Guide');
    const notesIndex = h3Texts.indexOf('Important Notes');
    const faqIndex = h3Texts.indexOf('FAQ');

    expect(howToIndex).toBeGreaterThan(-1);
    expect(notesIndex).toBeGreaterThan(-1);
    expect(faqIndex).toBeGreaterThan(-1);
    expect(howToIndex).toBeLessThan(notesIndex);
    expect(notesIndex).toBeLessThan(faqIndex);

    await expect(root).toContainText('Last updated: February 2026');
    await expect(root.locator('.faq-card')).toHaveCount(10);

    const firstVisibleQuestion = (await root.locator('.faq-card h4').first().textContent())?.trim();
    const jsonLdObjects = await page.evaluate(collectStructuredData);

    const graphNodes = jsonLdObjects.flatMap((node) =>
      Array.isArray(node?.['@graph']) ? node['@graph'] : [node]
    );

    const faqNode = graphNodes.find((node) => {
      const type = node?.['@type'];
      return type === 'FAQPage' || (Array.isArray(type) && type.includes('FAQPage'));
    });

    expect(Array.isArray(faqNode?.mainEntity)).toBeTruthy();
    expect(faqNode.mainEntity).toHaveLength(10);
    expect(faqNode.mainEntity[0].name).toBe(firstVisibleQuestion);

    const sitemapResponse = await page.request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const sitemapText = await sitemapResponse.text();
    expect(sitemapText).toContain('/math/algebra/quadratic-equation/');
  });
});
