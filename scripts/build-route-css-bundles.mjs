#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OUTPUT_DIR = path.join(PUBLIC_DIR, 'assets', 'css', 'route-bundles');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'manifest.json');
const ASSET_MANIFEST_PATH = path.join(PUBLIC_DIR, 'config', 'asset-manifest.json');

const CSS_VERSION = '20260127';

const CORE_CSS_SOURCES = [
  'assets/css/theme-premium-dark.css',
  'assets/css/base.css',
  'assets/css/core-tokens.css',
  'assets/css/core-shell.css',
];

const CALCULATOR_SHARED_SOURCES = [
  'assets/css/calculator.css',
  'assets/css/shared-calculator-ui.css',
];

const CRITICAL_FULL_SOURCES = new Set([
  'calculators/percentage-calculators/percent-change-calculator/calculator.css',
  'calculators/percentage-calculators/percentage-difference-calculator/calculator.css',
  'calculators/percentage-calculators/percentage-increase-calculator/calculator.css',
  'calculators/percentage-calculators/percentage-decrease-calculator/calculator.css',
  'calculators/percentage-calculators/percentage-composition-calculator/calculator.css',
  'calculators/percentage-calculators/reverse-percentage-calculator/calculator.css',
  'calculators/percentage-calculators/percent-to-fraction-decimal-calculator/calculator.css',
  'calculators/time-and-date/sleep-time-calculator/calculator.css',
  'calculators/time-and-date/wake-up-time-calculator/calculator.css',
  'calculators/time-and-date/nap-time-calculator/calculator.css',
]);
const FULL_CORE_SHELL_CRITICAL_CALCULATORS = new Set([
  'credit-card-repayment-payoff',
  'credit-card-minimum-payment',
  'balance-transfer-installment-plan',
  'credit-card-consolidation',
  'car-loan',
  'multiple-car-loan',
  'hire-purchase',
  'pcp-calculator',
  'leasing-calculator',
]);
const UX_FIRST_DEFER_CORE_ROUTES = new Set([
  '/credit-card-calculators/credit-card-payment-calculator/',
  '/credit-card-calculators/credit-card-minimum-payment-calculator/',
  '/credit-card-calculators/balance-transfer-credit-card-calculator/',
  '/credit-card-calculators/credit-card-consolidation-calculator/',
  '/percentage-calculators/percent-change-calculator/',
  '/percentage-calculators/percentage-difference-calculator/',
  '/percentage-calculators/percentage-increase-calculator/',
  '/percentage-calculators/percentage-decrease-calculator/',
  '/percentage-calculators/percentage-composition-calculator/',
  '/percentage-calculators/reverse-percentage-calculator/',
  '/percentage-calculators/percent-to-fraction-decimal-calculator/',
  '/time-and-date/sleep-time-calculator/',
  '/time-and-date/wake-up-time-calculator/',
  '/time-and-date/nap-time-calculator/',
]);
const STRICT_INLINE_CALCULATORS = new Set([
  'percent-change',
  'percentage-difference',
  'percentage-increase',
  'percentage-decrease',
  'percentage-composition',
  'percent-to-fraction-decimal',
  'sleep-time-calculator',
  'wake-up-time-calculator',
  'nap-time-calculator',
]);
const UX_FIRST_CORE_DEFERRED_ASSETS = [
  `/assets/css/theme-premium-dark.css?v=${CSS_VERSION}`,
  `/assets/css/base.css?v=${CSS_VERSION}`,
  `/assets/css/core-tokens.css?v=${CSS_VERSION}`,
];
const CRITICAL_SELECTOR_HINTS = [
  ':root',
  'html',
  'body',
  '.page',
  '.site-header',
  '.top-nav',
  '.layout-main',
  '.left-nav',
  '.center-column',
  '.panel',
  '.panel-scroll',
  '.calculator-ui',
  '.calculator-button',
  '.brand-logo',
  '.mobile-menu-toggle',
];

