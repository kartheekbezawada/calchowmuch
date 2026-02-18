#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TESTS_ROOT = path.join(ROOT, 'tests_specs');
const NAV_PATH = path.join(ROOT, 'public', 'config', 'navigation.json');
const SCOPE_MAP_PATH = path.join(ROOT, 'config', 'testing', 'test-scope-map.json');
const OVERRIDES_PATH = path.join(ROOT, 'config', 'testing', 'test-assignment-overrides.json');

const SOURCE_CLUSTERS = [
  'credit-cards',
  'finance',
  'loans',
  'math',
  'percentage',
  'sleep-and-nap',
  'time-and-date',
];

const SLEEP_CLUSTER_IDS = new Set([
  'sleep-time-calculator',
  'wake-up-time-calculator',
  'nap-time-calculator',
  'power-nap-calculator',
  'energy-based-nap-selector',
]);

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function normalizeRoute(route) {
  if (!route || typeof route !== 'string') {
    return null;
  }
  let normalized = route.trim();
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  normalized = normalized.replace(/\/+/g, '/');
  if (normalized !== '/' && !normalized.endsWith('/')) {
    normalized = `${normalized}/`;
  }
  return normalized;
}

function classifyCluster(categoryId, subcategoryId, calculatorId) {
  if (categoryId === 'math') {
    return 'math';
  }
  if (categoryId === 'finance') {
    return 'finance';
  }
  if (categoryId === 'percentage-calculators') {
    return 'percentage';
  }
  if (categoryId === 'loans' && subcategoryId === 'credit-cards') {
    return 'credit-cards';
  }
  if (categoryId === 'loans') {
    return 'loans';
  }
  if (categoryId === 'time-and-date') {
    return SLEEP_CLUSTER_IDS.has(calculatorId) ? 'sleep-and-nap' : 'time-and-date';
  }
  return null;
}

function buildScopeMap(navigation) {
  const clusters = {};

  function ensureCluster(clusterId) {
    if (!clusters[clusterId]) {
      clusters[clusterId] = {
        clusterReleaseDir: `tests_specs/${clusterId}/cluster_release`,
        routes: [],
        calculators: {},
      };
    }
    return clusters[clusterId];
  }

  for (const category of navigation.categories || []) {
    for (const subcategory of category.subcategories || []) {
      for (const calculator of subcategory.calculators || []) {
        const clusterId = classifyCluster(category.id, subcategory.id, calculator.id);
        if (!clusterId) {
          continue;
        }

        const route = normalizeRoute(calculator.url);
        if (!route) {
          continue;
        }

        const cluster = ensureCluster(clusterId);
        cluster.calculators[calculator.id] = {
          route,
          releaseDir: `tests_specs/${clusterId}/${calculator.id}_release`,
        };

        if (!cluster.routes.includes(route)) {
          cluster.routes.push(route);
        }
      }
    }
  }

  for (const clusterId of Object.keys(clusters)) {
    clusters[clusterId].routes.sort();
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    clusters,
  };
}

function buildAliasMap(calculators) {
  const aliasToCalc = new Map();
  for (const calcId of Object.keys(calculators)) {
    const aliases = new Set([
      calcId,
      `${calcId}-calculator`,
      calcId.replace(/-calculator$/, ''),
    ]);

    aliases.forEach((alias) => {
      if (!alias) return;
      aliasToCalc.set(alias, calcId);
    });
  }
  return aliasToCalc;
}

function stripExt(fileName) {
  return fileName.replace(/\.(test|spec)\.js$/, '');
}

function resolveCalculator(cluster, fileName, kind, overrides) {
  const override = overrides?.[kind]?.[fileName];
  if (override === '__cluster__') {
    return null;
  }
  if (typeof override === 'string' && override.trim()) {
    return override.trim();
  }

  const aliasMap = cluster.aliasMap;
  const base = stripExt(fileName);
  const candidates = new Set([
    base,
    base.replace(/-seo$/, ''),
    base.replace(/-logic$/, ''),
    base.replace(/-seo$/, '').replace(/-logic$/, ''),
    base.replace(/-calculator$/, ''),
    base.replace(/-seo$/, '').replace(/-calculator$/, ''),
    base.replace(/-logic$/, '').replace(/-calculator$/, ''),
  ]);

  for (const candidate of candidates) {
    if (aliasMap.has(candidate)) {
      return aliasMap.get(candidate);
    }
  }

  return null;
}

