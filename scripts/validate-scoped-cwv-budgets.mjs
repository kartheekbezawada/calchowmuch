#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { chromium, devices } from 'playwright';
import { getCalculatorScope } from './test-scope-resolver.mjs';
import { acquirePortLease, releasePortLease } from './ports.mjs';

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'config', 'testing', 'CWV_SCOPED_BUDGETS.json');
const REPORT_ROOT = path.join(ROOT, 'test-results', 'performance', 'scoped-cwv');

function fail(message) {
  throw new Error(message);
}

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    fail(`Missing scoped CWV budget config: ${CONFIG_PATH}`);
  }

  const parsed = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  if (!parsed?.thresholds || !parsed?.profiles) {
    fail('Invalid CWV_SCOPED_BUDGETS.json: thresholds and profiles are required.');
  }
  return parsed;
}

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

async function fetchWithTimeout(url, timeoutMs = 3000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function ensureServer(baseUrl) {
  const healthUrl = new URL('/', baseUrl).href;
  try {
    const response = await fetchWithTimeout(healthUrl);
    if (response.ok) {
      return null;
    }
  } catch {
    // start local server below
  }

  const port = new URL(baseUrl).port || '8001';
  const server = spawn('python3', ['-m', 'http.server', port, '--directory', 'public'], {
    cwd: ROOT,
    stdio: 'ignore',
  });

  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    try {
      const response = await fetchWithTimeout(healthUrl, 800);
      if (response.ok) {
        return server;
      }
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  server.kill();
  fail(`Unable to start local server at ${baseUrl}`);
}

function installObservers() {
  return () => {
    window.__scopedCwv = {
      cls: 0,
      lcp: 0,
      shifts: [],
    };
    const maxShiftEntries = 20;

    const nodeToSelector = (node) => {
      if (!node || node.nodeType !== Node.ELEMENT_NODE) {
        return '';
      }
      const el = node;
      if (el.id) {
        return `#${el.id}`;
      }
      const className =
        typeof el.className === 'string'
          ? el.className
              .trim()
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .join('.')
          : '';
      if (className) {
        return `${el.tagName.toLowerCase()}.${className}`;
      }
      return el.tagName.toLowerCase();
    };

    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            const value = Number(entry.value || 0);
            window.__scopedCwv.cls += value;
            const sourceSelectors = Array.isArray(entry.sources)
              ? entry.sources
                  .map((source) => nodeToSelector(source?.node))
                  .filter(Boolean)
                  .slice(0, 3)
              : [];
            if (window.__scopedCwv.shifts.length < maxShiftEntries) {
              window.__scopedCwv.shifts.push({
                value: Number(value.toFixed(4)),
                startTime: Number((entry.startTime || 0).toFixed(2)),
                sources: sourceSelectors,
              });
            }
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      window.__scopedClsObserver = clsObserver;
    } catch {
      window.__scopedClsObserver = null;
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
          window.__scopedCwv.lcp = Math.max(window.__scopedCwv.lcp, value);
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      window.__scopedLcpObserver = lcpObserver;
    } catch {
      window.__scopedLcpObserver = null;
    }
  };
}

function resolveThresholds(config, route) {
  const routeOverride = config.routeOverrides?.[route]?.thresholds || {};
  return {
    clsMax: Number(routeOverride.clsMax ?? config.thresholds.clsMax),
    lcpMaxMs: Number(routeOverride.lcpMaxMs ?? config.thresholds.lcpMaxMs),
    blockingCssDurationMaxMs: Number(
      routeOverride.blockingCssDurationMaxMs ?? config.thresholds.blockingCssDurationMaxMs
    ),
    blockingCssMaxRequests: Number(
      routeOverride.blockingCssMaxRequests ?? config.thresholds.blockingCssMaxRequests
    ),
  };
}

function extractBlockingCssFromHtml(route) {
  const routePath =
    route === '/'
      ? path.join(ROOT, 'public', 'index.html')
      : path.join(ROOT, 'public', route.replace(/^\/+/, ''), 'index.html');
  if (!fs.existsSync(routePath)) {
    fail(`Missing generated route HTML for blocking CSS check: ${routePath}`);
  }

  const html = fs.readFileSync(routePath, 'utf8');
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const head = headMatch ? headMatch[1] : html;
  const headWithoutNoscript = head.replace(/<noscript[\s\S]*?<\/noscript>/gi, '');
  const linkTags = [...headWithoutNoscript.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
  const blockingPaths = [];

  for (const tag of linkTags) {
    const relMatch = tag.match(/\brel\s*=\s*['"]([^'"]+)['"]/i);
    if (!relMatch || relMatch[1].toLowerCase() !== 'stylesheet') {
      continue;
    }
    const hrefMatch = tag.match(/\bhref\s*=\s*['"]([^'"]+)['"]/i);
    if (!hrefMatch) {
      continue;
    }
    const mediaMatch = tag.match(/\bmedia\s*=\s*['"]([^'"]+)['"]/i);
    const media = mediaMatch ? mediaMatch[1].trim().toLowerCase() : '';
    if (media && media !== 'all' && media !== 'screen') {
      continue;
    }
    try {
      blockingPaths.push(new URL(hrefMatch[1], 'http://localhost').pathname);
    } catch {
      blockingPaths.push(hrefMatch[1]);
    }
  }

  return [...new Set(blockingPaths)];
}

async function collectMetrics(page, blockingCssPaths) {
  return page.evaluate(() => {
    if (window.__scopedClsObserver) {
      window.__scopedClsObserver.disconnect();
    }
    if (window.__scopedLcpObserver) {
      window.__scopedLcpObserver.disconnect();
    }

    const resourceEntries = performance
      .getEntriesByType('resource')
      .filter((entry) => {
        if (!entry.name || !entry.name.includes('.css')) {
          return false;
        }
        try {
          const pathname = new URL(entry.name).pathname;
          return window.__blockingCssPaths.includes(pathname);
        } catch {
          return false;
        }
      })
      .map((entry) => {
        let pathname = entry.name;
        try {
          pathname = new URL(entry.name).pathname;
        } catch {
          pathname = entry.name;
        }
        return {
          href: pathname,
          durationMs: Number((entry.duration || 0).toFixed(2)),
          transferSize: Number(entry.transferSize || 0),
        };
      });

    return {
      cls: Number((window.__scopedCwv?.cls || 0).toFixed(4)),
      lcpMs: Number((window.__scopedCwv?.lcp || 0).toFixed(2)),
      topShifts: (window.__scopedCwv?.shifts || [])
        .slice()
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
      blockingCss: resourceEntries,
      blockingCssDurationMs: Number(
        resourceEntries.reduce((sum, entry) => sum + Number(entry.durationMs || 0), 0).toFixed(2)
      ),
      blockingCssRequests: window.__blockingCssPaths.length,
    };
  });
}

async function runProfile(browser, baseUrl, route, profileName, profileConfig) {
  const isMobile = profileConfig.kind === 'mobile';
  const contextOptions = isMobile
    ? { ...devices[profileConfig.device || 'Pixel 5'] }
    : {
        viewport: profileConfig.viewport || { width: 1365, height: 940 },
        isMobile: false,
        hasTouch: false,
      };

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  await page.addInitScript(installObservers());
  const blockingCssPaths = extractBlockingCssFromHtml(route);
  await page.addInitScript((paths) => {
    window.__blockingCssPaths = Array.isArray(paths) ? paths : [];
  }, blockingCssPaths);

  const session = await context.newCDPSession(page);
  await session.send('Network.enable');
  await session.send('Network.setCacheDisabled', { cacheDisabled: profileConfig.cacheDisabled !== false });
  await session.send('Network.emulateNetworkConditions', profileConfig.network);
  await session.send('Emulation.setCPUThrottlingRate', {
    rate: Number(profileConfig.cpuThrottlingRate || 1),
  });

  try {
    const targetUrl = new URL(route, baseUrl).href;
    const response = await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 120000 });
    if (!response || !response.ok()) {
      fail(`[${profileName}] navigation failed for ${route}`);
    }

    await page.waitForTimeout(1400);
    const metrics = await collectMetrics(page, blockingCssPaths);
    return {
      profile: profileName,
      route,
      url: targetUrl,
      metrics,
      profileConfig,
      blockingCssPaths,
    };
  } finally {
    await session.send('Emulation.setCPUThrottlingRate', { rate: 1 }).catch(() => {});
    await session.send('Network.disable').catch(() => {});
    await session.detach().catch(() => {});
    await page.close().catch(() => {});
    await context.close().catch(() => {});
  }
}