const FINANCE_PILOT_ROUTES = [
  {
    calculatorId: 'monthly-savings-needed',
    route: '/finance-calculators/monthly-savings-needed-calculator/',
    relPath: 'finance-calculators/monthly-savings-needed-calculator',
    routeCss: 'calculators/finance-calculators/monthly-savings-needed-calculator/calculator.css',
  },
  {
    calculatorId: 'time-to-savings-goal',
    route: '/finance-calculators/time-to-savings-goal-calculator/',
    relPath: 'finance-calculators/time-to-savings-goal-calculator',
    routeCss: 'calculators/finance-calculators/time-to-savings-goal-calculator/calculator.css',
  },
  {
    calculatorId: 'investment-growth',
    route: '/finance-calculators/investment-growth-calculator/',
    relPath: 'finance-calculators/investment-growth-calculator',
    routeCss: 'calculators/finance-calculators/investment-growth-calculator/calculator.css',
  },
  {
    calculatorId: 'investment-return',
    route: '/finance-calculators/investment-return-calculator/',
    relPath: 'finance-calculators/investment-return-calculator',
    routeCss: 'calculators/finance-calculators/investment-return-calculator/calculator.css',
  },
  {
    calculatorId: 'effective-annual-rate',
    route: '/finance-calculators/effective-annual-rate-calculator/',
    relPath: 'finance-calculators/effective-annual-rate-calculator',
    routeCss: 'calculators/finance-calculators/effective-annual-rate-calculator/calculator.css',
  },
  {
    calculatorId: 'compound-interest',
    route: '/finance-calculators/compound-interest-calculator/',
    relPath: 'finance-calculators/compound-interest-calculator',
    routeCss: 'calculators/finance-calculators/compound-interest-calculator/calculator.css',
  },
  {
    calculatorId: 'simple-interest',
    route: '/finance-calculators/simple-interest-calculator/',
    relPath: 'finance-calculators/simple-interest-calculator',
    routeCss: 'calculators/finance-calculators/simple-interest-calculator/calculator.css',
  },
  {
    calculatorId: 'present-value',
    route: '/finance-calculators/present-value-calculator/',
    relPath: 'finance-calculators/present-value-calculator',
    routeCss: 'calculators/finance-calculators/present-value-calculator/calculator.css',
  },
  {
    calculatorId: 'future-value',
    route: '/finance-calculators/future-value-calculator/',
    relPath: 'finance-calculators/future-value-calculator',
    routeCss: 'calculators/finance-calculators/future-value-calculator/calculator.css',
  },
  {
    calculatorId: 'future-value-of-annuity',
    route: '/finance-calculators/future-value-of-annuity-calculator/',
    relPath: 'finance-calculators/future-value-of-annuity-calculator',
    routeCss: 'calculators/finance-calculators/future-value-of-annuity-calculator/calculator.css',
  },
  {
    calculatorId: 'present-value-of-annuity',
    route: '/finance-calculators/present-value-of-annuity-calculator/',
    relPath: 'finance-calculators/present-value-of-annuity-calculator',
    routeCss: 'calculators/finance-calculators/present-value-of-annuity-calculator/calculator.css',
  },
];