function moveIntoTarget(srcPath, targetDir, canonicalName, fallbackPrefix) {
  ensureDir(targetDir);
  const canonicalPath = path.join(targetDir, canonicalName);
  if (!fs.existsSync(canonicalPath)) {
    fs.renameSync(srcPath, canonicalPath);
    return canonicalPath;
  }

  const sourceBase = path.basename(srcPath);
  let fallback = path.join(targetDir, `${fallbackPrefix}-${sourceBase}`);
  let i = 1;
  while (fs.existsSync(fallback)) {
    fallback = path.join(targetDir, `${fallbackPrefix}-${i}-${sourceBase}`);
    i += 1;
  }
  fs.renameSync(srcPath, fallback);
  return fallback;
}

function writeIfMissing(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
  }
}

function templateClusterReadme(clusterId, routes) {
  return `# ${clusterId} cluster_release\n\nScope: cluster-level release tests for \`${clusterId}\`.\n\nCommands:\n- \`CLUSTER=${clusterId} npm run test:cluster:unit\`\n- \`CLUSTER=${clusterId} npm run test:cluster:e2e\`\n- \`CLUSTER=${clusterId} npm run test:cluster:seo\`\n- \`CLUSTER=${clusterId} npm run test:cluster:cwv\`\n\nPass criteria:\n- Unit/contracts pass\n- Cluster E2E + SEO smoke pass\n- Cluster CWV thresholds pass\n\nOwnership: cluster release owner.\n\nRoutes:\n${routes.map((route) => `- ${route}`).join('\n')}\n`;
}

function templateCalcReadme(clusterId, calcId, route) {
  return `# ${clusterId}/${calcId} release\n\nScope: calculator-level release tests for \`${calcId}\` in cluster \`${clusterId}\`.\n\nCommands:\n- \`CLUSTER=${clusterId} CALC=${calcId} npm run test:calc:unit\`\n- \`CLUSTER=${clusterId} CALC=${calcId} npm run test:calc:e2e\`\n- \`CLUSTER=${clusterId} CALC=${calcId} npm run test:calc:seo\`\n- \`CLUSTER=${clusterId} CALC=${calcId} npm run test:calc:cwv\`\n\nPass criteria:\n- Unit logic tests pass\n- E2E flow + SEO checks pass\n- CWV route guard passes\n\nOwnership: calculator route owner.\n\nRoute:\n- ${route}\n`;
}

function templateClusterContracts(clusterId) {
  return `import { describe, expect, it } from 'vitest';\nimport fs from 'node:fs';\nimport path from 'node:path';\n\nconst SCOPE_MAP_PATH = path.resolve(process.cwd(), 'config/testing/test-scope-map.json');\n\ndescribe('${clusterId} cluster contracts', () => {\n  it('scope map contains cluster and calculator route contracts', () => {\n    const map = JSON.parse(fs.readFileSync(SCOPE_MAP_PATH, 'utf8'));\n    const cluster = map.clusters['${clusterId}'];\n\n    expect(cluster).toBeTruthy();\n    expect(Array.isArray(cluster.routes)).toBeTruthy();\n    expect(cluster.routes.length).toBeGreaterThan(0);\n    expect(cluster.calculators && typeof cluster.calculators).toBe('object');\n\n    for (const [calcId, calc] of Object.entries(cluster.calculators)) {\n      expect(calcId).toBeTruthy();\n      expect(typeof calc.route).toBe('string');\n      expect(calc.route.startsWith('/')).toBeTruthy();\n      expect(typeof calc.releaseDir).toBe('string');\n    }\n  });\n});\n`;
}

function templateClusterE2E(clusterId, routes) {
  const list = JSON.stringify(routes.slice(0, 3));
  return `import { expect, test } from '@playwright/test';\n\nconst ROUTES = ${list};\n\ntest.describe('${clusterId} cluster e2e smoke', () => {\n  test('cluster representative routes load and show H1', async ({ page }) => {\n    for (const route of ROUTES) {\n      await page.goto(route);\n      await expect(page.locator('h1').first()).toBeVisible();\n    }\n  });\n});\n`;
}

