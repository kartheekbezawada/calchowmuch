import { expect } from '@playwright/test';

const CLS_THRESHOLD = 0.1;
const LCP_THRESHOLD_MS = 2500;

function initObserver() {
  return () => {
    window.__cwvScope = {
      cls: 0,
      lcp: 0,
    };

    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__cwvScope.cls += Number(entry.value || 0);
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      window.__clsObserver = clsObserver;
    } catch {
      window.__clsObserver = null;
    }

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (!last) {
          return;
        }
        const value = Number(last.renderTime || last.loadTime || 0);
        if (value > 0) {
          window.__cwvScope.lcp = Math.max(window.__cwvScope.lcp, value);
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      window.__lcpObserver = lcpObserver;
    } catch {
      window.__lcpObserver = null;
    }
  };
}

export async function measureRouteCwv(page, route) {
  await page.addInitScript(initObserver());
  const response = await page.goto(route, { waitUntil: 'networkidle', timeout: 120000 });
  expect(response && response.ok()).toBeTruthy();

  await page.waitForTimeout(1200);

  const metrics = await page.evaluate(() => {
    if (window.__clsObserver) {
      window.__clsObserver.disconnect();
    }
    if (window.__lcpObserver) {
      window.__lcpObserver.disconnect();
    }

    return {
      cls: Number((window.__cwvScope?.cls || 0).toFixed(4)),
      lcp: Number((window.__cwvScope?.lcp || 0).toFixed(2)),
    };
  });

  return metrics;
}

export function assertCwv(metrics, route) {
  expect(metrics.cls, `CLS exceeded on ${route}`).toBeLessThanOrEqual(CLS_THRESHOLD);
  expect(metrics.lcp, `LCP exceeded on ${route}`).toBeLessThanOrEqual(LCP_THRESHOLD_MS);
}
