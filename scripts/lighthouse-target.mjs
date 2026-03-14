#!/usr/bin/env node

import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawn, spawnSync } from 'node:child_process';
import { JSDOM } from 'jsdom';
import { acquirePortLease, releasePortLease } from './ports.mjs';

const ROOT = process.cwd();
const POLICY_PATH = path.join(ROOT, 'config', 'testing', 'lighthouse_policy.json');

const DEFAULTS = {
  outputDir: 'test-results/lighthouse',
  preset: 'mobile',
  timeoutMs: 3000,
};

function resolveLighthousePreset(inputPreset) {
  const normalized = String(inputPreset || '').trim().toLowerCase();
  if (normalized === 'mobile') {
    return { publicPreset: 'mobile', lighthousePreset: 'perf', isDesktop: false };
  }
  if (normalized === 'desktop') {
    return { publicPreset: 'desktop', lighthousePreset: 'desktop', isDesktop: true };
  }
  throw new Error(`Invalid Lighthouse preset: ${inputPreset}. Use mobile or desktop.`);
}

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

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

function parseBoolean(rawValue) {
  if (typeof rawValue !== 'string') {
    return null;
  }
  const normalized = rawValue.trim().toLowerCase();
  if (!normalized) return null;
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return null;
}

function parsePositiveInteger(rawValue) {
  const parsed = Number.parseInt(String(rawValue || '').trim(), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function ensureServer(baseUrl, timeoutMs) {
  const url = new URL('/', baseUrl).href;
  try {
    const response = await fetchWithTimeout(url, timeoutMs);
    if (response.ok) return null;
  } catch {
    // ignored
  }

  const port = new URL(baseUrl).port || '8000';
  const server = spawn('python3', ['-m', 'http.server', port, '--directory', 'public'], {
    stdio: 'ignore',
  });

  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetchWithTimeout(url, 500);
      if (response.ok) return server;
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  server.kill();
  throw new Error(`Unable to start local server at ${url}`);
}

function buildChromeFlags(profileDir) {
  const baseFlags = [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-features=Translate,BackForwardCache',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${profileDir}`,
    '--window-size=1365,940',
  ];

  const extra = (process.env.LH_CHROME_FLAGS || '').trim();
  if (extra) {
    return `${baseFlags.join(' ')} ${extra}`.trim();
  }
  return baseFlags.join(' ');
}

function numberOrNull(value) {
  return Number.isFinite(value) ? value : null;
}

function toScore(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }
  return Math.round(value * 100);
}

function median(values) {
  const valid = values.filter((value) => typeof value === 'number' && Number.isFinite(value));
  if (!valid.length) {
    return null;
  }
  valid.sort((a, b) => a - b);
  const mid = Math.floor(valid.length / 2);
  if (valid.length % 2 === 0) {
    return (valid[mid - 1] + valid[mid]) / 2;
  }
  return valid[mid];
}

function extractLcpSelector(report) {
  const audit = report?.audits?.['largest-contentful-paint-element'];
  const items = audit?.details?.items ?? [];
  if (!items.length) return null;
  const first = items[0];
  if (first?.items?.length) {
    return first.items[0]?.node?.selector ?? null;
  }
  return first?.node?.selector ?? null;
}

function extractRunSnapshot(report) {
  const renderBlocking = report?.audits?.['render-blocking-resources'];
  return {
    categories: {
      performance: toScore(report?.categories?.performance?.score),
      accessibility: toScore(report?.categories?.accessibility?.score),
      bestPractices: toScore(report?.categories?.['best-practices']?.score),
    },
    metrics: {
      lcpMs: numberOrNull(report?.audits?.['largest-contentful-paint']?.numericValue),
      cls: numberOrNull(report?.audits?.['cumulative-layout-shift']?.numericValue),
      inpMs: numberOrNull(
        report?.audits?.['interaction-to-next-paint']?.numericValue ??
          report?.audits?.['max-potential-fid']?.numericValue
      ),
      renderBlockingSavingsMs: numberOrNull(
        renderBlocking?.details?.overallSavingsMs ?? renderBlocking?.numericValue
      ),
      lcpElementSelector: extractLcpSelector(report),
    },
    security: {
      isOnHttpsScore: numberOrNull(report?.audits?.['is-on-https']?.score),
    },
    warnings: Array.isArray(report?.warnings) ? report.warnings : [],
  };
}

function pickLcpSelector(runResults, aggregatedLcp) {
  if (!runResults.length) {
    return null;
  }
  if (typeof aggregatedLcp !== 'number' || !Number.isFinite(aggregatedLcp)) {
    return runResults[0]?.metrics?.lcpElementSelector ?? null;
  }

  let best = null;
  runResults.forEach((item) => {
    const lcp = item?.metrics?.lcpMs;
    if (typeof lcp !== 'number' || !Number.isFinite(lcp)) {
      return;
    }
    const delta = Math.abs(lcp - aggregatedLcp);
    if (!best || delta < best.delta) {
      best = { delta, selector: item?.metrics?.lcpElementSelector ?? null };
    }
  });

  return best?.selector ?? runResults[0]?.metrics?.lcpElementSelector ?? null;
}

async function runLighthouse({
  url,
  outputPath,
  chromePath,
  categories,
  slugFolder,
  lighthousePreset,
  isDesktop,
  policy,
  desktopThrottlingMode,
}) {
  const profileDir = `/tmp/lighthouse-target-${slugFolder}-${Date.now()}`;
  const chromeFlags = buildChromeFlags(profileDir);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, '', 'utf8');
  const args = [
    'lighthouse',
    url,
    `--only-categories=${categories}`,
    `--preset=${lighthousePreset}`,
    '--chrome-flags',
    chromeFlags,
    '--output=json',
    '--quiet',
  ];

  if (isDesktop) {
    args.push(`--form-factor=${policy.desktopPolicy.formFactor || 'desktop'}`);
    if (policy.desktopPolicy.screenEmulationDisabled) {
      args.push('--screenEmulation.disabled');
    }
    if (desktopThrottlingMode === 'devtools') {
      args.push('--throttling-method=devtools');
    }
  } else {
    args.push(`--form-factor=${policy.mobilePolicy.formFactor || 'mobile'}`);
    if (policy.mobilePolicy.throttlingMethod) {
      args.push(`--throttling-method=${policy.mobilePolicy.throttlingMethod}`);
    }
  }

  const run = spawnSync('npx', args, {
    cwd: ROOT,
    env: {
      ...process.env,
      CHROME_PATH: chromePath,
    },
    encoding: 'utf8',
    timeout: 240000,
    maxBuffer: 8 * 1024 * 1024,
  });

  if (run.status !== 0) {
    const errorLogPath = outputPath.replace(/\.json$/, '.error.log');
    await fs.mkdir(path.dirname(errorLogPath), { recursive: true });
    const errorPayload = [
      `command: npx ${args.join(' ')}`,
      `exitCode: ${run.status ?? 'null'}`,
      `signal: ${run.signal ?? 'none'}`,
      '',
      'stdout:',
      run.stdout ?? '',
      '',
      'stderr:',
      run.stderr ?? '',
    ].join('\n');
    await fs.writeFile(errorLogPath, errorPayload, 'utf8');
    throw new Error(`Lighthouse failed. See ${errorLogPath}`);
  }

  const raw = run.stdout ?? '';
  await fs.writeFile(outputPath, raw, 'utf8');
  return JSON.parse(raw);
}

