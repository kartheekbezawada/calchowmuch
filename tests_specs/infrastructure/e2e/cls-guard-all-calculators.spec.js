import fs from 'node:fs/promises';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const NAVIGATION_PATH = path.resolve(process.cwd(), 'public/config/navigation.json');
const REPORT_PATH = path.resolve(
  process.cwd(),
  process.env.CLS_GUARD_REPORT_PATH || 'test-results/performance/cls-guard-all-calculators.json'
);

const CLS_THRESHOLD = 0.1;
const SHIFT_THRESHOLD = 0.05;
const LCP_THRESHOLD_MS = 2500;
const INP_PROXY_THRESHOLD_MS = 200;
const STRESS_SHIFT_ROUTE_OVERRIDES = {
  '/credit-card-calculators/balance-transfer-credit-card-calculator/': 0.1,
  '/credit-card-calculators/credit-card-consolidation-calculator/': 0.1,
  '/math/fraction-calculator/': 0.1,
};
const STRESS_CPU_RATE = 4;
const STRESS_NETWORK = {
  offline: false,
  latency: 150,
  downloadThroughput: (2 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  connectionType: 'cellular3g',
};

function normalizeRoute(route) {
  if (!route || typeof route !== 'string') {
    return null;
  }
  let normalized = route.trim();
  if (!normalized) {
    return null;
  }
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  normalized = normalized.replace(/\/+/g, '/');
  if (normalized !== '/' && !normalized.endsWith('/')) {
    normalized = `${normalized}/`;
  }
  return normalized;
}

function resolveRouteFilters(envName) {
  const rawValue = process.env[envName];
  if (!rawValue || typeof rawValue !== 'string') {
    return [];
  }
  return rawValue
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => normalizeRoute(item) || item);
}

function resolveThresholds(route, mode) {
  const shiftThreshold =
    mode === 'stress' && Object.prototype.hasOwnProperty.call(STRESS_SHIFT_ROUTE_OVERRIDES, route)
      ? STRESS_SHIFT_ROUTE_OVERRIDES[route]
      : SHIFT_THRESHOLD;

  return {
    cls: CLS_THRESHOLD,
    maxShift: shiftThreshold,
    lcp: LCP_THRESHOLD_MS,
    inpProxy: INP_PROXY_THRESHOLD_MS,
  };
}

async function loadCalculatorRoutes() {
  const raw = await fs.readFile(NAVIGATION_PATH, 'utf8');
  const navigation = JSON.parse(raw);
  const uniqueRoutes = new Set();

  const categories = Array.isArray(navigation.categories) ? navigation.categories : [];
  for (const category of categories) {
    const subcategories = Array.isArray(category.subcategories) ? category.subcategories : [];
    for (const subcategory of subcategories) {
      const calculators = Array.isArray(subcategory.calculators) ? subcategory.calculators : [];
      for (const calculator of calculators) {
        const normalized = normalizeRoute(calculator?.url);
        if (normalized) {
          uniqueRoutes.add(normalized);
        }
      }
    }
  }

  return [...uniqueRoutes].sort();
}

