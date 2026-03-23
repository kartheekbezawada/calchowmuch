import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PERCENTAGE_DIR = path.join(ROOT, 'public', 'percentage-calculators');

const MIGRATED_PERCENTAGE_ROUTE_DIRS = new Set([
  'percent-change-calculator',
  'percentage-difference-calculator',
  'percentage-increase-calculator',
  'percentage-decrease-calculator',
  'percentage-composition-calculator',
  'reverse-percentage-calculator',
  'percent-to-fraction-decimal-calculator',
  'percentage-finder-calculator',
  'percentage-of-a-number-calculator',
]);

const requiredTokens = ['class="fin-nav-container"', 'class="fin-nav-group"', 'class="fin-nav-item"'];
const forbiddenTokens = ['class="nav-item', 'class="nav-category'];
const migratedShellRequiredTokens = [
  'pct-cluster-page-shell',
  'pct-cluster-site-header',
  'pct-cluster-page-header',
  'pct-cluster-route-switch',
  'pct-cluster-related',
];
const migratedShellForbiddenTokens = ['<nav class="top-nav"', '<aside class="left-nav"', 'id="left-nav-content"'];

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function extractLeftNav(html) {
  const match = html.match(/<div id="left-nav-content">([\s\S]*?)<\/div>\s*<\/aside>/i);
  if (!match) {
    return null;
  }
  return match[1];
}

function validateLegacyRoute(html) {
  const leftNav = extractLeftNav(html);
  if (!leftNav) {
    return ['Missing #left-nav-content block'];
  }

  const failures = [];
  for (const token of requiredTokens) {
    if (!leftNav.includes(token)) {
      failures.push(`Missing required token: ${token}`);
    }
  }
  for (const token of forbiddenTokens) {
    if (leftNav.includes(token)) {
      failures.push(`Found forbidden token: ${token}`);
    }
  }
  return failures;
}

function validateMigratedRoute(html) {
  const failures = [];
  for (const token of migratedShellRequiredTokens) {
    if (!html.includes(token)) {
      failures.push(`Missing migrated shell token: ${token}`);
    }
  }
  for (const token of migratedShellForbiddenTokens) {
    if (html.includes(token)) {
      failures.push(`Found forbidden legacy shell token: ${token}`);
    }
  }
  return failures;
}

function validateFile(filePath, routeDir) {
  const html = read(filePath);
  if (MIGRATED_PERCENTAGE_ROUTE_DIRS.has(routeDir)) {
    return validateMigratedRoute(html);
  }
  return validateLegacyRoute(html);
}

function main() {
  if (!fs.existsSync(PERCENTAGE_DIR)) {
    console.error(`Directory not found: ${PERCENTAGE_DIR}`);
    process.exit(1);
  }

  const dirs = fs
    .readdirSync(PERCENTAGE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const violations = [];
  for (const dir of dirs) {
    const filePath = path.join(PERCENTAGE_DIR, dir, 'index.html');
    if (!fs.existsSync(filePath)) {
      violations.push({ route: dir, issues: ['Missing index.html'] });
      continue;
    }
    const issues = validateFile(filePath, dir);
    if (issues.length) {
      violations.push({ route: dir, issues });
    }
  }

  if (violations.length) {
    console.error('Percentage nav guard violations found:');
    for (const violation of violations) {
      console.error(`- ${violation.route}`);
      for (const issue of violation.issues) {
        console.error(`  * ${issue}`);
      }
    }
    process.exit(1);
  }

  console.log(`PASS: Percentage nav guard validated for ${dirs.length} routes.`);
}

main();
