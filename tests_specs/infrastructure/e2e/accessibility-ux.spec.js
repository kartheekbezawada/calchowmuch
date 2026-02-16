import { test, expect } from '@playwright/test';

function normalizeRoute(rawRoute) {
  if (!rawRoute || typeof rawRoute !== 'string') return null;
  let route = rawRoute.trim();
  if (!route) return null;
  if (!route.startsWith('/')) route = `/${route}`;
  route = route.replace(/\/+/, '/');
  if (route !== '/' && !route.endsWith('/')) route = `${route}/`;
  return route;
}

const targetRoute = normalizeRoute(process.env.TARGET_ROUTE);
if (!targetRoute) {
  throw new Error('TARGET_ROUTE is required for accessibility UX tests.');
}

test.describe('Accessibility UX guard', () => {
  test('Keyboard traversal + focus visibility', async ({ page }) => {
    await page.goto(targetRoute);
    await page.waitForLoadState('networkidle');

    // Tab through a handful of focusable elements to ensure focus ring appears.
    for (let i = 0; i < 8; i += 1) {
      await page.keyboard.press('Tab');
      const hasVisibleFocus = await page.evaluate(() => {
        const active = document.activeElement;
        if (!active || active === document.body) return false;
        const style = window.getComputedStyle(active);
        const outlineVisible = style.outlineStyle !== 'none' && style.outlineWidth !== '0px';
        const boxShadowVisible = style.boxShadow && style.boxShadow !== 'none';
        return outlineVisible || boxShadowVisible;
      });
      expect(hasVisibleFocus).toBe(true);
    }
  });

  test('Results live region present', async ({ page }) => {
    await page.goto(targetRoute);
    await page.waitForLoadState('networkidle');
    const ariaLive = await page.locator('[aria-live="polite"]').count();
    expect(ariaLive).toBeGreaterThan(0);
  });

  test('200% zoom layout sanity (no horizontal overflow)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto(targetRoute);
    await page.waitForLoadState('networkidle');

    // Simulate 200% zoom via text scaling + reduced viewport (more stable than CSS zoom in headless).
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    await page.waitForTimeout(300);

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      return {
        docOverflow: doc.scrollWidth - doc.clientWidth,
        bodyOverflow: body.scrollWidth - body.clientWidth,
      };
    });

    expect(overflow).toEqual({ docOverflow: 0, bodyOverflow: 0 });
  });
});
