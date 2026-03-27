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
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('link[href*="theme-premium-dark.css"]')).toHaveCount(0);

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Quadratic Equation Solver');

    const root = page.locator('.calculator-page-single');
    await expect(root.locator('.quad-exp-section h2')).toHaveCount(1);
    await expect(root.locator('.quad-exp-section h2')).toHaveText(
      'Quadratic Equation Solver Practical Guide'
    );

    const h3Texts = (await root.locator('h3').allTextContents()).map((text) => text.trim());
    const howToIndex = h3Texts.indexOf('How to Guide');
    const tableIndex = h3Texts.indexOf('Quick Answer Table');
    const formulaIndex = h3Texts.indexOf('Formula Notes');
    const workedIndex = h3Texts.indexOf('Worked Example');
    const faqIndex = h3Texts.indexOf('FAQ');
    const relatedIndex = h3Texts.indexOf('Related Calculators');
    const notesIndex = h3Texts.indexOf('Important Notes');

    expect(howToIndex).toBeGreaterThan(-1);
    expect(tableIndex).toBeGreaterThan(-1);
    expect(formulaIndex).toBeGreaterThan(-1);
    expect(workedIndex).toBeGreaterThan(-1);
    expect(notesIndex).toBeGreaterThan(-1);
    expect(faqIndex).toBeGreaterThan(-1);
    expect(relatedIndex).toBeGreaterThan(-1);

    await expect(root).toContainText('Last updated: March 2026');
    await expect(root.locator('.faq-card')).toHaveCount(10);
    await expect(root.locator('.quad-related-card')).toHaveCount(3);

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
