import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const BEACON_SRC_RE = /https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js/gi;
const DATA_CF_BEACON_ATTR_RE = /data-cf-beacon\s*=\s*(['"])(.*?)\1/gis;
const TOKEN_IN_ATTR_RE = /"token"\s*:\s*"([a-f0-9]{32})"/gi;
const GOOGLE_LOADER_RE = /https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=([a-z0-9-]+)/gi;
const GOOGLE_CONFIG_RE = /gtag\s*\(\s*['"]config['"]\s*,\s*['"]([^'"]+)['"]/gi;
const KNOWN_REPO_TOKENS = new Set(['3aa03e0b39c54f8a8c3553a6b682091c']);
const KNOWN_GOOGLE_IDS = new Set(['G-NX2DY3KTPV']);

function collectRequiredPublicHtml() {
  const sitemap = fs.readFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), 'utf8');
  const files = new Set([path.join(PUBLIC_DIR, 'calculators', 'index.html')]);
  for (const match of sitemap.matchAll(/<loc>(.*?)<\/loc>/gis)) {
    const pathname = new URL(match[1].trim()).pathname;
    if (!pathname.endsWith('/')) continue;
    const routePath = pathname === '/' ? '' : pathname.replace(/^\/|\/$/g, '');
    files.add(path.join(PUBLIC_DIR, routePath, 'index.html'));
  }
  return [...files].filter((filePath) => fs.existsSync(filePath));
}

function toRoutePath(filePath) {
  const rel = path.relative(PUBLIC_DIR, filePath).split(path.sep).join('/');
  return `/${rel}`;
}

const files = collectRequiredPublicHtml().sort((a, b) => a.localeCompare(b));

const rows = [];
for (const filePath of files) {
  const html = fs.readFileSync(filePath, 'utf8');
  const beaconCount = (html.match(BEACON_SRC_RE) || []).length;
  const googleLoaderIds = [...html.matchAll(GOOGLE_LOADER_RE)].map((match) => match[1]);
  const googleConfigIds = [...html.matchAll(GOOGLE_CONFIG_RE)].map((match) => match[1]);

  const tokens = [];
  for (const match of html.matchAll(DATA_CF_BEACON_ATTR_RE)) {
    const attrValue = match[2] || '';
    for (const tokenMatch of attrValue.matchAll(TOKEN_IN_ATTR_RE)) {
      tokens.push(tokenMatch[1]);
    }
  }

  const uniqueTokens = [...new Set(tokens)].sort();
  const uniqueGoogleIds = [...new Set([...googleLoaderIds, ...googleConfigIds])].sort();
  const hasUnknownSourceToken = uniqueTokens.some((token) => !KNOWN_REPO_TOKENS.has(token));
  const hasUnknownGoogleId = uniqueGoogleIds.some((id) => !KNOWN_GOOGLE_IDS.has(id));

  const issues = [];
  if (beaconCount === 0 || googleLoaderIds.length === 0 || googleConfigIds.length === 0) {
    issues.push('MISSING');
  }
  if (beaconCount > 1 || googleLoaderIds.length > 1 || googleConfigIds.length > 1) {
    issues.push('DUPLICATE');
  }
  if (hasUnknownSourceToken || hasUnknownGoogleId) issues.push('UNKNOWN_SOURCE');

  rows.push({
    page: toRoutePath(filePath),
    beaconCount,
    googleLoaderCount: googleLoaderIds.length,
    googleConfigCount: googleConfigIds.length,
    tokens: uniqueTokens,
    googleIds: uniqueGoogleIds,
    status: issues.length > 0 ? issues.join('+') : 'OK',
  });
}

console.log(
  'page | cloudflare_count | google_loader_count | google_config_count | tokens_found | google_ids | status'
);
for (const row of rows) {
  const tokenCell = row.tokens.length > 0 ? row.tokens.join(',') : '-';
  const googleIdCell = row.googleIds.length > 0 ? row.googleIds.join(',') : '-';
  console.log(
    `${row.page} | ${row.beaconCount} | ${row.googleLoaderCount} | ${row.googleConfigCount} | ${tokenCell} | ${googleIdCell} | ${row.status}`
  );
}

const missingRows = rows.filter((row) => row.status.includes('MISSING'));
const duplicateRows = rows.filter((row) => row.status.includes('DUPLICATE'));
const unknownRows = rows.filter((row) => row.status.includes('UNKNOWN_SOURCE'));

console.log('');
console.log(
  `Summary: scanned=${rows.length}, missing=${missingRows.length}, duplicates=${duplicateRows.length}, unknown_source=${unknownRows.length}`
);

const invalidRows = rows.filter((row) => row.status !== 'OK');
if (invalidRows.length > 0) {
  console.error('Fail: invalid analytics tag coverage detected on:');
  for (const row of invalidRows) {
    console.error(`- ${row.page} (${row.status})`);
  }
  process.exit(1);
}

process.exit(0);