function templateClusterSEO(clusterId, route) {
  return `import { expect, test } from '@playwright/test';\n\nconst ROUTE = '${route}';\n\ntest.describe('${clusterId} cluster seo smoke', () => {\n  test('representative route has canonical/title/robots', async ({ page }) => {\n    await page.goto(ROUTE);\n    await expect(page).toHaveTitle(/.+/);\n    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);\n    await expect(page.locator('meta[name="robots"]')).toHaveCount(1);\n  });\n});\n`;
}

function templateClusterCWV(clusterId, routes) {
  const list = JSON.stringify(routes.slice(0, 3));
  return `import { test } from '@playwright/test';\nimport { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';\n\nconst ROUTES = ${list};\n\ntest.describe('${clusterId} cluster cwv guard', () => {\n  test('cluster routes satisfy CLS/LCP thresholds', async ({ page }) => {\n    for (const route of ROUTES) {\n      const metrics = await measureRouteCwv(page, route);\n      assertCwv(metrics, route);\n    }\n  });\n});\n`;
}

function templateCalcUnit(clusterId, calcId) {
  return `import { describe, it } from 'vitest';\n\ndescribe('${clusterId}/${calcId} unit scope placeholder', () => {\n  it.skip('migrated test content pending', () => {});\n});\n`;
}

function templateCalcE2E(clusterId, calcId, route) {
  return `import { expect, test } from '@playwright/test';\n\ntest.describe('${clusterId}/${calcId} e2e scope placeholder', () => {\n  test.skip('migrated test content pending for ${route}', async ({ page }) => {\n    await page.goto('${route}');\n    await expect(page.locator('h1').first()).toBeVisible();\n  });\n});\n`;
}

function templateCalcSEO(clusterId, calcId, route) {
  return `import { expect, test } from '@playwright/test';\n\ntest.describe('${clusterId}/${calcId} seo scope placeholder', () => {\n  test.skip('migrated SEO content pending for ${route}', async ({ page }) => {\n    await page.goto('${route}');\n    await expect(page.locator('title')).toHaveCount(1);\n  });\n});\n`;
}

function templateCalcCWV(clusterId, calcId, route) {
  return `import { test } from '@playwright/test';\nimport { assertCwv, measureRouteCwv } from '../../infrastructure/e2e/cwv-scope-helper.js';\n\nconst ROUTE = '${route}';\n\ntest.describe('${clusterId}/${calcId} cwv guard', () => {\n  test('calculator route satisfies CLS/LCP thresholds', async ({ page }) => {\n    const metrics = await measureRouteCwv(page, ROUTE);\n    assertCwv(metrics, ROUTE);\n  });\n});\n`;
}

function migrateClusterTests(clusterId, clusterConfig, overrides) {
  const clusterRoot = path.join(TESTS_ROOT, clusterId);
  const unitDir = path.join(clusterRoot, 'unit');
  const e2eDir = path.join(clusterRoot, 'e2e');
  const clusterReleaseDir = path.join(ROOT, clusterConfig.clusterReleaseDir);

  ensureDir(clusterReleaseDir);

  const calculators = clusterConfig.calculators || {};
  const aliasMap = buildAliasMap(calculators);

  const clusterCtx = {
    aliasMap,
    calculators,
  };

  const unitFiles = fs.existsSync(unitDir)
    ? fs.readdirSync(unitDir).filter((name) => name.endsWith('.test.js'))
    : [];

  const e2eFiles = fs.existsSync(e2eDir)
    ? fs.readdirSync(e2eDir).filter((name) => name.endsWith('.spec.js'))
    : [];

  for (const fileName of unitFiles) {
    const srcPath = path.join(unitDir, fileName);
    const calcId = resolveCalculator(clusterCtx, fileName, 'unit', overrides);

    if (!calcId) {
      moveIntoTarget(srcPath, clusterReleaseDir, 'unit.cluster.test.js', 'unit-extra');
      continue;
    }

    const calcDir = path.join(ROOT, calculators[calcId].releaseDir);
    moveIntoTarget(srcPath, calcDir, 'unit.calc.test.js', 'unit-extra');
  }

  for (const fileName of e2eFiles) {
    const srcPath = path.join(e2eDir, fileName);
    const isSeo = /-seo\.spec\.js$/.test(fileName);
    const calcId = resolveCalculator(clusterCtx, fileName, 'e2e', overrides);

    if (!calcId) {
      const canonical = isSeo ? 'seo.cluster.spec.js' : 'e2e.cluster.spec.js';
      moveIntoTarget(srcPath, clusterReleaseDir, canonical, isSeo ? 'seo-extra' : 'e2e-extra');
      continue;
    }

    const calcDir = path.join(ROOT, calculators[calcId].releaseDir);
    const canonical = isSeo ? 'seo.calc.spec.js' : 'e2e.calc.spec.js';
    moveIntoTarget(srcPath, calcDir, canonical, isSeo ? 'seo-extra' : 'e2e-extra');
  }

  if (fs.existsSync(unitDir) && fs.readdirSync(unitDir).length === 0) {
    fs.rmdirSync(unitDir);
  }
  if (fs.existsSync(e2eDir) && fs.readdirSync(e2eDir).length === 0) {
    fs.rmdirSync(e2eDir);
  }
}

