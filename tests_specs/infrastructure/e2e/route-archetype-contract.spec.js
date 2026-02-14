import { expect, test } from '@playwright/test';

const ALLOWED_ARCHETYPES = new Set(['calc_exp', 'calc_only', 'exp_only', 'content_shell']);
const ALLOWED_FAMILIES = new Set(['home-loan', 'auto-loans', 'credit-cards', 'neutral']);
const ALLOWED_LAYOUTS = new Set(['single', 'split']);

function flattenCalculators(navigation) {
  return navigation.categories.flatMap((category) =>
    category.subcategories.flatMap((subcategory) =>
      subcategory.calculators.map((calculator) => ({
        categoryId: category.id,
        subcategoryId: subcategory.id,
        ...calculator,
      }))
    )
  );
}

test('ROUTE-ARCHETYPE-001: all navigation calculators declare archetype/family/layout metadata', async ({
  request,
}) => {
  const response = await request.get('/config/navigation.json');
  expect(response.ok()).toBeTruthy();
  const navigation = await response.json();
  const calculators = flattenCalculators(navigation);

  expect(calculators.length).toBeGreaterThan(0);

  for (const calculator of calculators) {
    expect(ALLOWED_ARCHETYPES.has(calculator.routeArchetype)).toBeTruthy();
    expect(ALLOWED_FAMILIES.has(calculator.designFamily)).toBeTruthy();
    expect(ALLOWED_LAYOUTS.has(calculator.paneLayout)).toBeTruthy();

    if (calculator.routeArchetype !== 'calc_exp') {
      expect(calculator.paneLayout).toBe('single');
    }
  }
});

test('ROUTE-ARCHETYPE-002: generated body metadata and pane presence match metadata contract', async ({
  page,
  request,
}) => {
  const response = await request.get('/config/navigation.json');
  expect(response.ok()).toBeTruthy();
  const navigation = await response.json();
  const calculators = flattenCalculators(navigation);

  const sampleByFamily = [];
  for (const family of ['home-loan', 'auto-loans', 'credit-cards', 'neutral']) {
    const match = calculators.find((calculator) => calculator.designFamily === family);
    if (match) {
      sampleByFamily.push(match);
    }
  }

  expect(sampleByFamily.length).toBeGreaterThan(0);

  for (const calculator of sampleByFamily) {
    await page.goto(calculator.url);

    const body = page.locator('body');
    await expect(body).toHaveAttribute('data-route-archetype', calculator.routeArchetype);
    await expect(body).toHaveAttribute('data-design-family', calculator.designFamily);

    const calcPaneCount = await page.locator('[id^="calc-"]').count();
    const explanationCount = await page.locator('[id*="explanation"]').count();
    const centerPanelCount = await page.locator('.center-column .panel.panel-scroll').count();
    const hasCalcPane = calcPaneCount > 0;
    const hasExplanationPane = explanationCount > 0;

    if (calculator.routeArchetype === 'calc_exp') {
      expect(hasCalcPane).toBeTruthy();
      if (calculator.paneLayout === 'split') {
        expect(centerPanelCount).toBeGreaterThanOrEqual(2);
      } else {
        expect(hasExplanationPane).toBeTruthy();
      }
    } else if (calculator.routeArchetype === 'calc_only') {
      expect(hasCalcPane).toBeTruthy();
      expect(hasExplanationPane).toBeFalsy();
    } else if (calculator.routeArchetype === 'exp_only') {
      expect(hasCalcPane).toBeFalsy();
      expect(hasExplanationPane).toBeTruthy();
    } else if (calculator.routeArchetype === 'content_shell') {
      expect(hasCalcPane).toBeFalsy();
      expect(hasExplanationPane).toBeFalsy();
    }
  }
});

test('ROUTE-ARCHETYPE-003: home route is content_shell with neutral design family', async ({ page }) => {
  await page.goto('/');
  const body = page.locator('body');
  await expect(body).toHaveAttribute('data-route-archetype', 'content_shell');
  await expect(body).toHaveAttribute('data-design-family', 'neutral');

  expect(await page.locator('[id^="calc-"]').count()).toBe(0);
  expect(await page.locator('[id*="explanation"]').count()).toBe(0);
});