async function scanMixedContent(url, timeoutMs) {
  const response = await fetchWithTimeout(url, timeoutMs);
  const html = await response.text();
  const dom = new JSDOM(html, { url });
  const doc = dom.window.document;
  const offenders = [];
  const candidates = [
    ...doc.querySelectorAll(
      'link[href], script[src], img[src], iframe[src], source[src], audio[src], video[src], embed[src], object[data]'
    ),
  ];

  for (const el of candidates) {
    const attr = el.hasAttribute('href') ? 'href' : el.hasAttribute('src') ? 'src' : 'data';
    const value = el.getAttribute(attr);
    if (!value) continue;

    if (
      value.startsWith('http://') &&
      !value.startsWith('http://localhost') &&
      !value.startsWith('http://127.0.0.1')
    ) {
      offenders.push({ tag: el.tagName.toLowerCase(), attr, value });
    }
  }

  return {
    mixedContentFound: offenders.length > 0,
    offenders,
  };
}

async function loadPolicy() {
  if (!fsSync.existsSync(POLICY_PATH)) {
    throw new Error(`Missing policy file: ${POLICY_PATH}`);
  }

  const raw = JSON.parse(await fs.readFile(POLICY_PATH, 'utf8'));
  if (!raw?.modes || !raw?.defaults || !raw?.allowedOverrides) {
    throw new Error(`Invalid policy structure: ${POLICY_PATH}`);
  }

  return raw;
}