const LOANS_ISOLATED_ROUTES = [
  {
    calculatorId: 'how-much-can-i-borrow',
    route: '/loan-calculators/how-much-can-i-borrow/',
    relPath: 'loan-calculators/how-much-can-i-borrow',
    routeCss: 'calculators/loan-calculators/how-much-can-i-borrow/calculator.css',
  },
  {
    calculatorId: 'remortgage-switching',
    route: '/loan-calculators/remortgage-calculator/',
    relPath: 'loan-calculators/remortgage-calculator',
    routeCss: 'calculators/loan-calculators/remortgage-calculator/calculator.css',
  },
  {
    calculatorId: 'buy-to-let',
    route: '/loan-calculators/buy-to-let-mortgage-calculator/',
    relPath: 'loan-calculators/buy-to-let-mortgage-calculator',
    routeCss: 'calculators/loan-calculators/buy-to-let-mortgage-calculator/calculator.css',
  },
  {
    calculatorId: 'offset-calculator',
    route: '/loan-calculators/offset-mortgage-calculator/',
    relPath: 'loan-calculators/offset-mortgage-calculator',
    routeCss: 'calculators/loan-calculators/offset-mortgage-calculator/calculator.css',
  },
  {
    calculatorId: 'interest-rate-change-calculator',
    route: '/loan-calculators/interest-rate-change-calculator/',
    relPath: 'loan-calculators/interest-rate-change-calculator',
    routeCss: 'calculators/loan-calculators/interest-rate-change-calculator/calculator.css',
  },
  {
    calculatorId: 'loan-to-value',
    route: '/loan-calculators/ltv-calculator/',
    relPath: 'loan-calculators/ltv-calculator',
    routeCss: 'calculators/loan-calculators/ltv-calculator/calculator.css',
  },
  {
    calculatorId: 'credit-card-repayment-payoff',
    route: '/credit-card-calculators/credit-card-payment-calculator/',
    relPath: 'credit-card-calculators/credit-card-payment-calculator',
    routeCss: 'calculators/credit-card-calculators/credit-card-payment-calculator/calculator.css',
  },
  {
    calculatorId: 'credit-card-minimum-payment',
    route: '/credit-card-calculators/credit-card-minimum-payment-calculator/',
    relPath: 'credit-card-calculators/credit-card-minimum-payment-calculator',
    routeCss: 'calculators/credit-card-calculators/credit-card-minimum-payment-calculator/calculator.css',
  },
  {
    calculatorId: 'balance-transfer-installment-plan',
    route: '/credit-card-calculators/balance-transfer-credit-card-calculator/',
    relPath: 'credit-card-calculators/balance-transfer-credit-card-calculator',
    routeCss: 'calculators/credit-card-calculators/balance-transfer-credit-card-calculator/calculator.css',
  },
  {
    calculatorId: 'credit-card-consolidation',
    route: '/credit-card-calculators/credit-card-consolidation-calculator/',
    relPath: 'credit-card-calculators/credit-card-consolidation-calculator',
    routeCss: 'calculators/credit-card-calculators/credit-card-consolidation-calculator/calculator.css',
  },
  {
    calculatorId: 'car-loan',
    route: '/car-loan-calculators/car-loan-calculator/',
    relPath: 'car-loan-calculators/car-loan-calculator',
    routeCss: 'calculators/car-loan-calculators/car-loan-calculator/calculator.css',
  },
  {
    calculatorId: 'multiple-car-loan',
    route: '/car-loan-calculators/auto-loan-calculator/',
    relPath: 'car-loan-calculators/auto-loan-calculator',
    routeCss: 'calculators/car-loan-calculators/auto-loan-calculator/calculator.css',
  },
  {
    calculatorId: 'hire-purchase',
    route: '/car-loan-calculators/hire-purchase-calculator/',
    relPath: 'car-loan-calculators/hire-purchase-calculator',
    routeCss: 'calculators/car-loan-calculators/hire-purchase-calculator/calculator.css',
  },
  {
    calculatorId: 'pcp-calculator',
    route: '/car-loan-calculators/pcp-calculator/',
    relPath: 'car-loan-calculators/pcp-calculator',
    routeCss: 'calculators/car-loan-calculators/pcp-calculator/calculator.css',
  },
  {
    calculatorId: 'leasing-calculator',
    route: '/car-loan-calculators/car-lease-calculator/',
    relPath: 'car-loan-calculators/car-lease-calculator',
    routeCss: 'calculators/car-loan-calculators/car-lease-calculator/calculator.css',
  },
];

const LOANS_MANUAL_OVERRIDES = [
  {
    calculatorId: 'home-loan',
    route: '/loan-calculators/mortgage-calculator/',
    relPath: 'loan-calculators/mortgage-calculator',
    options: {
      generationMode: 'manual',
      topNavStatic: true,
      rationale: 'Manual performance optimizations are maintained route-locally.',
    },
  },
];