function evaluateProfile(result, thresholds) {
  const failures = [];
  const { metrics } = result;

  if (metrics.cls > thresholds.clsMax) {
    failures.push(`CLS ${metrics.cls} > ${thresholds.clsMax}`);
  }
  if (metrics.lcpMs > thresholds.lcpMaxMs) {
    failures.push(`LCP ${metrics.lcpMs}ms > ${thresholds.lcpMaxMs}ms`);
  }
  if (metrics.blockingCssDurationMs > thresholds.blockingCssDurationMaxMs) {
    failures.push(
      `Blocking CSS duration ${metrics.blockingCssDurationMs}ms > ${thresholds.blockingCssDurationMaxMs}ms`
    );
  }
  if (
    Number.isFinite(thresholds.blockingCssMaxRequests) &&
    thresholds.blockingCssMaxRequests >= 0 &&
    metrics.blockingCssRequests > thresholds.blockingCssMaxRequests
  ) {
    failures.push(
      `Blocking CSS requests ${metrics.blockingCssRequests} > ${thresholds.blockingCssMaxRequests}`
    );
  }

  return {
    ...result,
    pass: failures.length === 0,
    failures,
  };
}

async function main() {
  const clusterId = process.env.CLUSTER;
  const calcId = process.env.CALC;
  if (!clusterId || !calcId) {
    fail('CLUSTER and CALC are required for scoped CWV budget validation.');
  }

  const config = loadConfig();
  const scope = getCalculatorScope(clusterId, calcId);
  const route = normalizeRoute(scope?.calculator?.route);
  if (!route) {
    fail(`Missing route mapping for CLUSTER=${clusterId} CALC=${calcId}`);
  }

  const thresholds = resolveThresholds(config, route);
  const explicitBaseUrl = process.env.SCOPED_CWV_BASE_URL || null;
  let lease = null;
  const baseUrl = explicitBaseUrl
    ? explicitBaseUrl
    : (() => {
        lease = acquirePortLease({
          group: 'scoped-cwv',
          owner: `scoped-cwv:${clusterId}:${calcId}`,
        });
        if (lease.conflict) {
          console.warn(
            `[ports] preferred port conflict fallback: pid=${lease.conflict.pid ?? 'unknown'} ` +
              `process=${lease.conflict.process ?? 'unknown'} selected=${lease.port}`
          );
        }
        return `http://localhost:${lease.port}`;
      })();
  const server = await ensureServer(baseUrl);

  const browser = await chromium.launch({ headless: true });
  try {
    const profileResults = [];
    for (const [profileName, profileConfig] of Object.entries(config.profiles)) {
      const result = await runProfile(browser, baseUrl, route, profileName, profileConfig);
      profileResults.push(evaluateProfile(result, thresholds));
    }

    const summary = {
      generatedAt: new Date().toISOString(),
      clusterId,
      calcId,
      route,
      baseUrl,
      thresholds,
      profiles: profileResults,
      pass: profileResults.every((item) => item.pass),
    };

    const reportDir = path.join(REPORT_ROOT, clusterId);
    fs.mkdirSync(reportDir, { recursive: true });
    const reportPath = path.join(reportDir, `${calcId}.json`);
    fs.writeFileSync(reportPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    console.log(`Scoped CWV budget report written to ${path.relative(ROOT, reportPath)}`);

    const failures = profileResults.flatMap((item) =>
      item.failures.map((reason) => `[${item.profile}] ${reason}`)
    );

    if (failures.length) {
      fail(
        `Scoped CWV budgets failed for CLUSTER=${clusterId} CALC=${calcId}\n${failures
          .map((line) => `- ${line}`)
          .join('\n')}`
      );
    }
  } finally {
    await browser.close();
    if (server) {
      server.kill();
    }
    if (lease?.leaseId) {
      try {
        releasePortLease({ leaseId: lease.leaseId });
      } catch {
        // best-effort release
      }
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
