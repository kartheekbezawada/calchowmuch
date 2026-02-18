import { test, expect } from '@playwright/test';

function normalizeRoute(rawRoute) {
  if (!rawRoute || typeof rawRoute !== 'string') return null;
  let route = rawRoute.trim();
  if (!route) return null;
  if (!route.startsWith('/')) route = `/${route}`;
  route = route.replace(/\/+/g, '/');
  if (route !== '/' && !route.endsWith('/')) route = `${route}/`;
  return route;
}

const targetRoute = normalizeRoute(process.env.TARGET_ROUTE);
const missingRouteReason = 'TARGET_ROUTE is required for above-the-fold mutation test.';

test.describe('Above-the-fold mutation guard', () => {
  test.skip(!targetRoute, missingRouteReason);

  test('Above-the-fold mutation guard', async ({ page }) => {
    await page.goto(targetRoute);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);

    const mutations = await page.evaluate(async () => {
      const results = [];
      const ignoreTags = new Set(['SCRIPT', 'STYLE', 'LINK', 'NOSCRIPT']);

      function buildSelector(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return 'unknown';
        if (node.id) return `#${node.id}`;
        const parts = [];
        let current = node;
        let depth = 0;
        while (current && depth < 4) {
          const tag = current.tagName.toLowerCase();
          const classes = (current.className || '')
            .toString()
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .join('.');
          parts.unshift(classes ? `${tag}.${classes}` : tag);
          current = current.parentElement;
          depth += 1;
        }
        return parts.join(' > ');
      }

      const observer = new MutationObserver((entries) => {
        for (const entry of entries) {
          for (const node of entry.addedNodes) {
            if (!node || node.nodeType !== Node.ELEMENT_NODE) continue;
            if (ignoreTags.has(node.tagName)) continue;
            if (!node.isConnected) continue;
            const rect = node.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) continue;
            if (rect.bottom <= 0 || rect.top >= window.innerHeight) continue;
            results.push({
              selector: buildSelector(node),
              top: Math.round(rect.top),
              height: Math.round(rect.height),
              width: Math.round(rect.width),
            });
          }
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      observer.disconnect();
      return results;
    });

    expect(mutations, JSON.stringify(mutations, null, 2)).toEqual([]);
  });
});