function resolvePolicy(policy) {
  const overridesApplied = [];
  const cliOverridesApplied = [];

  let mode = policy.defaults?.mode || 'fast';
  if (process.env.LH_MODE && policy.modes?.[process.env.LH_MODE]) {
    mode = process.env.LH_MODE;
    overridesApplied.push('LH_MODE');
  }

  const modeFromCli = getArgValue('--mode');
  if (modeFromCli) {
    if (!policy.modes?.[modeFromCli]) {
      throw new Error(`Invalid --mode value: ${modeFromCli}`);
    }
    mode = modeFromCli;
    cliOverridesApplied.push('--mode');
  }

  const modeConfig = policy.modes[mode] || {};
  let categories = modeConfig.categories ?? policy.defaults.categories ?? 'performance';
  let scanMixedContent =
    modeConfig.scanMixedContent ?? policy.defaults.scanMixedContent ?? false;
  let assumeServerRunning =
    modeConfig.assumeServerRunning ?? policy.defaults.assumeServerRunning ?? false;
  let runs = modeConfig.runs ?? policy.defaults.runs ?? 1;
  let warmupRun = modeConfig.warmupRun ?? policy.defaults.warmupRun ?? false;

  if (policy.allowedOverrides.LH_CATEGORIES && (process.env.LH_CATEGORIES || '').trim()) {
    categories = process.env.LH_CATEGORIES.trim();
    overridesApplied.push('LH_CATEGORIES');
  }

  if (policy.allowedOverrides.LH_SCAN_MIXED_CONTENT) {
    const parsed = parseBoolean(process.env.LH_SCAN_MIXED_CONTENT);
    if (parsed !== null) {
      scanMixedContent = parsed;
      overridesApplied.push('LH_SCAN_MIXED_CONTENT');
    }
  }

  if (policy.allowedOverrides.LH_ASSUME_SERVER_RUNNING) {
    const parsed = parseBoolean(process.env.LH_ASSUME_SERVER_RUNNING);
    if (parsed !== null) {
      assumeServerRunning = parsed;
      overridesApplied.push('LH_ASSUME_SERVER_RUNNING');
    }
  }

  if (policy.allowedOverrides.LH_RUNS) {
    const parsed = parsePositiveInteger(process.env.LH_RUNS);
    if (parsed !== null) {
      runs = parsed;
      overridesApplied.push('LH_RUNS');
    }
  }

  if (policy.allowedOverrides.LH_WARMUP_RUN) {
    const parsed = parseBoolean(process.env.LH_WARMUP_RUN);
    if (parsed !== null) {
      warmupRun = parsed;
      overridesApplied.push('LH_WARMUP_RUN');
    }
  }

  let desktopThrottlingMode = policy.desktopPolicy?.defaultThrottling || 'native';
  if (
    policy.allowedOverrides.LH_DESKTOP_THROTTLING &&
    policy.desktopPolicy?.allowDevtoolsOverride
  ) {
    const requested = (process.env.LH_DESKTOP_THROTTLING || '').trim().toLowerCase();
    if (requested === 'devtools' || requested === 'native') {
      desktopThrottlingMode = requested;
      overridesApplied.push('LH_DESKTOP_THROTTLING');
    }
  }

  return {
    mode,
    categories,
    scanMixedContent,
    assumeServerRunning,
    runs: Math.max(1, Number(runs) || 1),
    warmupRun: Boolean(warmupRun),
    desktopThrottlingMode,
    overridesApplied,
    cliOverridesApplied,
  };
}