function layoutShiftObserverInitScript() {
  return () => {
    const ignoredWindowMs = 500;

    function buildSelector(node) {
      if (!node || node.nodeType !== Node.ELEMENT_NODE) {
        return 'unknown';
      }
      const parts = [];
      let current = node;
      let depth = 0;
      while (current && depth < 5) {
        const tag = current.tagName?.toLowerCase() || 'node';
        const id = current.id ? `#${current.id}` : '';
        const className =
          typeof current.className === 'string' && current.className.trim()
            ? `.${current.className.trim().split(/\s+/).slice(0, 2).join('.')}`
            : '';
        parts.unshift(`${tag}${id}${className}`);
        current = current.parentElement;
        depth += 1;
      }
      return parts.join('>');
    }

    window.__clsGuard = {
      cls: 0,
      maxShift: 0,
      lcp: 0,
      inpProxy: 0,
      entries: [],
      startedAt: Date.now(),
    };

    if (window.__clsObserver) {
      window.__clsObserver.disconnect();
    }

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) {
          continue;
        }
        if (entry.startTime < ignoredWindowMs) {
          continue;
        }

        const shiftValue = Number(entry.value) || 0;
        window.__clsGuard.cls += shiftValue;
        window.__clsGuard.maxShift = Math.max(window.__clsGuard.maxShift, shiftValue);

        if (window.__clsGuard.entries.length < 30) {
          const sources = Array.isArray(entry.sources)
            ? entry.sources.slice(0, 3).map((source) => ({
                selector: buildSelector(source?.node),
                previousRect: source?.previousRect ?? null,
                currentRect: source?.currentRect ?? null,
              }))
            : [];

          window.__clsGuard.entries.push({
            value: shiftValue,
            startTime: entry.startTime,
            sources,
          });
        }
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });
    window.__clsObserver = observer;

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (!lastEntry) {
          return;
        }
        const candidate = Number(lastEntry.renderTime || lastEntry.loadTime || 0);
        if (Number.isFinite(candidate) && candidate > 0) {
          window.__clsGuard.lcp = Math.max(window.__clsGuard.lcp, candidate);
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      window.__lcpObserver = lcpObserver;
    } catch {
      window.__lcpObserver = null;
    }

    try {
      const inpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'pointermove') {
            continue;
          }
          const duration = Number(entry.duration || 0);
          if (Number.isFinite(duration) && duration > 0) {
            window.__clsGuard.inpProxy = Math.max(window.__clsGuard.inpProxy, duration);
          }
        }
      });
      inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 16 });
      window.__inpObserver = inpObserver;
    } catch {
      window.__inpObserver = null;
    }

    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.visibilityState === 'hidden' && window.__lcpObserver) {
          window.__lcpObserver.disconnect();
        }
      },
      { once: true }
    );
  };
}

async function applyStressProfile(page) {
  const session = await page.context().newCDPSession(page);
  await session.send('Network.enable');
  await session.send('Network.emulateNetworkConditions', STRESS_NETWORK);
  await session.send('Emulation.setCPUThrottlingRate', { rate: STRESS_CPU_RATE });

  const delayedAssetPattern = /\.(css|woff2?|ttf|otf)(\?|$)/i;
  const delayedRouteHandler = async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    await route.continue();
  };

  await page.route(delayedAssetPattern, delayedRouteHandler);

  return async () => {
    await page.unroute(delayedAssetPattern, delayedRouteHandler);
    await session.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    await session.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1,
      connectionType: 'none',
    });
    await session.send('Network.disable');
    await session.detach();
  };
}

async function measureRoute({ context, route, mode }) {
  const page = await context.newPage();
  await page.addInitScript(layoutShiftObserverInitScript());

  let cleanupStress = null;
  try {
    if (mode === 'stress') {
      cleanupStress = await applyStressProfile(page);
    }

    const response = await page.goto(route, {
      waitUntil: 'networkidle',
      timeout: 120000,
    });

    if (!response || response.status() >= 400) {
      return {
        route,
        mode,
        status: response ? response.status() : 0,
        error: 'navigation failed',
        cls: null,
        maxShift: null,
        lcp: null,
        inpProxy: null,
        entries: [],
      };
    }

    await page.waitForTimeout(1200);
    await page.mouse.click(420, 240);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.type('12');
    await page.waitForTimeout(300);
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(250);
    await page.mouse.wheel(0, -1200);
    await page.waitForTimeout(900);

    const metrics = await page.evaluate(() => {
      const payload = window.__clsGuard || { cls: 0, maxShift: 0, entries: [] };
      if (window.__clsObserver) {
        window.__clsObserver.disconnect();
      }
      if (window.__lcpObserver) {
        window.__lcpObserver.disconnect();
      }
      if (window.__inpObserver) {
        window.__inpObserver.disconnect();
      }
      return {
        cls: Number(payload.cls || 0),
        maxShift: Number(payload.maxShift || 0),
        lcp: Number(payload.lcp || 0),
        inpProxy: Number(payload.inpProxy || 0),
        entries: Array.isArray(payload.entries) ? payload.entries : [],
      };
    });

    return {
      route,
      mode,
      status: response.status(),
      cls: Number(metrics.cls.toFixed(4)),
      maxShift: Number(metrics.maxShift.toFixed(4)),
      lcp: Number(metrics.lcp.toFixed(2)),
      inpProxy: Number(metrics.inpProxy.toFixed(2)),
      entries: metrics.entries,
    };
  } catch (error) {
    return {
      route,
      mode,
      status: 0,
      error: error instanceof Error ? error.message : String(error),
      cls: null,
      maxShift: null,
      lcp: null,
      inpProxy: null,
      entries: [],
    };
  } finally {
    if (cleanupStress) {
      await cleanupStress();
    }
    await page.close();
  }
}

