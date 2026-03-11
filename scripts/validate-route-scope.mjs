#!/usr/bin/env node

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const NAVIGATION_PATH = path.join(ROOT, 'public', 'config', 'navigation.json');
const ASSET_MANIFEST_PATH = path.join(ROOT, 'public', 'config', 'asset-manifest.json');
const ROUTE_OWNERSHIP_PATH = path.join(ROOT, 'config', 'clusters', 'route-ownership.json');
const DEFAULT_MD_OUTPUT_PATH = path.join(ROOT, 'docs', 'route-planner.md');
const DEFAULT_CSV_OUTPUT_PATH = path.join(ROOT, 'docs', 'route-planner.csv');

const NAP_CALCULATOR_IDS = new Set([
  'sleep-time-calculator',
  'wake-up-time-calculator',
  'nap-time-calculator',
  'power-nap-calculator',
  'energy-based-nap-selector',
]);

const PREFIX_ORDER = [
  '/math/',
  '/loan-calculators/',
  '/credit-card-calculators/',
  '/car-loan-calculators/',
  '/finance-calculators/',
  '/time-and-date/',
  '/percentage-calculators/',
];

function normalizeRoute(route) {
  if (typeof route !== 'string' || !route.trim()) return null;
  let normalized = route.trim();
  if (!normalized.startsWith('/')) normalized = `/${normalized}`;
  normalized = normalized.replace(/\/+/g, '/');
  if (normalized !== '/' && !normalized.endsWith('/')) normalized = `${normalized}/`;
  return normalized;
}

function toPosix(value) {
  return String(value || '').replace(/\\/g, '/');
}

function toRepoPath(filePath) {
  const normalized = toPosix(filePath).trim();
  return normalized.replace(/^\.\/+/, '').replace(/^\/+/, '');
}

function routeToRelPath(route) {
  const normalized = normalizeRoute(route);
  return normalized === '/' ? '' : normalized.replace(/^\/|\/$/g, '');
}

function routeToPrefix(route) {
  const normalized = normalizeRoute(route);
  if (normalized === '/') return '/';
  const parts = normalized.split('/').filter(Boolean);
  if (!parts.length) return '/';
  return `/${parts[0]}/`;
}