async function main() {
  const routeArg = getArgValue('--route');
  const targetRoute = normalizeRoute(process.env.TARGET_ROUTE || routeArg);
  if (!targetRoute) {
    throw new Error('TARGET_ROUTE (or --route) is required.');
  }

  const chromePath = process.env.CHROME_PATH;
  if (!chromePath) {
    throw new Error('CHROME_PATH is required for Lighthouse.');
  }

  const policy = await loadPolicy();
  const resolvedPolicy = resolvePolicy(policy);

  const explicitBaseUrl = process.env.LH_BASE_URL || null;
  let lease = null;
  const baseUrl = explicitBaseUrl
    ? explicitBaseUrl
    : (() => {
        lease = acquirePortLease({
          group: 'lighthouse',
          owner: 'lighthouse-target',
        });
        if (lease.conflict) {
          console.warn(
            `[ports] preferred port conflict fallback: pid=${lease.conflict.pid ?? 'unknown'} ` +
              `process=${lease.conflict.process ?? 'unknown'} selected=${lease.port}`
          );
        }
        return `http://localhost:${lease.port}`;
      })();
  const outputDir = path.resolve(ROOT, process.env.LH_OUTPUT_DIR || DEFAULTS.outputDir);
  const presetInput = process.env.LH_PRESET || getArgValue('--preset') || DEFAULTS.preset;
  const { publicPreset: preset, lighthousePreset, isDesktop } = resolveLighthousePreset(presetInput);

  const url = new URL(targetRoute, baseUrl).href;
  const slugFolder = slugify(targetRoute);

  await fs.mkdir(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${slugFolder}.${preset}.json`);
  const summaryPath = path.join(outputDir, `${slugFolder}.${preset}.summary.json`);
  const warmupPath = path.join(outputDir, `${slugFolder}.${preset}.warmup.json`);

  let server = null;
  try {
    if (!resolvedPolicy.assumeServerRunning) {
      server = await ensureServer(baseUrl, DEFAULTS.timeoutMs);
    }

    if (resolvedPolicy.warmupRun) {
      await runLighthouse({
        url,
        outputPath: warmupPath,
        chromePath,
        categories: resolvedPolicy.categories,
        slugFolder,
        lighthousePreset,
        isDesktop,
        policy,
        desktopThrottlingMode: resolvedPolicy.desktopThrottlingMode,
      });
    }

    const runResults = [];
    const runReportPaths = [];

    for (let index = 1; index <= resolvedPolicy.runs; index += 1) {
      const runPath =
        resolvedPolicy.runs === 1
          ? outputPath
          : path.join(outputDir, `${slugFolder}.${preset}.run${index}.json`);
      const report = await runLighthouse({
        url,
        outputPath: runPath,
        chromePath,
        categories: resolvedPolicy.categories,
        slugFolder,
        lighthousePreset,
        isDesktop,
        policy,
        desktopThrottlingMode: resolvedPolicy.desktopThrottlingMode,
      });

      const snapshot = extractRunSnapshot(report);
      runResults.push({ index, reportPath: path.relative(ROOT, runPath), ...snapshot });
      runReportPaths.push(runPath);
    }

    if (resolvedPolicy.runs > 1 && runReportPaths.length) {
      await fs.copyFile(runReportPaths[0], outputPath);
    }

    const mixedContent = resolvedPolicy.scanMixedContent
      ? await scanMixedContent(url, DEFAULTS.timeoutMs)
      : { mixedContentFound: null, offenders: [] };

    const aggregation = resolvedPolicy.runs > 1 ? 'median' : 'single';

    const aggregatedCategories = {
      performance: aggregation === 'median'
        ? median(runResults.map((item) => item.categories.performance))
        : runResults[0]?.categories?.performance ?? null,
      accessibility: aggregation === 'median'
        ? median(runResults.map((item) => item.categories.accessibility))
        : runResults[0]?.categories?.accessibility ?? null,
      bestPractices: aggregation === 'median'
        ? median(runResults.map((item) => item.categories.bestPractices))
        : runResults[0]?.categories?.bestPractices ?? null,
    };

    const aggregatedMetrics = {
      lcpMs:
        aggregation === 'median'
          ? median(runResults.map((item) => item.metrics.lcpMs))
          : runResults[0]?.metrics?.lcpMs ?? null,
      cls:
        aggregation === 'median'
          ? median(runResults.map((item) => item.metrics.cls))
          : runResults[0]?.metrics?.cls ?? null,
      inpMs:
        aggregation === 'median'
          ? median(runResults.map((item) => item.metrics.inpMs))
          : runResults[0]?.metrics?.inpMs ?? null,
      renderBlockingSavingsMs:
        aggregation === 'median'
          ? median(runResults.map((item) => item.metrics.renderBlockingSavingsMs))
          : runResults[0]?.metrics?.renderBlockingSavingsMs ?? null,
    };

    const lcpElementSelector = pickLcpSelector(runResults, aggregatedMetrics.lcpMs);

    const aggregatedSecurityScore =
      aggregation === 'median'
        ? median(runResults.map((item) => item.security.isOnHttpsScore))
        : runResults[0]?.security?.isOnHttpsScore ?? null;

    const warnings = [...new Set(runResults.flatMap((item) => item.warnings || []))];

    const summary = {
      url,
      route: targetRoute,
      preset,
      generatedAt: new Date().toISOString(),
      aggregation,
      aggregationType: aggregation,
      categories: {
        performance: aggregatedCategories.performance,
        accessibility: aggregatedCategories.accessibility,
        bestPractices: aggregatedCategories.bestPractices,
      },
      metrics: {
        lcpMs: aggregatedMetrics.lcpMs,
        cls: aggregatedMetrics.cls,
        inpMs: aggregatedMetrics.inpMs,
        renderBlockingSavingsMs: aggregatedMetrics.renderBlockingSavingsMs,
        lcpElementSelector,
      },
      runPolicy: {
        mode: resolvedPolicy.mode,
        runs: resolvedPolicy.runs,
        warmup: resolvedPolicy.warmupRun,
        categories: resolvedPolicy.categories,
        resolved: {
          policyPath: path.relative(ROOT, POLICY_PATH),
          policyVersion: policy.version,
          mode: resolvedPolicy.mode,
          categories: resolvedPolicy.categories,
          scanMixedContent: resolvedPolicy.scanMixedContent,
          assumeServerRunning: resolvedPolicy.assumeServerRunning,
          runs: resolvedPolicy.runs,
          warmupRun: resolvedPolicy.warmupRun,
          mobilePolicy: {
            formFactor: policy.mobilePolicy?.formFactor || 'mobile',
            throttlingMethod: policy.mobilePolicy?.throttlingMethod || 'devtools',
          },
          desktopPolicy: {
            formFactor: policy.desktopPolicy?.formFactor || 'desktop',
            screenEmulationDisabled: Boolean(policy.desktopPolicy?.screenEmulationDisabled),
            throttlingMode: resolvedPolicy.desktopThrottlingMode,
          },
          overridesApplied: resolvedPolicy.overridesApplied,
          cliOverridesApplied: resolvedPolicy.cliOverridesApplied,
        },
      },
      desktopPolicyMode:
        resolvedPolicy.desktopThrottlingMode === 'devtools' ? 'devtools-override' : 'native',
      desktopThrottlingApplied:
        isDesktop && resolvedPolicy.desktopThrottlingMode === 'devtools',
      runs: runResults,
      security: {
        isOnHttpsScore: aggregatedSecurityScore,
        mixedContentFound: mixedContent.mixedContentFound,
        mixedContentOffenders: mixedContent.offenders,
      },
      warnings,
    };

    await fs.mkdir(path.dirname(summaryPath), { recursive: true });
    await fs.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    console.log(`Lighthouse summary written to ${summaryPath}`);
  } finally {
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
  console.error(error.message || error);
  process.exit(1);
});
