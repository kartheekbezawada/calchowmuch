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

const PILOT_ROUTES = [
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

function removeStaleBundles(slug, keepFile) {
  const names = fs.existsSync(OUTPUT_DIR) ? fs.readdirSync(OUTPUT_DIR) : [];
  names.forEach((name) => {
    if (!name.startsWith(`${slug}.`) || !name.endsWith('.css') || name === keepFile) {
      return;
    }
    fs.rmSync(path.join(OUTPUT_DIR, name), { force: true });
  });
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
    const hash = crypto.createHash('sha256').update(bundledCss).digest('hex').slice(0, 8);
    const slug = toRouteSlug(routeConfig.route);
    const fileName = `${slug}.${hash}.css`;
    const outputPath = path.join(OUTPUT_DIR, fileName);

    removeStaleBundles(slug, fileName);
    fs.writeFileSync(outputPath, `${bundledCss}\n`, 'utf8');

    manifest.routes[routeConfig.route] = {
      calculatorId: routeConfig.calculatorId,
      relPath: routeConfig.relPath,
      href: `/assets/css/route-bundles/${fileName}`,
      hash,
      sources: sources.map(toWebPath),
      outputFile: `public/assets/css/route-bundles/${fileName}`,
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

    if (!entry.href || !entry.href.startsWith('/assets/css/route-bundles/')) {
      throw new Error(`Manifest href invalid for ${routeConfig.route}`);
    }

    const bundleAbsPath = path.join(PUBLIC_DIR, entry.href.replace(/^\//, ''));
    if (!fs.existsSync(bundleAbsPath)) {
      throw new Error(`Bundle file missing for ${routeConfig.route}: ${bundleAbsPath}`);
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
