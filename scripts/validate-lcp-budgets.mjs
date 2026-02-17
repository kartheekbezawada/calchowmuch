#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const BUDGET_PATH = path.join(ROOT, 'requirements', 'universal-rules', 'PERF_BUDGETS.json');
const LIGHTHOUSE_OUTPUT_DIR = path.join(ROOT, 'test-results', 'lighthouse');
const REPORT_PATH = path.join(ROOT, 'test-results', 'performance', 'lcp-budgets-loans.json');

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

function parseRouteInclude(rawValue) {
  if (!rawValue) return null;
  const routes = rawValue
    .split(',')
    .map((part) => normalizeRoute(part))
    .filter(Boolean);
  if (!routes.length) return null;
  return new Set(routes);
}

function runLighthouseForRoute({ route, preset, chromePath }) {
  const execute = () => {
    const args = ['scripts/lighthouse-target.mjs', '--route', route, '--preset', preset];
    const run = spawnSync(process.execPath, args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
      env: {
        ...process.env,
        CHROME_PATH: chromePath,
      },
      timeout: 300000,
      maxBuffer: 8 * 1024 * 1024,
    });

    if (run.status !== 0) {
      const detail = [
        `command: ${process.execPath} ${args.join(' ')}`,
        `exitCode: ${run.status ?? 'null'}`,
        `signal: ${run.signal ?? 'none'}`,
        '',
        'stdout:',
        run.stdout ?? '',
        '',
        'stderr:',
        run.stderr ?? '',
      ].join('\n');
      throw new Error(`Lighthouse run failed for ${route} (${preset})\n${detail}`);
    }

    const summaryPath = path.join(LIGHTHOUSE_OUTPUT_DIR, `${slugify(route)}.${preset}.summary.json`);
    if (!fs.existsSync(summaryPath)) {
      throw new Error(`Missing Lighthouse summary: ${summaryPath}`);
    }

    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    return {
      summaryPath,
      summary,
    };
  };

  let result = execute();
  const initialLcpMs = Number(result?.summary?.metrics?.lcpMs);
  if (!Number.isFinite(initialLcpMs) || initialLcpMs <= 0) {
    result = execute();
  }
  return result;
}

function main() {
  if (!fs.existsSync(BUDGET_PATH)) {
    throw new Error(`Missing budget file: ${BUDGET_PATH}`);
  }

  const budget = JSON.parse(fs.readFileSync(BUDGET_PATH, 'utf8'));
  const mobileBudget = Number(budget?.profiles?.mobile?.lcpMs);
  const desktopBudget = Number(budget?.profiles?.desktop?.lcpMs);

  if (!Number.isFinite(mobileBudget) || !Number.isFinite(desktopBudget)) {
    throw new Error('PERF_BUDGETS.json must define numeric mobile/desktop lcpMs budgets.');
  }

  const includeSet = parseRouteInclude(process.env.LCP_ROUTE_INCLUDE || process.env.TARGET_ROUTE || '');
  let routes = (budget.routes || []).map((route) => normalizeRoute(route)).filter(Boolean);
  if (includeSet) {
    routes = routes.filter((route) => includeSet.has(route));
  }

  if (!routes.length) {
    throw new Error('No routes selected for LCP budget validation.');
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.mkdirSync(LIGHTHOUSE_OUTPUT_DIR, { recursive: true });

  const chromePath = process.env.CHROME_PATH || chromium.executablePath();
  const results = [];
  const failures = [];

  routes.forEach((route) => {
    const profiles = [
      { preset: 'desktop', threshold: desktopBudget },
      { preset: 'mobile', threshold: mobileBudget },
    ];

    profiles.forEach(({ preset, threshold }) => {
      const { summaryPath, summary } = runLighthouseForRoute({ route, preset, chromePath });
      const rawLcpMs = summary?.metrics?.lcpMs;
      const lcpMs = typeof rawLcpMs === 'number' ? rawLcpMs : Number.NaN;
      const hasValidLcp = Number.isFinite(lcpMs) && lcpMs > 0;
      const passed = hasValidLcp && lcpMs <= threshold;

      const row = {
        route,
        preset,
        thresholdMs: threshold,
        lcpMs: hasValidLcp ? lcpMs : null,
        passed,
        summaryPath: path.relative(ROOT, summaryPath),
      };
      results.push(row);

      if (!passed) {
        failures.push(row);
      }

      const lcpDisplay = hasValidLcp ? `${Math.round(lcpMs)}ms` : 'N/A';
      const verdict = passed ? 'PASS' : 'FAIL';
      console.log(`[${verdict}] ${route} (${preset}) LCP=${lcpDisplay} threshold=${threshold}ms`);
    });
  });

  const report = {
    generatedAt: new Date().toISOString(),
    routesEvaluated: routes.length,
    mobileBudgetMs: mobileBudget,
    desktopBudgetMs: desktopBudget,
    failures: failures.length,
    results,
  };

  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`LCP budget report written to ${REPORT_PATH}`);

  if (failures.length) {
    throw new Error(`LCP budget validation failed (${failures.length} profile failures).`);
  }
}

main();
