#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const NAV_PATH = path.join(ROOT, 'public', 'config', 'navigation.json');

const SHARED_CONTRACT_FILES = new Set([
  'public/layout/header.html',
  'public/layout/footer.html',
  'public/config/navigation.json',
  'public/config/asset-manifest.json',
  'public/assets/css/core-tokens.css',
  'public/assets/css/core-shell.css',
  'public/assets/js/core-shell.js',
  'public/assets/css/theme-premium-dark.css',
  'public/assets/css/base.css',
  'public/assets/css/layout.css',
  'public/assets/css/calculator.css',
  'public/assets/css/shared-calculator-ui.css',
  'scripts/generate-mpa-pages.js',
  'scripts/build-route-css-bundles.mjs',
  'scripts/validate-isolation-scope.mjs',
]);

const SHARED_CONTRACT_PREFIXES = ['requirements/universal-rules/'];

function run(command) {
  try {
    return execSync(command, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function getChangedFiles() {
  const candidates = [
    run('git diff --name-only --cached'),
    run('git diff --name-only'),
    run('git diff --name-only HEAD~1...HEAD'),
  ];
  const first = candidates.find((value) => value && value.trim());
  if (!first) {
    return [];
  }
  return [...new Set(first.split('\n').map((line) => line.trim()).filter(Boolean))];
}

function isSharedContractFile(filePath) {
  if (SHARED_CONTRACT_FILES.has(filePath)) {
    return true;
  }
  return SHARED_CONTRACT_PREFIXES.some((prefix) => filePath.startsWith(prefix));
}

function hasSharedContractCommitMarker() {
  const lastMessage = run('git log -1 --pretty=%B');
  return /\[shared-contract\]/i.test(lastMessage);
}

function loadRouteMap() {
  const navigation = JSON.parse(fs.readFileSync(NAV_PATH, 'utf8'));
  const map = new Map();

  navigation.categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      subcategory.calculators.forEach((calculator) => {
        const route = calculator.url.endsWith('/') ? calculator.url : `${calculator.url}/`;
        map.set(calculator.id, {
          route,
          relSourcePrefix: `public/calculators/${category.id}/${calculator.id}/`,
        });
      });
    });
  });

  return map;
}

function slugifyRoute(route) {
  return route.replace(/^\/|\/$/g, '').replace(/\//g, '-');
}

function isCalculatorSourceFile(filePath) {
  return /^public\/calculators\/[^/]+\/[^/]+\//.test(filePath);
}

function main() {
  const changedFiles = getChangedFiles();
  if (!changedFiles.length) {
    console.log('Isolation scope: no changed files detected.');
    return;
  }

  const sharedContractChanges = changedFiles.filter(isSharedContractFile);
  const sharedOptIn =
    process.env.ALLOW_SHARED_CONTRACT_CHANGE === '1' || hasSharedContractCommitMarker();
  if (sharedContractChanges.length && !sharedOptIn) {
    console.error('Isolation scope failed: shared-contract files changed without opt-in.');
    sharedContractChanges.forEach((filePath) => console.error(`  - ${filePath}`));
    console.error(
      'Use ALLOW_SHARED_CONTRACT_CHANGE=1 or include [shared-contract] in commit message.'
    );
    process.exit(1);
  }

  const sourceCalcMatches = changedFiles
    .map((filePath) => {
      const match = filePath.match(/^public\/calculators\/([^/]+)\/([^/]+)\//);
      if (!match) {
        return null;
      }
      return {
        filePath,
        categoryId: match[1],
        calculatorId: match[2],
      };
    })
    .filter(Boolean);

  const changedCalculatorIds = [...new Set(sourceCalcMatches.map((item) => item.calculatorId))];

  if (changedCalculatorIds.length !== 1 || sharedContractChanges.length) {
    console.log('Isolation scope: skipped strict single-calculator artifact check.');
    console.log(`- changed calculators: ${changedCalculatorIds.join(', ') || 'none'}`);
    console.log(`- shared contract changes: ${sharedContractChanges.length}`);
    return;
  }

  const calculatorId = changedCalculatorIds[0];
  const routeMap = loadRouteMap();
  const routeEntry = routeMap.get(calculatorId);

  if (!routeEntry) {
    console.log(`Isolation scope: route lookup missing for ${calculatorId}, skipping strict check.`);
    return;
  }

  const routeHtmlPath = `public${routeEntry.route}index.html`;
  const targetBundleSlug = slugifyRoute(routeEntry.route);
  const targetSourcePrefix = routeEntry.relSourcePrefix;

  const violations = [];

  changedFiles.forEach((filePath) => {
    if (filePath === 'public/assets/css/route-bundles/manifest.json') {
      return;
    }
    if (filePath === 'public/config/asset-manifest.json') {
      return;
    }

    if (filePath.endsWith('/index.html') && filePath.startsWith('public/')) {
      if (!isCalculatorSourceFile(filePath) && filePath !== routeHtmlPath) {
        violations.push(`Unrelated route HTML changed: ${filePath}`);
      }
      return;
    }

    if (filePath.startsWith('public/assets/css/route-bundles/') && filePath.endsWith('.css')) {
      const fileName = path.basename(filePath);
      if (!fileName.startsWith(`${targetBundleSlug}.`)) {
        violations.push(`Unrelated route bundle CSS changed: ${filePath}`);
      }
      return;
    }

    if (isCalculatorSourceFile(filePath) && !filePath.startsWith(targetSourcePrefix)) {
      violations.push(`Another calculator source changed: ${filePath}`);
    }
  });

  if (violations.length) {
    console.error(`Isolation scope failed for calculator ${calculatorId}:`);
    violations.forEach((line) => console.error(`  - ${line}`));
    process.exit(1);
  }

  console.log(`Isolation scope passed for calculator ${calculatorId}.`);
}

main();
