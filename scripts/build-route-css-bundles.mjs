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

const BASE_SOURCES = [
  'assets/css/theme-premium-dark.css',
  'assets/css/base.css',
  'assets/css/layout.css',
  'assets/css/calculator.css',
  'assets/css/shared-calculator-ui.css',
];

const CRITICAL_FULL_SOURCES = new Set(['assets/css/layout.css', 'assets/css/calculator.css']);
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
  '#calc-home-loan',
  '.calculator-ui',
  '.home-loan-ui',
  '.mtg-hero',
  '.mtg-form-panel',
  '.mtg-preview-panel',
  '.mtg-preview-main',
  '.mtg-result-card',
  '.mtg-result-value',
  '.mtg-summary-card',
  '.input-row',
  '.input-grid-2-col',
  '.slider-row',
  '.slider-header',
  '.slider-value',
  '.pv-toggle-row',
  '.pv-toggle-group',
  '.pv-toggle-label',
  '.button-group',
  '.calculator-button',
  '.mtg-action-row',
  '.helper',
  '.brand-logo',
  '.mobile-menu-toggle',
];

const PILOT_ROUTES = [
  {
    calculatorId: 'monthly-savings-needed',
    route: '/finance/monthly-savings-needed/',
    relPath: 'finance/monthly-savings-needed',
    routeCss: 'calculators/finance/monthly-savings-needed/calculator.css',
  },
  {
    calculatorId: 'time-to-savings-goal',
    route: '/finance/time-to-savings-goal/',
    relPath: 'finance/time-to-savings-goal',
    routeCss: 'calculators/finance/time-to-savings-goal/calculator.css',
  },
  {
    calculatorId: 'investment-growth',
    route: '/finance/investment-growth/',
    relPath: 'finance/investment-growth',
    routeCss: 'calculators/finance/investment-growth/calculator.css',
  },
  {
    calculatorId: 'effective-annual-rate',
    route: '/finance/effective-annual-rate/',
    relPath: 'finance/effective-annual-rate',
    routeCss: 'calculators/finance/effective-annual-rate/calculator.css',
  },
  {
    calculatorId: 'compound-interest',
    route: '/finance/compound-interest/',
    relPath: 'finance/compound-interest',
    routeCss: 'calculators/finance/compound-interest/calculator.css',
  },
  {
    calculatorId: 'simple-interest',
    route: '/finance/simple-interest/',
    relPath: 'finance/simple-interest',
    routeCss: 'calculators/finance/simple-interest/calculator.css',
  },
  {
    calculatorId: 'present-value',
    route: '/finance/present-value/',
    relPath: 'finance/present-value',
    routeCss: 'calculators/finance/present-value/calculator.css',
  },
  {
    calculatorId: 'future-value',
    route: '/finance/future-value/',
    relPath: 'finance/future-value',
    routeCss: 'calculators/finance/future-value/calculator.css',
  },
  {
    calculatorId: 'future-value-of-annuity',
    route: '/finance/future-value-of-annuity/',
    relPath: 'finance/future-value-of-annuity',
    routeCss: 'calculators/finance/future-value-of-annuity/calculator.css',
  },
  {
    calculatorId: 'present-value-of-annuity',
    route: '/finance/present-value-of-annuity/',
    relPath: 'finance/present-value-of-annuity',
    routeCss: 'calculators/finance/present-value-of-annuity/calculator.css',
  },
];

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
    if (i >= source.length) {
      break;
    }

    while (i < source.length && /\s/.test(source[i])) {
      i += 1;
      i = skipComment(source, i);
    }
    if (i >= source.length) {
      break;
    }

    const preludeStart = i;
    let quote = null;
    while (i < source.length) {
      i = skipComment(source, i);
      if (i >= source.length) {
        break;
      }
      const char = source[i];
      if (quote) {
        if (char === '\\') {
          i += 2;
          continue;
        }
        if (char === quote) {
          quote = null;
        }
        i += 1;
        continue;
      }
      if (char === '"' || char === "'") {
        quote = char;
        i += 1;
        continue;
      }
      if (char === '{' || char === ';') {
        break;
      }
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

    if (source[i] !== '{') {
      break;
    }

    i += 1;
    const bodyStart = i;
    let depth = 1;
    quote = null;

    while (i < source.length && depth > 0) {
      i = skipComment(source, i);
      if (i >= source.length) {
        break;
      }
      const char = source[i];
      if (quote) {
        if (char === '\\') {
          i += 2;
          continue;
        }
        if (char === quote) {
          quote = null;
        }
        i += 1;
        continue;
      }
      if (char === '"' || char === "'") {
        quote = char;
        i += 1;
        continue;
      }
      if (char === '{') {
        depth += 1;
      } else if (char === '}') {
        depth -= 1;
      }
      i += 1;
    }

    const bodyEnd = Math.max(bodyStart, i - 1);
    const body = source.slice(bodyStart, bodyEnd);
    const isGroupRule = prelude.startsWith('@media') || prelude.startsWith('@supports');

    if (isGroupRule) {
      rules.push({
        type: 'group',
        prelude,
        children: parseCssRules(body),
      });
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
      if (!isCriticalPrelude(rule.prelude)) {
        return;
      }
      if (!rule.body) {
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

function buildCriticalCss(sources) {
  const sections = [];

  sources.forEach((relPath) => {
    const raw = readRequired(relPath).trim();
    if (!raw) {
      return;
    }

    let criticalChunk = '';
    if (CRITICAL_FULL_SOURCES.has(relPath)) {
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

function buildBundles() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const manifest = {
    generatedAt: new Date().toISOString(),
    routes: {},
  };

  PILOT_ROUTES.forEach((routeConfig) => {
    const sources = [...BASE_SOURCES, routeConfig.routeCss];
    const bundledCss = sources
      .map((relPath) => `/* source: ${toWebPath(relPath)} */\n${readRequired(relPath).trim()}`)
      .join('\n\n');
    const criticalCss = buildCriticalCss(sources);

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

  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Route CSS bundles generated at ${OUTPUT_DIR}`);
  console.log(`Manifest written to ${MANIFEST_PATH}`);
}

function verifyBundles() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error(`Missing manifest: ${MANIFEST_PATH}`);
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  if (!manifest || typeof manifest !== 'object' || !manifest.routes) {
    throw new Error('Invalid route bundle manifest format.');
  }

  const expectedRouteSet = new Set(PILOT_ROUTES.map((item) => item.route));
  PILOT_ROUTES.forEach((routeConfig) => {
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

    const expectedSources = [...BASE_SOURCES, routeConfig.routeCss].map(toWebPath);
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

  console.log(`Route CSS bundle manifest verified: ${MANIFEST_PATH}`);
}

const verifyMode = process.argv.includes('--verify');
if (verifyMode) {
  verifyBundles();
} else {
  buildBundles();
}