function finalizeClusterFiles(clusterId, clusterConfig) {
  const clusterReleaseDir = path.join(ROOT, clusterConfig.clusterReleaseDir);
  const routes = clusterConfig.routes || [];
  ensureDir(clusterReleaseDir);

  writeIfMissing(
    path.join(clusterReleaseDir, 'README.md'),
    templateClusterReadme(clusterId, routes)
  );
  writeIfMissing(
    path.join(clusterReleaseDir, 'unit.cluster.test.js'),
    `import { describe, it } from 'vitest';\n\ndescribe('${clusterId} cluster unit scope placeholder', () => {\n  it.skip('migrated unit content pending', () => {});\n});\n`
  );
  writeIfMissing(
    path.join(clusterReleaseDir, 'contracts.cluster.test.js'),
    templateClusterContracts(clusterId)
  );
  writeIfMissing(
    path.join(clusterReleaseDir, 'e2e.cluster.spec.js'),
    templateClusterE2E(clusterId, routes)
  );
  writeIfMissing(
    path.join(clusterReleaseDir, 'seo.cluster.spec.js'),
    templateClusterSEO(clusterId, routes[0] || '/')
  );
  writeIfMissing(
    path.join(clusterReleaseDir, 'cwv.cluster.spec.js'),
    templateClusterCWV(clusterId, routes)
  );
}

function finalizeCalculatorFiles(clusterId, clusterConfig) {
  for (const [calcId, calc] of Object.entries(clusterConfig.calculators || {})) {
    const calcDir = path.join(ROOT, calc.releaseDir);
    ensureDir(calcDir);

    writeIfMissing(path.join(calcDir, 'README.md'), templateCalcReadme(clusterId, calcId, calc.route));
    writeIfMissing(path.join(calcDir, 'unit.calc.test.js'), templateCalcUnit(clusterId, calcId));
    writeIfMissing(path.join(calcDir, 'e2e.calc.spec.js'), templateCalcE2E(clusterId, calcId, calc.route));
    writeIfMissing(path.join(calcDir, 'seo.calc.spec.js'), templateCalcSEO(clusterId, calcId, calc.route));
    writeIfMissing(path.join(calcDir, 'cwv.calc.spec.js'), templateCalcCWV(clusterId, calcId, calc.route));
  }
}

function main() {
  const navigation = readJson(NAV_PATH);
  const scopeMap = buildScopeMap(navigation);
  writeJson(SCOPE_MAP_PATH, scopeMap);

  const overrides = fs.existsSync(OVERRIDES_PATH) ? readJson(OVERRIDES_PATH) : { unit: {}, e2e: {} };

  for (const clusterId of SOURCE_CLUSTERS) {
    if (!scopeMap.clusters[clusterId]) {
      continue;
    }
    migrateClusterTests(clusterId, scopeMap.clusters[clusterId], overrides);
  }

  for (const [clusterId, clusterConfig] of Object.entries(scopeMap.clusters)) {
    finalizeClusterFiles(clusterId, clusterConfig);
    finalizeCalculatorFiles(clusterId, clusterConfig);
  }

  console.log('Test migration complete.');
}

main();