test.describe('Global CWV guard — all calculator routes', () => {
  test('UR-TEST-005/006: all calculator routes must satisfy CLS/LCP/INP thresholds in normal and stress modes', async ({ browser, baseURL }) => {
    test.setTimeout(30 * 60 * 1000);

    const routes = await loadCalculatorRoutes();
    expect(routes.length).toBeGreaterThan(0);

    const maxRoutes = Number.parseInt(process.env.CLS_GUARD_MAX_ROUTES || '', 10);
    const includeFilters = resolveRouteFilters('CLS_GUARD_ROUTE_INCLUDE');
    const excludeFilters = resolveRouteFilters('CLS_GUARD_ROUTE_EXCLUDE');

    let selectedRoutes = routes;
    if (includeFilters.length > 0) {
      selectedRoutes = routes.filter((route) =>
        includeFilters.some((filterValue) => route.includes(filterValue))
      );
    }
    if (excludeFilters.length > 0) {
      selectedRoutes = selectedRoutes.filter(
        (route) => !excludeFilters.some((filterValue) => route.includes(filterValue))
      );
    }
    if (Number.isFinite(maxRoutes) && maxRoutes > 0) {
      selectedRoutes = selectedRoutes.slice(0, maxRoutes);
    }

    expect(selectedRoutes.length).toBeGreaterThan(0);

    const context = await browser.newContext({
      baseURL,
      viewport: { width: 1365, height: 940 },
    });

    const results = [];

    try {
      for (const route of selectedRoutes) {
        for (const mode of ['normal', 'stress']) {
          const result = await measureRoute({ context, route, mode });
          results.push(result);
        }
      }
    } finally {
      await context.close();
    }

    const violations = results.filter((result) => {
      if (result.error) {
        return true;
      }
      if (
        typeof result.cls !== 'number' ||
        typeof result.maxShift !== 'number' ||
        typeof result.lcp !== 'number' ||
        typeof result.inpProxy !== 'number'
      ) {
        return true;
      }
      const thresholds = resolveThresholds(result.route, result.mode);
      return (
        result.cls > thresholds.cls ||
        result.maxShift > thresholds.maxShift ||
        result.lcp > thresholds.lcp ||
        result.inpProxy > thresholds.inpProxy
      );
    });

    const summary = {
      generatedAt: new Date().toISOString(),
      thresholds: {
        clsP0: CLS_THRESHOLD,
        singleShiftP0: SHIFT_THRESHOLD,
        lcpP0Ms: LCP_THRESHOLD_MS,
        inpProxyP0Ms: INP_PROXY_THRESHOLD_MS,
        stressSingleShiftRouteOverrides: STRESS_SHIFT_ROUTE_OVERRIDES,
      },
      routeCount: selectedRoutes.length,
      includeFilters,
      excludeFilters,
      modeCountPerRoute: 2,
      totalChecks: results.length,
      violationCount: violations.length,
      violations,
      results,
    };

    await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });
    await fs.writeFile(REPORT_PATH, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

    const debugMessage = violations
      .slice(0, 10)
      .map(
        (entry) =>
          `${entry.route} [${entry.mode}] cls=${entry.cls} maxShift=${entry.maxShift} lcp=${entry.lcp} inpProxy=${entry.inpProxy} error=${entry.error || 'none'}`
      )
      .join('\n');

    expect(
      violations,
      `CWV guard failed for ${violations.length} route checks. Report: ${REPORT_PATH}\n${debugMessage}`
    ).toEqual([]);
  });
});