const PERCENTAGE_ISOLATED_ROUTES = [
  {
    calculatorId: 'percent-change',
    route: '/percentage-calculators/percent-change-calculator/',
    relPath: 'percentage-calculators/percent-change-calculator',
    routeCss: 'calculators/percentage-calculators/percent-change-calculator/calculator.css',
  },
  {
    calculatorId: 'percentage-difference',
    route: '/percentage-calculators/percentage-difference-calculator/',
    relPath: 'percentage-calculators/percentage-difference-calculator',
    routeCss: 'calculators/percentage-calculators/percentage-difference-calculator/calculator.css',
  },
  {
    calculatorId: 'percentage-increase',
    route: '/percentage-calculators/percentage-increase-calculator/',
    relPath: 'percentage-calculators/percentage-increase-calculator',
    routeCss: 'calculators/percentage-calculators/percentage-increase-calculator/calculator.css',
  },
  {
    calculatorId: 'percentage-decrease',
    route: '/percentage-calculators/percentage-decrease-calculator/',
    relPath: 'percentage-calculators/percentage-decrease-calculator',
    routeCss: 'calculators/percentage-calculators/percentage-decrease-calculator/calculator.css',
  },
  {
    calculatorId: 'percentage-composition',
    route: '/percentage-calculators/percentage-composition-calculator/',
    relPath: 'percentage-calculators/percentage-composition-calculator',
    routeCss: 'calculators/percentage-calculators/percentage-composition-calculator/calculator.css',
  },
  {
    calculatorId: 'reverse-percentage',
    route: '/percentage-calculators/reverse-percentage-calculator/',
    relPath: 'percentage-calculators/reverse-percentage-calculator',
    routeCss: 'calculators/percentage-calculators/reverse-percentage-calculator/calculator.css',
  },
  {
    calculatorId: 'percent-to-fraction-decimal',
    route: '/percentage-calculators/percent-to-fraction-decimal-calculator/',
    relPath: 'percentage-calculators/percent-to-fraction-decimal-calculator',
    routeCss: 'calculators/percentage-calculators/percent-to-fraction-decimal-calculator/calculator.css',
  },
];

const TIME_AND_DATE_ISOLATED_ROUTES = [
  {
    calculatorId: 'sleep-time-calculator',
    route: '/time-and-date/sleep-time-calculator/',
    relPath: 'time-and-date/sleep-time-calculator',
    routeCss: 'calculators/time-and-date/sleep-time-calculator/calculator.css',
    topNavStatic: false,
  },
  {
    calculatorId: 'wake-up-time-calculator',
    route: '/time-and-date/wake-up-time-calculator/',
    relPath: 'time-and-date/wake-up-time-calculator',
    routeCss: 'calculators/time-and-date/wake-up-time-calculator/calculator.css',
    topNavStatic: false,
  },
  {
    calculatorId: 'nap-time-calculator',
    route: '/time-and-date/nap-time-calculator/',
    relPath: 'time-and-date/nap-time-calculator',
    routeCss: 'calculators/time-and-date/nap-time-calculator/calculator.css',
    topNavStatic: false,
  },
];

const BUNDLED_ROUTES = [
  ...FINANCE_PILOT_ROUTES,
  ...LOANS_ISOLATED_ROUTES,
  ...PERCENTAGE_ISOLATED_ROUTES,
  ...TIME_AND_DATE_ISOLATED_ROUTES,
];
const ISOLATED_ROUTE_CONTRACTS = [
  ...LOANS_ISOLATED_ROUTES,
  ...PERCENTAGE_ISOLATED_ROUTES,
  ...TIME_AND_DATE_ISOLATED_ROUTES,
];

function resolveSourcesForRoute(routeConfig) {
  if (
    isLoansIsolatedRoute(routeConfig.route) ||
    isPercentageIsolatedRoute(routeConfig.route) ||
    isTimeAndDateIsolatedRoute(routeConfig.route)
  ) {
    return [...CALCULATOR_SHARED_SOURCES, routeConfig.routeCss];
  }
  return [...CORE_CSS_SOURCES, ...CALCULATOR_SHARED_SOURCES, routeConfig.routeCss];
}

function isLoansIsolatedRoute(route) {
  return LOANS_ISOLATED_ROUTES.some((item) => item.route === route);
}

