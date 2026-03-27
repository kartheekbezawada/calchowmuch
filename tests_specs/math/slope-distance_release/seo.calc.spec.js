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

test.describe('math/slope-distance seo', () => {
  test('metadata, explanation contract, FAQ depth, schema parity, and sitemap', async ({ page }) => {
    await page.goto('/math/algebra/slope-distance/');

    await expect(page).toHaveTitle('Slope and Distance Calculator | CalcHowMuch');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute(
      'href',
      'https://calchowmuch.com/math/algebra/slope-distance/'
    );

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Slope and Distance Calculator');

    const root = page.locator('.calculator-page-single');
    const explanationSections = root.locator('.slope-exp-section');
    await expect(page.locator('.math-cluster-panel.panel-span-all')).toHaveCount(1);
    await expect(page.locator('.top-nav')).toHaveCount(0);
    await expect(page.locator('.left-nav')).toHaveCount(0);
    await expect(page.locator('link[href*="theme-premium-dark.css"]')).toHaveCount(0);
    await expect(explanationSections.locator('h2')).toHaveCount(1);

    const h3Texts = (await explanationSections.locator('h3').allTextContents()).map((text) =>
      text.trim()
    );
    const howToIndex = h3Texts.indexOf('How to Guide');
    const quickAnswerIndex = h3Texts.indexOf('Quick Answer Table');
    const formulaIndex = h3Texts.indexOf('Formula Notes');
    const workedExampleIndex = h3Texts.indexOf('Worked Example');
    const notesIndex = h3Texts.indexOf('Important Notes');
    const faqIndex = h3Texts.indexOf('FAQ');
    const relatedIndex = h3Texts.indexOf('Related Calculators');

    expect(howToIndex).toBeGreaterThan(-1);
    expect(quickAnswerIndex).toBeGreaterThan(-1);
    expect(formulaIndex).toBeGreaterThan(-1);
    expect(workedExampleIndex).toBeGreaterThan(-1);
    expect(notesIndex).toBeGreaterThan(-1);
    expect(faqIndex).toBeGreaterThan(-1);
    expect(relatedIndex).toBeGreaterThan(-1);

    await expect(root).toContainText('Last updated: March 2026');
    await expect(root.locator('.faq-card')).toHaveCount(10);
    await expect(root.locator('.slope-related-card')).toHaveCount(3);

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
    expect(sitemapText).toContain('/math/algebra/slope-distance/');
  });
});