function routeToBundleSlug(route) {
  const relPath = routeToRelPath(route);
  return relPath.replace(/\//g, '-');
}

function toRepoAssetPath(assetPath) {
  if (typeof assetPath !== 'string' || !assetPath.trim()) return null;
  const withoutQuery = assetPath.split('?')[0].trim();
  if (!withoutQuery) return null;
  if (withoutQuery.startsWith('/')) return `public${withoutQuery}`;
  if (withoutQuery.startsWith('public/')) return withoutQuery;
  return toRepoPath(withoutQuery);
}

function escapeRegex(value) {
  return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
}

function matchPattern(filePath, pattern) {
  const normalizedFilePath = toRepoPath(filePath);
  const normalizedPattern = toRepoPath(pattern);
  if (!normalizedPattern) return false;

  if (normalizedPattern.endsWith('/**')) {
    const prefix = normalizedPattern.slice(0, -3);
    return normalizedFilePath.startsWith(prefix);
  }

  if (!normalizedPattern.includes('*')) {
    return normalizedFilePath === normalizedPattern;
  }

  const regex = new RegExp(
    `^${normalizedPattern
      .split('*')
      .map((part) => escapeRegex(part))
      .join('.*')}$`
  );
  return regex.test(normalizedFilePath);
}

function readJson(jsonPath) {
  return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

function parseArgs(argv = process.argv.slice(2)) {
  const parsed = {
    route: null,
    calc: null,
    files: null,
    writePlanner: false,
    outputMd: DEFAULT_MD_OUTPUT_PATH,
    outputCsv: DEFAULT_CSV_OUTPUT_PATH,
  };

  argv.forEach((arg) => {
    if (arg === '--write-planner') {
      parsed.writePlanner = true;
      return;
    }
    if (arg.startsWith('--route=')) {
      parsed.route = arg.slice('--route='.length);
      return;
    }
    if (arg.startsWith('--calc=')) {
      parsed.calc = arg.slice('--calc='.length);
      return;
    }
    if (arg.startsWith('--files=')) {
      parsed.files = arg
        .slice('--files='.length)
        .split(',')
        .map((item) => toRepoPath(item))
        .filter(Boolean);
      return;
    }
    if (arg.startsWith('--output-md=')) {
      parsed.outputMd = path.isAbsolute(arg.slice('--output-md='.length))
        ? arg.slice('--output-md='.length)
        : path.join(ROOT, arg.slice('--output-md='.length));
      return;
    }
    if (arg.startsWith('--output-csv=')) {
      parsed.outputCsv = path.isAbsolute(arg.slice('--output-csv='.length))
        ? arg.slice('--output-csv='.length)
        : path.join(ROOT, arg.slice('--output-csv='.length));
    }
  });

  return parsed;
}

function run(command) {
  try {
    return execSync(command, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function getChangedFilesFromGit() {
  const outputs = [
    run('git diff --name-only --cached'),
    run('git diff --name-only'),
    run('git diff --name-only HEAD~1...HEAD'),
  ];

  const unique = new Set();
  outputs.forEach((content) => {
    content
      .split('\n')
      .map((line) => toRepoPath(line))
      .filter(Boolean)
      .forEach((line) => unique.add(line));
  });
  return Array.from(unique).sort();
}

function inferTestClusterForEntry({ categoryId, route, calculatorId }) {
  if (categoryId === 'math') return 'math';
  if (categoryId === 'finance') return 'finance';
  if (categoryId === 'percentage-calculators') return 'percentage';
  if (categoryId === 'time-and-date') {
    return NAP_CALCULATOR_IDS.has(calculatorId) ? 'sleep-and-nap' : 'time-and-date';
  }
  if (categoryId === 'loans') {
    if (route.startsWith('/credit-card-calculators/')) return 'credit-cards';
    return 'loans';
  }
  return categoryId;
}

function buildExistingTestDirLookup() {
  const testsRoot = path.join(ROOT, 'tests_specs');
  const lookup = new Map();
  if (!fs.existsSync(testsRoot)) return lookup;

  const topLevelEntries = fs.readdirSync(testsRoot, { withFileTypes: true });
  topLevelEntries
    .filter((entry) => entry.isDirectory())
    .forEach((clusterDir) => {
      const clusterPath = path.join(testsRoot, clusterDir.name);
      fs.readdirSync(clusterPath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name.endsWith('_release'))
        .forEach((releaseDir) => {
          const calculatorId = releaseDir.name.replace(/_release$/, '');
          const existing = lookup.get(calculatorId) || [];
          existing.push(`tests_specs/${clusterDir.name}/${releaseDir.name}/**`);
          lookup.set(calculatorId, existing);
        });
    });

  return lookup;
}

function uniqueSorted(items) {
  return Array.from(new Set(items.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function buildRouteSourceFiles(route) {
  const relPath = routeToRelPath(route);
  if (!relPath) return [];

  if (route.startsWith('/finance-calculators/')) {
    return [
      `content/calculators/${relPath}/index.html`,
      `content/calculators/${relPath}/explanation.html`,
      `public/assets/js/calculators/${relPath}/module.js`,
      `public/assets/css/calculators/${relPath}/calculator.css`,
    ];
  }

  return [
    `public/calculators/${relPath}/index.html`,
    `public/calculators/${relPath}/explanation.html`,
    `public/calculators/${relPath}/module.js`,
    `public/calculators/${relPath}/calculator.css`,
  ];
}

function buildRouteGeneratedFiles(route) {
  const relPath = routeToRelPath(route);
  if (!relPath) return [];
  const bundleSlug = routeToBundleSlug(route);

  return [
    `public/${relPath}/index.html`,
    `public/assets/css/route-bundles/${bundleSlug}*.css`,
  ];
}

function buildContractFiles(route, ownerClusterId) {
  const base = ['public/config/navigation.json', 'public/config/asset-manifest.json'];
  if (!ownerClusterId) return base;

  return base.concat([
    'config/clusters/route-ownership.json',
    `clusters/${ownerClusterId}/config/navigation.json`,
    `clusters/${ownerClusterId}/config/asset-manifest.json`,
  ]);
}

function buildPlannerData() {
  const navigation = readJson(NAVIGATION_PATH);
  const assetManifest = readJson(ASSET_MANIFEST_PATH);
  const routeOwnership = readJson(ROUTE_OWNERSHIP_PATH);
  const ownershipByRoute = new Map(
    (routeOwnership.routes || []).map((entry) => [normalizeRoute(entry.route), entry])
  );
  const existingTestDirs = buildExistingTestDirLookup();

  const rows = [];
  for (const category of navigation.categories || []) {
    for (const subcategory of category.subcategories || []) {
      for (const calculator of subcategory.calculators || []) {
        const route = normalizeRoute(calculator.url);
        if (!route || route === '/') continue;

        const ownershipEntry = ownershipByRoute.get(route);
        const ownerClusterId = ownershipEntry?.activeOwnerClusterId || null;
        const ownerState = ownerClusterId ? `cluster-owned:${ownerClusterId}` : 'legacy-shared';

        const expectedTestCluster = inferTestClusterForEntry({
          categoryId: category.id,
          route,
          calculatorId: calculator.id,
        });
        const primaryTestScope = `tests_specs/${expectedTestCluster}/${calculator.id}_release/**`;

        const testScopes = [primaryTestScope];
        const fallbackTestScopes = existingTestDirs.get(calculator.id) || [];
        fallbackTestScopes.forEach((scopePath) => {
          if (!testScopes.includes(scopePath)) testScopes.push(scopePath);
        });

        const generatedFiles = buildRouteGeneratedFiles(route);
        const manifestRoute = assetManifest.routes?.[route];
        if (manifestRoute?.css?.route) {
          generatedFiles.push(
            ...manifestRoute.css.route
              .map((assetPath) => toRepoAssetPath(assetPath))
              .filter(Boolean)
          );
        }
        if (manifestRoute?.css?.critical) {
          const criticalAssetPath = toRepoAssetPath(manifestRoute.css.critical);
          if (criticalAssetPath) generatedFiles.push(criticalAssetPath);
        }

        rows.push({
          route,
          calculatorId: calculator.id,
          category: category.id,
          subcategory: subcategory.id,
          ownerState,
          sourceFiles: uniqueSorted(buildRouteSourceFiles(route)),
          generatedFiles: uniqueSorted(generatedFiles.concat('public/assets/css/route-bundles/manifest.json')),
          testScope: uniqueSorted(testScopes),
          contractFiles: uniqueSorted(buildContractFiles(route, ownerClusterId)),
        });
      }
    }
  }

  const warnings = buildContractWarnings(rows, routeOwnership);
  const prefixSummary = buildPrefixSummary(rows);

  return {
    rows: rows.sort((a, b) => {
      if (a.route !== b.route) return a.route.localeCompare(b.route);
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.calculatorId.localeCompare(b.calculatorId);
    }),
    prefixSummary,
    warnings,
  };
}

function buildContractWarnings(rows, routeOwnership) {
  const warnings = [];
  const routeSet = new Set(rows.map((row) => row.route));
  const ownershipRows = routeOwnership.routes || [];

  const navRouteByCalcId = new Map();
  rows.forEach((row) => {
    if (!navRouteByCalcId.has(row.calculatorId)) {
      navRouteByCalcId.set(row.calculatorId, row.route);
    }
  });

  ownershipRows.forEach((ownershipEntry) => {
    const ownershipRoute = normalizeRoute(ownershipEntry.route);
    const navRoute = navRouteByCalcId.get(ownershipEntry.calculatorId);
    if (navRoute && navRoute !== ownershipRoute) {
      warnings.push(
        `Route ownership mismatch for calculatorId=${ownershipEntry.calculatorId}: nav=${navRoute} ownership=${ownershipRoute}`
      );
    }

    if (ownershipRoute !== '/' && !routeSet.has(ownershipRoute)) {
      warnings.push(`Ownership route not present in navigation: ${ownershipRoute}`);
    }
  });

  return uniqueSorted(warnings);
}

function ownershipLabelForPrefix(rows) {
  const ownerStates = uniqueSorted(rows.map((row) => row.ownerState));
  const clusterStates = ownerStates.filter((state) => state.startsWith('cluster-owned:'));
  const hasLegacy = ownerStates.includes('legacy-shared');

  if (hasLegacy && clusterStates.length) return 'mixed (legacy + cluster)';
  if (!hasLegacy && clusterStates.length) return 'cluster-owned';
  return 'legacy-shared';
}

function highLevelPatternsForPrefix(prefix, ownershipLabel) {
  const patternsByPrefix = {
    '/math/': [
      'public/calculators/math/**',
      'public/math/**/index.html',
      'tests_specs/math/*_release/**',
      'public/config/navigation.json',
    ],
    '/loan-calculators/': [
      'public/calculators/loan-calculators/**',
      'public/loan-calculators/**/index.html',
      'tests_specs/loans/*_release/**',
      'public/config/navigation.json',
    ],
    '/credit-card-calculators/': [
      'public/calculators/credit-card-calculators/**',
      'public/credit-card-calculators/**/index.html',
      'tests_specs/credit-cards/*_release/**',
      'public/config/navigation.json',
    ],
    '/car-loan-calculators/': [
      'public/calculators/car-loan-calculators/**',
      'public/car-loan-calculators/**/index.html',
      'tests_specs/loans/*_release/**',
      'public/config/navigation.json',
    ],
    '/finance-calculators/': [
      'content/calculators/finance-calculators/**',
      'public/assets/js/calculators/finance-calculators/**',
      'public/assets/css/calculators/finance-calculators/**',
      'public/finance-calculators/**/index.html',
      'tests_specs/finance/*_release/**',
      'public/config/navigation.json',
    ],
    '/time-and-date/': [
      'public/calculators/time-and-date/**',
      'public/time-and-date/**/index.html',
      'tests_specs/time-and-date/*_release/**',
      'tests_specs/sleep-and-nap/*_release/**',
      'public/config/navigation.json',
      'config/clusters/route-ownership.json',
      'clusters/time-and-date/config/navigation.json',
      'clusters/time-and-date/config/asset-manifest.json',
    ],
    '/percentage-calculators/': [
      'public/calculators/percentage-calculators/**',
      'public/percentage-calculators/**/index.html',
      'tests_specs/percentage/*_release/**',
      'public/config/navigation.json',
      'config/clusters/route-ownership.json',
      'clusters/percentage/config/navigation.json',
      'clusters/percentage/config/asset-manifest.json',
    ],
  };

  const defaults = patternsByPrefix[prefix] || [
    `public/calculators${prefix}**`,
    `public${prefix}**/index.html`,
    'public/config/navigation.json',
  ];

  if (ownershipLabel === 'legacy-shared') {
    return defaults.filter((pattern) => !pattern.includes('clusters/'));
  }
  return defaults;
}

function buildPrefixSummary(rows) {
  const grouped = new Map();
  rows.forEach((row) => {
    const prefix = routeToPrefix(row.route);
    if (!grouped.has(prefix)) grouped.set(prefix, []);
    grouped.get(prefix).push(row);
  });

  const knownOrder = PREFIX_ORDER.filter((prefix) => grouped.has(prefix));
  const remaining = Array.from(grouped.keys())
    .filter((prefix) => !knownOrder.includes(prefix))
    .sort((a, b) => a.localeCompare(b));
  const orderedPrefixes = knownOrder.concat(remaining);

  return orderedPrefixes.map((prefix) => {
    const prefixRows = grouped.get(prefix);
    const ownershipState = ownershipLabelForPrefix(prefixRows);
    return {
      routePrefix: prefix,
      calculatorCount: prefixRows.length,
      ownershipState,
      fileScopePattern: highLevelPatternsForPrefix(prefix, ownershipState).join(', '),
    };
  });
}

function resolveRouteForValidation({ route, calc, rows }) {
  if (!route && !calc) {
    throw new Error('Missing target. Provide --route=/path/ or --calc=<calculatorId>.');
  }

  if (route) {
    const normalized = normalizeRoute(route);
    if (!rows.some((row) => row.route === normalized)) {
      throw new Error(`Unknown route: ${normalized}`);
    }
    return normalized;
  }

  const matches = rows.filter((row) => row.calculatorId === calc);
  if (!matches.length) throw new Error(`Unknown calculator id: ${calc}`);

  const routes = uniqueSorted(matches.map((row) => row.route));
  if (routes.length > 1) {
    throw new Error(
      `Calculator id '${calc}' maps to multiple routes (${routes.join(', ')}). Use --route explicitly.`
    );
  }
  return routes[0];
}

function buildAllowedPatternsForRoute(route, rows) {
  const matchingRows = rows.filter((row) => row.route === route);
  if (!matchingRows.length) {
    throw new Error(`No planner row found for route: ${route}`);
  }

  return uniqueSorted(
    matchingRows.flatMap((row) => [
      ...row.sourceFiles,
      ...row.generatedFiles,
      ...row.testScope,
      ...row.contractFiles,
    ])
  );
}

function validateRouteScope({ route, calc, changedFiles = null, planner = null }) {
  const plannerData = planner || buildPlannerData();
  const rows = plannerData.rows;
  const warnings = plannerData.warnings;
  const targetRoute = resolveRouteForValidation({ route, calc, rows });
  const allowedPatterns = buildAllowedPatternsForRoute(targetRoute, rows);
  const filesToCheck = changedFiles
    ? uniqueSorted(changedFiles.map((filePath) => toRepoPath(filePath)))
    : getChangedFilesFromGit();

  const violations = filesToCheck.filter(
    (filePath) => !allowedPatterns.some((pattern) => matchPattern(filePath, pattern))
  );

  return {
    ok: violations.length === 0,
    targetRoute,
    checkedFiles: filesToCheck,
    allowedPatterns,
    violations,
    warnings,
  };
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function joinList(value) {
  return uniqueSorted(Array.isArray(value) ? value : [value]).join(' | ');
}

function formatMarkdownTable(rows, columns) {
  const header = `| ${columns.join(' | ')} |`;
  const divider = `|${columns.map(() => '---').join('|')}|`;
  const body = rows
    .map((row) => `| ${columns.map((column) => row[column] ?? '').join(' | ')} |`)
    .join('\n');
  return [header, divider, body].join('\n');
}

function buildPlannerMarkdown({ prefixSummary, rows, warnings }) {
  const generatedAt = new Date().toISOString();
  const prefixRows = prefixSummary.map((row) => ({
    routePrefix: row.routePrefix,
    calculatorCount: String(row.calculatorCount),
    ownershipState: row.ownershipState,
    fileScopePattern: row.fileScopePattern,
  }));

  const routeRows = rows.map((row) => ({
    route: row.route,
    calculatorId: row.calculatorId,
    category: row.category,
    ownerState: row.ownerState,
    sourceFiles: joinList(row.sourceFiles).replace(/\|/g, '<br>'),
    generatedFiles: joinList(row.generatedFiles).replace(/\|/g, '<br>'),
    testScope: joinList(row.testScope).replace(/\|/g, '<br>'),
    contractFiles: joinList(row.contractFiles).replace(/\|/g, '<br>'),
  }));

  const sections = [
    '# Route Scope Planner',
    '',
    `Generated: ${generatedAt}`,
    '',
    `Total route rows: ${rows.length}`,
    '',
    '## Prefix Summary',
    '',
    formatMarkdownTable(prefixRows, [
      'routePrefix',
      'calculatorCount',
      'ownershipState',
      'fileScopePattern',
    ]),
    '',
    '## Per-Route Ownership Table',
    '',
    formatMarkdownTable(routeRows, [
      'route',
      'calculatorId',
      'category',
      'ownerState',
      'sourceFiles',
      'generatedFiles',
      'testScope',
      'contractFiles',
    ]),
  ];

  if (warnings.length) {
    sections.push('', '## Contract Warnings', '');
    warnings.forEach((warning) => sections.push(`- ${warning}`));
  }

  return `${sections.join('\n')}\n`;
}

function buildPlannerCsv(rows) {
  const header = [
    'route',
    'calculatorId',
    'category',
    'ownerState',
    'sourceFiles',
    'generatedFiles',
    'testScope',
    'contractFiles',
  ];

  const lines = [header.join(',')];
  rows.forEach((row) => {
    lines.push(
      [
        row.route,
        row.calculatorId,
        row.category,
        row.ownerState,
        joinList(row.sourceFiles),
        joinList(row.generatedFiles),
        joinList(row.testScope),
        joinList(row.contractFiles),
      ]
        .map(csvEscape)
        .join(',')
    );
  });
  return `${lines.join('\n')}\n`;
}

function writePlannerArtifacts({ plannerData, outputMd, outputCsv }) {
  fs.mkdirSync(path.dirname(outputMd), { recursive: true });
  fs.mkdirSync(path.dirname(outputCsv), { recursive: true });

  fs.writeFileSync(
    outputMd,
    buildPlannerMarkdown({
      prefixSummary: plannerData.prefixSummary,
      rows: plannerData.rows,
      warnings: plannerData.warnings,
    })
  );
  fs.writeFileSync(outputCsv, buildPlannerCsv(plannerData.rows));
}

function printWarnings(warnings) {
  warnings.forEach((warning) => console.warn(`[scope:route][warning] ${warning}`));
}

function printViolations(result) {
  console.error(`[scope:route] Validation failed for ${result.targetRoute}`);
  console.error('[scope:route] Out-of-scope files:');
  result.violations.forEach((filePath) => {
    console.error(`- ${filePath}`);
  });
}

function main() {
  const args = parseArgs();
  const plannerData = buildPlannerData();

  if (args.writePlanner) {
    writePlannerArtifacts({
      plannerData,
      outputMd: args.outputMd,
      outputCsv: args.outputCsv,
    });
    printWarnings(plannerData.warnings);
    console.log(
      `[scope:route] Planner written: ${path.relative(ROOT, args.outputMd)}, ${path.relative(
        ROOT,
        args.outputCsv
      )}`
    );
    return;
  }

  const validation = validateRouteScope({
    route: args.route,
    calc: args.calc,
    changedFiles: args.files,
    planner: plannerData,
  });

  printWarnings(validation.warnings);
  if (!validation.checkedFiles.length) {
    console.log('[scope:route] No changed files detected.');
    return;
  }

  if (!validation.ok) {
    printViolations(validation);
    process.exit(1);
  }

  console.log(
    `[scope:route] Validation passed for ${validation.targetRoute} (${validation.checkedFiles.length} files checked).`
  );
}

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFilePath) {
  try {
    main();
  } catch (error) {
    console.error(`[scope:route] ${error.message}`);
    process.exit(1);
  }
}

export {
  buildAllowedPatternsForRoute,
  buildPlannerCsv,
  buildPlannerData,
  buildPlannerMarkdown,
  buildPrefixSummary,
  matchPattern,
  normalizeRoute,
  resolveRouteForValidation,
  validateRouteScope,
  writePlannerArtifacts,
};
