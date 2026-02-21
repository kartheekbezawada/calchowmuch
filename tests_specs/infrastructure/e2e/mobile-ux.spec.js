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

function slugify(route) {
  if (route === '/') return '__root__';
  return route.replace(/^\/|\/$/g, '').replace(/\//g, '-');
}

const targetRoute = normalizeRoute(process.env.TARGET_ROUTE);
const missingRouteReason = 'TARGET_ROUTE is required for mobile UX tests.';
const slug = targetRoute ? slugify(targetRoute) : '__missing__';

test.describe('Mobile UX guard', () => {
  test.skip(!targetRoute, missingRouteReason);

  test.use({ viewport: { width: 375, height: 667 } });

  test('mobile viewport screenshot', async ({ page }) => {
    await page.goto(targetRoute);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot(`mobile-${slug}.png`, {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('tap targets are at least 48x48', async ({ page }) => {
    await page.goto(targetRoute);
    await page.waitForLoadState('networkidle');

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const docOverflow = doc.scrollWidth - doc.clientWidth;
      const bodyOverflow = body.scrollWidth - body.clientWidth;
      return {
        docOverflow,
        bodyOverflow,
      };
    });

    expect(overflow, JSON.stringify(overflow)).toEqual({
      docOverflow: 0,
      bodyOverflow: 0,
    });

    const inputIssues = await page.evaluate(() => {
      const issues = [];

      function selectorFor(el) {
        if (el.id) return `#${el.id}`;
        const classes = (el.className || '')
          .toString()
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .join('.');
        return classes ? `${el.tagName.toLowerCase()}.${classes}` : el.tagName.toLowerCase();
      }

      const inputs = Array.from(document.querySelectorAll('input'));
      for (const input of inputs) {
        const type = (input.getAttribute('type') || 'text').toLowerCase();
        if (type === 'range') {
          if (!input.hasAttribute('min') || !input.hasAttribute('max') || !input.hasAttribute('step')) {
            issues.push({
              selector: selectorFor(input),
              issue: 'range missing min/max/step',
            });
          }
          continue;
        }
        if (type === 'number') {
          const inputmode = (input.getAttribute('inputmode') || '').toLowerCase();
          if (!['numeric', 'decimal'].includes(inputmode)) {
            issues.push({
              selector: selectorFor(input),
              issue: 'number missing inputmode numeric/decimal',
            });
          }
          if (!input.hasAttribute('min') || !input.hasAttribute('max') || !input.hasAttribute('step')) {
            issues.push({
              selector: selectorFor(input),
              issue: 'number missing min/max/step',
            });
          }
        }
      }

      return issues;
    });

    expect(inputIssues, JSON.stringify(inputIssues, null, 2)).toEqual([]);

    const failures = await page.evaluate(() => {
      const minSize = 48;

      function isVisible(element) {
        if (!element) return false;
        const style = window.getComputedStyle(element);
        if (style.visibility === 'hidden' || style.display === 'none') return false;
        const rect = element.getBoundingClientRect();
        if (!rect || rect.width <= 0 || rect.height <= 0) return false;
        if (rect.bottom <= 0 || rect.right <= 0) return false;
        if (rect.top >= window.innerHeight || rect.left >= window.innerWidth) return false;
        return true;
      }

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

      const container =
        document.querySelector('.calculator-ui') ||
        document.querySelector('.center-column') ||
        document.body;

      const candidates = Array.from(
        container.querySelectorAll('button, a, input, select, textarea, [role="button"]')
      );

      const failures = [];

      for (const element of candidates) {
        if (!isVisible(element)) continue;
        if (element.hasAttribute('disabled')) continue;
        if (element.getAttribute('aria-hidden') === 'true') continue;
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'input' && element.getAttribute('type') === 'hidden') continue;

        let rect = element.getBoundingClientRect();

        if (tagName === 'input' && element.getAttribute('type') === 'range') {
          const row = element.closest('.input-row') || element.closest('.slider-row');
          if (row) {
            rect = row.getBoundingClientRect();
          }
        }

        if (rect.width < minSize || rect.height < minSize) {
          failures.push({
            selector: buildSelector(element),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
        }
      }

      return failures;
    });

    expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
  });
});
