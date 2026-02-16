#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawn, spawnSync } from 'node:child_process';
import { JSDOM } from 'jsdom';

const DEFAULTS = {
  baseUrl: 'http://localhost:8000',
  outputDir: 'test-results/lighthouse',
  categories: 'performance,accessibility,best-practices',
  waitMs: 800,
  timeoutMs: 3000,
  mutationWaitMs: 2000,
};

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

async function ensureServer(baseUrl) {
  const url = new URL('/', baseUrl).href;
  try {
    const response = await fetchWithTimeout(url, DEFAULTS.timeoutMs);
    if (response.ok) return null;
  } catch {
    // ignored
  }

  const port = new URL(baseUrl).port || '8000';
  const server = spawn('python3', ['-m', 'http.server', port, '--directory', 'public'], {
    stdio: 'ignore',
  });

  const start = Date.now();
  while (Date.now() - start < DEFAULTS.timeoutMs) {
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
    `--user-data-dir=${profileDir}`,
    '--window-size=1365,940',
  ];
  const extra = (process.env.LH_CHROME_FLAGS || '').trim();
  if (extra) {
    return `${baseFlags.join(' ')} ${extra}`.trim();
  }
  return baseFlags.join(' ');
}

async function runLighthouse({ url, outputPath, chromePath, categories, slugFolder }) {
  const profileDir = `/tmp/lighthouse-target-${slugFolder}-${Date.now()}`;
  const chromeFlags = buildChromeFlags(profileDir);
  const args = [
    'lighthouse',
    url,
    `--only-categories=${categories}`,
    '--chrome-flags',
    chromeFlags,
    '--output=json',
    '--output-path',
    outputPath,
    '--quiet',
  ];

  const run = spawnSync('npx', args, {
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

  const raw = await fs.readFile(outputPath, 'utf8');
  return JSON.parse(raw);
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

async function scanMixedContent(url) {
  const response = await fetchWithTimeout(url, DEFAULTS.timeoutMs);
  const html = await response.text();
  const dom = new JSDOM(html, { url });
  const doc = dom.window.document;
  const offenders = [];
  const candidates = [
    ...doc.querySelectorAll('link[href], script[src], img[src], iframe[src], source[src], audio[src], video[src], embed[src], object[data]'),
  ];
  for (const el of candidates) {
    const attr = el.hasAttribute('href')
      ? 'href'
      : el.hasAttribute('src')
        ? 'src'
        : 'data';
    const value = el.getAttribute(attr);
    if (!value) continue;
    if (value.startsWith('http://') &&
        !value.startsWith('http://localhost') &&
        !value.startsWith('http://127.0.0.1')) {
      offenders.push({ tag: el.tagName.toLowerCase(), attr, value });
    }
  }
  return {
    mixedContentFound: offenders.length > 0,
    offenders,
  };
}

async function main() {
  const routeArg = getArgValue('--route');
  const targetRoute = normalizeRoute(process.env.TARGET_ROUTE || routeArg);
  if (!targetRoute) {
    throw new Error('TARGET_ROUTE (or --route) is required.');
  }
  const baseUrl = process.env.LH_BASE_URL || DEFAULTS.baseUrl;
  const chromePath = process.env.CHROME_PATH;
  if (!chromePath) {
    throw new Error('CHROME_PATH is required for Lighthouse.');
  }

  const url = new URL(targetRoute, baseUrl).href;
  const slugFolder = slugify(targetRoute);
  const outputDir = process.env.LH_OUTPUT_DIR || DEFAULTS.outputDir;
  await fs.mkdir(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${slugFolder}.json`);
  const summaryPath = path.join(outputDir, `${slugFolder}.summary.json`);

  let server = null;
  try {
    server = await ensureServer(baseUrl);
    const report = await runLighthouse({
      url,
      outputPath,
      chromePath,
      categories: process.env.LH_CATEGORIES || DEFAULTS.categories,
      slugFolder,
    });

    const mixedContent = await scanMixedContent(url);
    const renderBlocking = report?.audits?.['render-blocking-resources'];

    const summary = {
      url,
      route: targetRoute,
      generatedAt: new Date().toISOString(),
      categories: {
        performance: Math.round((report?.categories?.performance?.score ?? 0) * 100),
        accessibility: Math.round((report?.categories?.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round((report?.categories?.['best-practices']?.score ?? 0) * 100),
      },
      metrics: {
        lcpMs: report?.audits?.['largest-contentful-paint']?.numericValue ?? null,
        cls: report?.audits?.['cumulative-layout-shift']?.numericValue ?? null,
        inpMs:
          report?.audits?.['interaction-to-next-paint']?.numericValue ??
          report?.audits?.['max-potential-fid']?.numericValue ??
          null,
        renderBlockingSavingsMs:
          renderBlocking?.details?.overallSavingsMs ?? renderBlocking?.numericValue ?? null,
        lcpElementSelector: extractLcpSelector(report),
      },
      security: {
        isOnHttpsScore: report?.audits?.['is-on-https']?.score ?? null,
        mixedContentFound: mixedContent.mixedContentFound,
        mixedContentOffenders: mixedContent.offenders,
      },
      warnings: report?.warnings ?? [],
    };

    await fs.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    console.log(`Lighthouse summary written to ${summaryPath}`);
  } finally {
    if (server) {
      server.kill();
    }
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