function isPercentageIsolatedRoute(route) {
  return PERCENTAGE_ISOLATED_ROUTES.some((item) => item.route === route);
}

function isTimeAndDateIsolatedRoute(route) {
  return TIME_AND_DATE_ISOLATED_ROUTES.some((item) => item.route === route);
}

function isIsolatedRoute(route) {
  return (
    isLoansIsolatedRoute(route) ||
    isPercentageIsolatedRoute(route) ||
    isTimeAndDateIsolatedRoute(route)
  );
}

function isFinancePilotRoute(route) {
  return FINANCE_PILOT_ROUTES.some((item) => item.route === route);
}

function toRouteSlug(route) {
  return route.replace(/^\/|\/$/g, '').replace(/\//g, '-');
}

function toWebPath(relPath) {
  return `/${relPath.replace(/\\/g, '/')}`;
}

function readRequired(relPath) {
  const absPath = path.join(PUBLIC_DIR, relPath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Missing CSS source: ${absPath}`);
  }
  return fs.readFileSync(absPath, 'utf8');
}

function removeStaleBundles(slug, keepFiles) {
  const keepSet = new Set(keepFiles);
  const names = fs.existsSync(OUTPUT_DIR) ? fs.readdirSync(OUTPUT_DIR) : [];
  names.forEach((name) => {
    if (!name.startsWith(`${slug}.`) || !name.endsWith('.css') || keepSet.has(name)) {
      return;
    }
    fs.rmSync(path.join(OUTPUT_DIR, name), { force: true });
  });
}

function skipComment(source, index, end = source.length) {
  if (source[index] === '/' && source[index + 1] === '*') {
    const closeIndex = source.indexOf('*/', index + 2);
    if (closeIndex === -1 || closeIndex >= end) {
      return end;
    }
    return closeIndex + 2;
  }
  return index;
}

function parseCssRules(source) {
  const rules = [];
  let i = 0;

  while (i < source.length) {
    i = skipComment(source, i);
    if (i >= source.length) break;

    while (i < source.length && /\s/.test(source[i])) {
      i += 1;
      i = skipComment(source, i);
    }
    if (i >= source.length) break;

    const preludeStart = i;
    let quote = null;
    while (i < source.length) {
      i = skipComment(source, i);
      if (i >= source.length) break;
      const char = source[i];
      if (quote) {
        if (char === '\\') {
          i += 2;
          continue;
        }
        if (char === quote) quote = null;
        i += 1;
        continue;
      }
      if (char === '"' || char === "'") {
        quote = char;
        i += 1;
        continue;
      }
      if (char === '{' || char === ';') break;
      i += 1;
    }

    const prelude = source.slice(preludeStart, i).trim();
    if (!prelude) {
      i += 1;
      continue;
    }

    if (source[i] === ';') {
      rules.push({ type: 'at', prelude: `${prelude};` });
      i += 1;
      continue;
    }

    if (source[i] !== '{') break;

    i += 1;
    const bodyStart = i;
    let depth = 1;
    quote = null;

    while (i < source.length && depth > 0) {
      i = skipComment(source, i);
      if (i >= source.length) break;
      const char = source[i];
      if (quote) {
        if (char === '\\') {
          i += 2;
          continue;
        }
        if (char === quote) quote = null;
        i += 1;
        continue;
      }
      if (char === '"' || char === "'") {
        quote = char;
        i += 1;
        continue;
      }
      if (char === '{') depth += 1;
      else if (char === '}') depth -= 1;
      i += 1;
    }

    const bodyEnd = Math.max(bodyStart, i - 1);
    const body = source.slice(bodyStart, bodyEnd);
    const isGroupRule = prelude.startsWith('@media') || prelude.startsWith('@supports');

    if (isGroupRule) {
      rules.push({ type: 'group', prelude, children: parseCssRules(body) });
    } else {
      rules.push({ type: 'style', prelude, body: body.trim() });
    }
  }

  return rules;
}

function isCriticalPrelude(prelude) {
  const normalized = prelude.toLowerCase();
  if (
    normalized === '*' ||
    normalized.startsWith('*,') ||
    normalized.startsWith('*::before') ||
    normalized.startsWith('*::after')
  ) {
    return true;
  }
  return CRITICAL_SELECTOR_HINTS.some((hint) => normalized.includes(hint.toLowerCase()));
}

function renderCriticalRules(rules, indent = '') {
  const rendered = [];

  rules.forEach((rule) => {
    if (rule.type === 'style') {
      if (!isCriticalPrelude(rule.prelude) || !rule.body) {
        return;
      }
      rendered.push(`${indent}${rule.prelude} {\n${indent}  ${rule.body}\n${indent}}`);
      return;
    }

    if (rule.type === 'group') {
      const childRendered = renderCriticalRules(rule.children, `${indent}  `);
      if (!childRendered.trim()) {
        return;
      }
      rendered.push(`${indent}${rule.prelude} {\n${childRendered}\n${indent}}`);
    }
  });

  return rendered.join('\n\n');
}

function buildCriticalCss(sources, fullSources = CRITICAL_FULL_SOURCES) {
  const sections = [];

  sources.forEach((relPath) => {
    const raw = readRequired(relPath).trim();
    if (!raw) {
      return;
    }

    let criticalChunk = '';
    if (fullSources.has(relPath)) {
      criticalChunk = raw;
    } else {
      const parsed = parseCssRules(raw);
      criticalChunk = renderCriticalRules(parsed).trim();
    }

    if (criticalChunk) {
      sections.push(`/* critical source: ${toWebPath(relPath)} */\n${criticalChunk}`);
    }
  });

  return sections.join('\n\n');
}

function buildAssetManifest(routeBundleManifest) {
  const baseCoreAssets = [
    `/assets/css/theme-premium-dark.css?v=${CSS_VERSION}`,
    `/assets/css/base.css?v=${CSS_VERSION}`,
    `/assets/css/core-tokens.css?v=${CSS_VERSION}`,
  ];

  const routes = {};

  ISOLATED_ROUTE_CONTRACTS.forEach((routeConfig) => {
    const routeEntry = routeBundleManifest.routes[routeConfig.route];
    if (!routeEntry) {
      throw new Error(`Missing route bundle entry for isolated route ${routeConfig.route}`);
    }

    const isUxFirstDeferredRoute = UX_FIRST_DEFER_CORE_ROUTES.has(routeConfig.route);
    const coreCssAssets = isUxFirstDeferredRoute ? [] : baseCoreAssets;
    let deferredRouteAssets = isUxFirstDeferredRoute
      ? [...UX_FIRST_CORE_DEFERRED_ASSETS, routeEntry.deferredHref]
      : [routeEntry.deferredHref];
    if (STRICT_INLINE_CALCULATORS.has(routeConfig.calculatorId)) {
      deferredRouteAssets = [];
    }

    routes[routeConfig.route] = {
      route: routeConfig.route,
      calculatorId: routeConfig.calculatorId,
      isolationBoundary: 'route',
      css: {
        core: coreCssAssets,
        route: deferredRouteAssets,
        critical: routeEntry.criticalCss,
      },
      js: {
        core: ['/assets/js/core-shell.js'],
        route: [`/calculators/${routeConfig.relPath}/module.js`],
      },
      options: {
        topNavStatic: routeConfig.topNavStatic !== false,
        ...(isUxFirstDeferredRoute ? { deferCoreCss: true } : {}),
      },
    };
  });

  LOANS_MANUAL_OVERRIDES.forEach((entry) => {
    routes[entry.route] = {
      route: entry.route,
      calculatorId: entry.calculatorId,
      isolationBoundary: 'route',
      css: {
        core: [...baseCoreAssets, `/assets/css/core-shell.css?v=${CSS_VERSION}`],
        route: [],
        critical: null,
      },
      js: {
        core: ['/assets/js/core-shell.js'],
        route: [`/calculators/${entry.relPath}/module.js`],
      },
      options: entry.options,
    };
  });

  return {
    version: 1,
    strategy: 'route-isolation-cluster-migration',
    routes,
  };
}

function buildBundles() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const manifest = {
    version: 2,
    routes: {},
  };

  BUNDLED_ROUTES.forEach((routeConfig) => {
    const sources = resolveSourcesForRoute(routeConfig);
    let criticalSources = isIsolatedRoute(routeConfig.route)
      ? ['assets/css/core-shell.css', ...sources]
      : sources;
    if (UX_FIRST_DEFER_CORE_ROUTES.has(routeConfig.route)) {
      criticalSources = [
        'assets/css/core-tokens.css',
        'assets/css/theme-premium-dark.css',
        'assets/css/base.css',
        ...criticalSources,
      ];
    }
    const fullCriticalSources = new Set(CRITICAL_FULL_SOURCES);
    if (
      isIsolatedRoute(routeConfig.route) ||
      isFinancePilotRoute(routeConfig.route) ||
      FULL_CORE_SHELL_CRITICAL_CALCULATORS.has(routeConfig.calculatorId)
    ) {
      fullCriticalSources.add('assets/css/core-shell.css');
    }
    if (STRICT_INLINE_CALCULATORS.has(routeConfig.calculatorId)) {
      fullCriticalSources.add('assets/css/core-tokens.css');
      fullCriticalSources.add('assets/css/theme-premium-dark.css');
      fullCriticalSources.add('assets/css/base.css');
      fullCriticalSources.add('assets/css/calculator.css');
      fullCriticalSources.add('assets/css/shared-calculator-ui.css');
      criticalSources.forEach((sourcePath) => {
        fullCriticalSources.add(sourcePath);
      });
    }
    const bundledCss = sources
      .map((relPath) => `/* source: ${toWebPath(relPath)} */\n${readRequired(relPath).trim()}`)
      .join('\n\n');
    const criticalCss = buildCriticalCss(criticalSources, fullCriticalSources);

    if (!criticalCss.trim()) {
      throw new Error(`Critical CSS extraction produced empty output for ${routeConfig.route}`);
    }

    const hash = crypto.createHash('sha256').update(bundledCss).digest('hex').slice(0, 8);
    const criticalHash = crypto.createHash('sha256').update(criticalCss).digest('hex').slice(0, 8);

    const slug = toRouteSlug(routeConfig.route);
    const bundleFileName = `${slug}.${hash}.css`;
    const criticalFileName = `${slug}.critical.${criticalHash}.css`;

    removeStaleBundles(slug, [bundleFileName, criticalFileName]);

    const bundleOutputPath = path.join(OUTPUT_DIR, bundleFileName);
    const criticalOutputPath = path.join(OUTPUT_DIR, criticalFileName);

    fs.writeFileSync(bundleOutputPath, `${bundledCss}\n`, 'utf8');
    fs.writeFileSync(criticalOutputPath, `${criticalCss}\n`, 'utf8');

    manifest.routes[routeConfig.route] = {
      calculatorId: routeConfig.calculatorId,
      relPath: routeConfig.relPath,
      mode: 'inline-critical-deferred-bundle',
      href: `/assets/css/route-bundles/${bundleFileName}`,
      deferredHref: `/assets/css/route-bundles/${bundleFileName}`,
      criticalCss: `/assets/css/route-bundles/${criticalFileName}`,
      hash,
      criticalHash,
      fullBytes: Buffer.byteLength(bundledCss, 'utf8'),
      criticalBytes: Buffer.byteLength(criticalCss, 'utf8'),
      sources: sources.map(toWebPath),
      outputFile: `public/assets/css/route-bundles/${bundleFileName}`,
      criticalOutputFile: `public/assets/css/route-bundles/${criticalFileName}`,
    };
  });

  const assetManifest = buildAssetManifest(manifest);

  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  fs.writeFileSync(ASSET_MANIFEST_PATH, `${JSON.stringify(assetManifest, null, 2)}\n`, 'utf8');

  console.log(`Route CSS bundles generated at ${OUTPUT_DIR}`);
  console.log(`Manifest written to ${MANIFEST_PATH}`);
  console.log(`Asset manifest written to ${ASSET_MANIFEST_PATH}`);
}

function verifyBundles() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Missing manifest: ${MANIFEST_PATH}`);
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  if (!manifest || typeof manifest !== 'object' || !manifest.routes) {
    throw new Error('Invalid route bundle manifest format.');
  }

  const expectedRouteSet = new Set(BUNDLED_ROUTES.map((item) => item.route));
  BUNDLED_ROUTES.forEach((routeConfig) => {
    const entry = manifest.routes[routeConfig.route];
    if (!entry) {
      throw new Error(`Manifest missing route entry for ${routeConfig.route}`);
    }

    if (entry.calculatorId !== routeConfig.calculatorId) {
      throw new Error(`Manifest calculatorId mismatch for ${routeConfig.route}`);
    }

    if (!entry.deferredHref || !entry.deferredHref.startsWith('/assets/css/route-bundles/')) {
      throw new Error(`Manifest deferredHref invalid for ${routeConfig.route}`);
    }

    if (!entry.criticalCss || !entry.criticalCss.startsWith('/assets/css/route-bundles/')) {
      throw new Error(`Manifest criticalCss invalid for ${routeConfig.route}`);
    }

    const bundleAbsPath = path.join(PUBLIC_DIR, entry.deferredHref.replace(/^\//, ''));
    const criticalAbsPath = path.join(PUBLIC_DIR, entry.criticalCss.replace(/^\//, ''));

    if (!fs.existsSync(bundleAbsPath)) {
      throw new Error(`Bundle file missing for ${routeConfig.route}: ${bundleAbsPath}`);
    }

    if (!fs.existsSync(criticalAbsPath)) {
      throw new Error(`Critical CSS file missing for ${routeConfig.route}: ${criticalAbsPath}`);
    }

    const expectedSources = resolveSourcesForRoute(routeConfig).map(toWebPath);
    if (JSON.stringify(entry.sources) !== JSON.stringify(expectedSources)) {
      throw new Error(`Manifest sources mismatch for ${routeConfig.route}`);
    }

    expectedSources.forEach((sourcePath) => {
      const sourceAbsPath = path.join(PUBLIC_DIR, sourcePath.replace(/^\//, ''));
      if (!fs.existsSync(sourceAbsPath)) {
        throw new Error(`Source file missing for ${routeConfig.route}: ${sourceAbsPath}`);
      }
    });
  });

  Object.keys(manifest.routes).forEach((route) => {
    if (!expectedRouteSet.has(route)) {
      throw new Error(`Unexpected route entry in manifest: ${route}`);
    }
  });

  if (!fs.existsSync(ASSET_MANIFEST_PATH)) {
    throw new Error(`Missing asset manifest: ${ASSET_MANIFEST_PATH}`);
  }
  const assetManifest = JSON.parse(fs.readFileSync(ASSET_MANIFEST_PATH, 'utf8'));
  if (!assetManifest || !assetManifest.routes) {
    throw new Error(`Invalid asset manifest format: ${ASSET_MANIFEST_PATH}`);
  }

  ISOLATED_ROUTE_CONTRACTS.forEach((routeConfig) => {
    const entry = assetManifest.routes[routeConfig.route];
    if (!entry) {
      throw new Error(`Asset manifest missing isolated route entry: ${routeConfig.route}`);
    }
    if (entry.isolationBoundary !== 'route') {
      throw new Error(`Asset manifest isolationBoundary must be route for ${routeConfig.route}`);
    }
  });

  LOANS_MANUAL_OVERRIDES.forEach((routeConfig) => {
    const entry = assetManifest.routes[routeConfig.route];
    if (!entry) {
      throw new Error(`Asset manifest missing manual override route: ${routeConfig.route}`);
    }
    if (entry?.options?.generationMode !== 'manual') {
      throw new Error(`Manual override generationMode missing for ${routeConfig.route}`);
    }
  });

  console.log(`Route CSS bundle manifest verified: ${MANIFEST_PATH}`);
  console.log(`Asset manifest verified: ${ASSET_MANIFEST_PATH}`);
}

const verifyMode = process.argv.includes('--verify');
if (verifyMode) {
  verifyBundles();
} else {
  buildBundles();
}
