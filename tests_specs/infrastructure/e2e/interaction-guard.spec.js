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
if (!targetRoute) {
  throw new Error('TARGET_ROUTE is required for interaction guard tests.');
}

test.describe('Interaction guard', () => {
  test('Long task guard during interaction', async ({ page }) => {
    await page.goto(targetRoute);
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      window.__longTaskSamples = [];
      window.__longTaskUnsupported = false;

      if (!('PerformanceObserver' in window)) {
        window.__longTaskUnsupported = true;
        return;
      }

      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              window.__longTaskSamples.push({
                name: entry.name,
                duration: Number(entry.duration.toFixed(2)),
              });
            }
          }
        });
        observer.observe({ type: 'longtask', buffered: true });
        window.__longTaskObserver = observer;
      } catch {
        window.__longTaskUnsupported = true;
      }
    });

    await page.evaluate(() => {
      const root = document.querySelector('.calculator-ui') || document;
      const inputs = Array.from(
        root.querySelectorAll('input[type="number"], input[type="range"]')
      ).filter((input) => !input.disabled && !input.readOnly);
      const calcButton =
        root.querySelector('button[id$="-calc"]') || root.querySelector('button[type="submit"]');

      const mutateInput = (input) => {
        const current = Number(input.value || 0);
        const min = Number(input.min);
        const max = Number(input.max);
        const step = Number(input.step);
        const stepSize = Number.isFinite(step) && step > 0 ? step : 1;
        let next = Number.isFinite(current) ? current + stepSize : stepSize;
        if (Number.isFinite(max) && next > max) {
          next = Number.isFinite(min) ? min : max;
        }
        if (Number.isFinite(min) && next < min) {
          next = min;
        }
        if (Number.isFinite(step) && step > 0) {
          next = Math.round(next / step) * step;
        }
        input.value = String(next);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };

      inputs.slice(0, 3).forEach(mutateInput);
      if (calcButton) {
        calcButton.click();
      }
    });
    await page.waitForTimeout(300);

    const result = await page.evaluate(() => {
      if (window.__longTaskObserver) {
        window.__longTaskObserver.disconnect();
      }
      return {
        unsupported: Boolean(window.__longTaskUnsupported),
        longTasks: window.__longTaskSamples || [],
      };
    });

    test.skip(
      result.unsupported,
      'Long task performance observer unsupported in this browser context.'
    );
    const violations = result.longTasks.filter((entry) => entry.duration > 120);
    expect(violations, JSON.stringify(result.longTasks, null, 2)).toEqual([]);
  });

  test('Interaction latency proxy (<200ms)', async ({ page }) => {
    await page.goto(targetRoute);
    await page.waitForLoadState('networkidle');

    const latency = await page.evaluate(async () => {
      const root = document.querySelector('.calculator-ui') || document;
      const resultNode =
        root.querySelector('[id$="-result"]') || root.querySelector('.mtg-result-value');
      const input = root.querySelector('input[type="number"], input[type="range"]');
      const calcButton =
        root.querySelector('button[id$="-calc"]') || root.querySelector('button[type="submit"]');

      if (!resultNode || !input) {
        return {
          error: 'Unable to locate calculator result node or input.',
        };
      }

      const mutateInput = () => {
        const current = Number(input.value || 0);
        const min = Number(input.min);
        const max = Number(input.max);
        const step = Number(input.step);
        const stepSize = Number.isFinite(step) && step > 0 ? step : 1;
        let next = Number.isFinite(current) ? current + stepSize : stepSize;
        if (Number.isFinite(max) && next > max) {
          next = Number.isFinite(min) ? min : max;
        }
        if (Number.isFinite(min) && next < min) {
          next = min;
        }
        if (Number.isFinite(step) && step > 0) {
          next = Math.round(next / step) * step;
        }
        input.value = String(next);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };

      const before = (resultNode.textContent || '').trim();

      return new Promise((resolve) => {
        let settled = false;
        let observer = null;

        const finish = (payload) => {
          if (settled) return;
          settled = true;
          if (observer) observer.disconnect();
          resolve(payload);
        };

        observer = new MutationObserver(() => {
          const after = (resultNode.textContent || '').trim();
          if (after && after !== before) {
            finish({ latencyMs: performance.now() - start, before, after });
          }
        });
        observer.observe(resultNode, { subtree: true, childList: true, characterData: true });

        const start = performance.now();
        mutateInput();
        if (calcButton) {
          calcButton.click();
        }

        const immediate = (resultNode.textContent || '').trim();
        if (immediate && immediate !== before) {
          finish({ latencyMs: performance.now() - start, before, after: immediate });
          return;
        }

        setTimeout(() => {
          const after = (resultNode.textContent || '').trim();
          finish({
            latencyMs: performance.now() - start,
            before,
            after,
            timedOut: true,
          });
        }, 1200);
      });
    });

    expect(latency.error || null, latency.error || '').toBeNull();
    expect(Boolean(latency.timedOut), JSON.stringify(latency, null, 2)).toBe(false);
    expect(latency.latencyMs, JSON.stringify(latency, null, 2)).toBeLessThan(200);
  });

  test('Nav click stability (no layout jumps)', async ({ page }) => {
    const runtimeErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        runtimeErrors.push(msg.text());
      }
    });

    await page.goto(targetRoute);
    await page.waitForLoadState('networkidle');

    const container = page.locator('.center-column');
    const before = await container.boundingBox();

    const toggles = page.locator('.left-nav .fin-nav-toggle');
    const count = await toggles.count();
    const clickCount = Math.min(count, 3);
    for (let i = 0; i < clickCount; i += 1) {
      await toggles.nth(i).click();
      await page.waitForTimeout(150);
    }

    const after = await container.boundingBox();
    expect(after).toBeTruthy();
    expect(before).toBeTruthy();

    const xShift = Math.abs((after?.x ?? 0) - (before?.x ?? 0));
    const yShift = Math.abs((after?.y ?? 0) - (before?.y ?? 0));
    const widthShift = Math.abs((after?.width ?? 0) - (before?.width ?? 0));
    const filteredRuntimeErrors = runtimeErrors.filter((message) => {
      if (!message) return false;
      if (
        message.includes('cloudflareinsights.com/cdn-cgi/rum') ||
        message.includes('Access-Control-Allow-Origin') ||
        message.includes('Failed to load resource: net::ERR_FAILED')
      ) {
        return false;
      }
      return true;
    });

    expect(xShift).toBeLessThanOrEqual(1);
    expect(yShift).toBeLessThanOrEqual(1);
    expect(widthShift).toBeLessThanOrEqual(1);
    expect(filteredRuntimeErrors, JSON.stringify(filteredRuntimeErrors, null, 2)).toEqual([]);
  });
});
