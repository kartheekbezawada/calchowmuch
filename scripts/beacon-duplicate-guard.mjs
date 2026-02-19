import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const SOURCE_FRAGMENT_PREFIX = `${path.join(PUBLIC_DIR, 'calculators')}${path.sep}`;
const BEACON_SRC_RE = /https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js/gi;
const DATA_CF_BEACON_ATTR_RE = /data-cf-beacon\s*=\s*(['"])(.*?)\1/gis;
const TOKEN_IN_ATTR_RE = /"token"\s*:\s*"([a-f0-9]{32})"/gi;
const KNOWN_REPO_TOKENS = new Set(['3aa03e0b39c54f8a8c3553a6b682091c']);

function walkIndexHtml(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkIndexHtml(fullPath, out);
      continue;
    }
    if (entry.isFile() && entry.name === 'index.html') {
      out.push(fullPath);
    }
  }
  return out;
}

function toRoutePath(filePath) {
  const rel = path.relative(PUBLIC_DIR, filePath).split(path.sep).join('/');
  return `/${rel}`;
}

const files = walkIndexHtml(PUBLIC_DIR)
  .filter((filePath) => !filePath.startsWith(SOURCE_FRAGMENT_PREFIX))
  .sort((a, b) => a.localeCompare(b));

const rows = [];
for (const filePath of files) {
  const html = fs.readFileSync(filePath, 'utf8');
  const beaconCount = (html.match(BEACON_SRC_RE) || []).length;

  const tokens = [];
  for (const match of html.matchAll(DATA_CF_BEACON_ATTR_RE)) {
    const attrValue = match[2] || '';
    for (const tokenMatch of attrValue.matchAll(TOKEN_IN_ATTR_RE)) {
      tokens.push(tokenMatch[1]);
    }
  }

  const uniqueTokens = [...new Set(tokens)].sort();
  const hasUnknownSourceToken = uniqueTokens.some((token) => !KNOWN_REPO_TOKENS.has(token));

  let status = 'OK';
  if (beaconCount > 1) {
    status = 'DUPLICATE';
  } else if (hasUnknownSourceToken) {
    status = 'UNKNOWN_SOURCE';
  }

  rows.push({
    page: toRoutePath(filePath),
    beaconCount,
    tokens: uniqueTokens,
    status,
  });
}

console.log('page | beacon_count | tokens_found | status');
for (const row of rows) {
  const tokenCell = row.tokens.length > 0 ? row.tokens.join(',') : '-';
  console.log(`${row.page} | ${row.beaconCount} | ${tokenCell} | ${row.status}`);
}

const duplicateRows = rows.filter((row) => row.status === 'DUPLICATE');
const unknownRows = rows.filter((row) => row.status === 'UNKNOWN_SOURCE');

console.log('');
console.log(
  `Summary: scanned=${rows.length}, duplicates=${duplicateRows.length}, unknown_source=${unknownRows.length}`
);

if (duplicateRows.length > 0) {
  console.error('Fail: duplicate Cloudflare beacon detected on:');
  for (const row of duplicateRows) {
    console.error(`- ${row.page} (${row.beaconCount})`);
  }
  process.exit(1);
}

process.exit(0);
