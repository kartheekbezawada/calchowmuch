#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { JSDOM } from 'jsdom';

const DEFAULTS = {
  sitemapPath: 'public/sitemap.xml',
  publicDir: 'public',
  outputDir: 'requirements/universal-rules/seo_exports',
};

const BRAND_REGEX = /calchowmuch|calculate\s+how\s+much/i;
const ISSUE_ORDER = [
  'MISSING_CANONICAL',
  'MISSING_TITLE',
  'TITLE_TOO_SHORT',
  'TITLE_TOO_LONG',
  'MISSING_META_DESCRIPTION',
  'DESC_TOO_SHORT',
  'DESC_TOO_LONG',
  'TITLE_DUPLICATE',
  'DESC_DUPLICATE',
  'CANONICAL_DUPLICATE',
  'TITLE_H1_MISMATCH',
  'MISSING_H1',
  'MISSING_JSONLD',
  'MISSING_BREADCRUMB_SCHEMA',
  'MISSING_SOFTWAREAPP_SCHEMA',
  'LOW_WORD_COUNT',
  'NON_HTTPS_CANONICAL',
  'CANONICAL_WRONG_HOST',
  'JSONLD_PARSE_ERROR',
];

const OUTPUT_COLUMNS = [
  'calculator_name',
  'page_title',
  'meta_description',
  'title_length',
  'meta_description_length',
  'canonical_path',
  'title_has_brand',
  'description_has_brand',
  'title_has_pipe_or_dash',
  'has_h1',
  'h1_text',
  'h1_length',
  'title_equals_h1',
  'has_schema_jsonld',
  'schema_types',
  'has_breadcrumb_schema',
  'has_faq_schema',
  'has_softwareapp_schema',
  'word_count_estimate',
  'issues',
];

function parseArgs(argv) {
  const args = { ...DEFAULTS };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--sitemap') {
      args.sitemapPath = argv[index + 1];
      index += 1;
    } else if (token === '--public-dir') {
      args.publicDir = argv[index + 1];
      index += 1;
    } else if (token === '--output-dir') {
      args.outputDir = argv[index + 1];
      index += 1;
    }
  }
  return args;
}

function collapseWhitespace(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeForDuplicate(value) {
  return collapseWhitespace(value).toLowerCase();
}

function toTitleCaseSlug(value) {
  return String(value ?? '')
    .split(/[-_]+/g)
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => token[0].toUpperCase() + token.slice(1))
    .join(' ');
}

function slugFromUrl(loc) {
  try {
    return new URL(loc).pathname;
  } catch {
    return '';
  }
}

function sitemapPathToFilePath(slugPath, publicDir) {
  if (!slugPath || slugPath === '/') {
    return path.join(publicDir, 'index.html');
  }

  const cleanPath = slugPath.replace(/^\/+/, '');
  const ext = path.extname(cleanPath);
  if (ext) {
    return path.join(publicDir, cleanPath);
  }

  if (slugPath.endsWith('/')) {
    return path.join(publicDir, cleanPath, 'index.html');
  }

  return path.join(publicDir, cleanPath, 'index.html');
}

function deriveCalculatorName({ h1Text, pageTitle, canonicalPath, slugPath }) {
  if (collapseWhitespace(h1Text)) {
    return collapseWhitespace(h1Text);
  }

  const normalizedTitle = collapseWhitespace(pageTitle);
  if (normalizedTitle) {
    return normalizedTitle.split(/\s+[|-]\s+/)[0].trim();
  }

  const pathValue = collapseWhitespace(canonicalPath || slugPath);
  if (!pathValue || pathValue === '/') {
    return 'Home';
  }

  const segments = pathValue.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || 'page';
  return toTitleCaseSlug(lastSegment);
}

function collectTypes(payload, types = []) {
  if (!payload) return types;

  if (Array.isArray(payload)) {
    payload.forEach((entry) => collectTypes(entry, types));
    return types;
  }

  if (typeof payload !== 'object') return types;

  const typeField = payload['@type'];
  if (typeof typeField === 'string') {
    types.push(typeField);
  } else if (Array.isArray(typeField)) {
    typeField.forEach((entry) => {
      if (typeof entry === 'string') {
        types.push(entry);
      }
    });
  }

  if (payload['@graph']) {
    collectTypes(payload['@graph'], types);
  }

  return types;
}

function dedupePreserveOrder(values) {
  const seen = new Set();
  const result = [];
  values.forEach((value) => {
    const key = String(value ?? '');
    if (!key || seen.has(key)) return;
    seen.add(key);
    result.push(key);
  });
  return result;
}

function parseJsonLd(document) {
  const nodes = [...document.querySelectorAll('script[type="application/ld+json"]')];
  const parsedPayloads = [];
  let hadParseError = false;

  nodes.forEach((node) => {
    const raw = node.textContent?.trim() ?? '';
    if (!raw) {
      return;
    }
    try {
      parsedPayloads.push(JSON.parse(raw));
    } catch {
      hadParseError = true;
    }
  });

  const allTypes = [];
  parsedPayloads.forEach((payload) => collectTypes(payload, allTypes));
  const uniqueTypes = dedupePreserveOrder(allTypes);

  return {
    hasSchemaJsonLd: nodes.length > 0,
    schemaTypes: uniqueTypes,
    hadParseError,
  };
}

function parseCanonicalParts(canonicalUrl) {
  if (!canonicalUrl) {
    return { canonicalHost: '', canonicalPath: '' };
  }

  try {
    const parsed = new URL(canonicalUrl);
    return {
      canonicalHost: parsed.hostname.toLowerCase(),
      canonicalPath: parsed.pathname || '',
    };
  } catch {
    return { canonicalHost: '', canonicalPath: '' };
  }
}

function toTokenSet(value) {
  const collapsed = collapseWhitespace(value).toLowerCase();
  return collapsed
    .replace(/calchowmuch/g, '')
    .replace(/calculate how much/g, '')
    .split(/[^a-z0-9]+/g)
    .map((token) => token.trim())
    .filter((token) => token.length > 2);
}

function hasSignificantTitleH1Mismatch(title, h1) {
  const h1Tokens = toTokenSet(h1);
  const titleTokens = new Set(toTokenSet(title));

  if (!h1Tokens.length || !titleTokens.size) {
    return false;
  }

  const overlapCount = h1Tokens.filter((token) => titleTokens.has(token)).length;
  const overlapRatio = overlapCount / h1Tokens.length;
  return overlapRatio < 0.45;
}

function estimateWordCount(document) {
  const body = document.querySelector('body');
  if (!body) {
    return 0;
  }

  const clone = body.cloneNode(true);
  clone.querySelectorAll('script,style,noscript,nav,footer').forEach((node) => node.remove());

  const text = collapseWhitespace(clone.textContent ?? '');
  if (!text) {
    return 0;
  }

  return text
    .split(/[^A-Za-z0-9']+/g)
    .map((token) => token.trim())
    .filter(Boolean).length;
}

function isCalculatorPage({ canonicalPath, sourceFilePath }) {
  const canonical = canonicalPath || '';
  if (canonical.includes('/calculators/')) return true;
  if (canonical.endsWith('-calculator')) return true;
  return /calculator/i.test(sourceFilePath);
}

function toCsvCell(value) {
  const raw = String(value ?? '');
  if (!/[",\n]/.test(raw)) {
    return raw;
  }
  return `"${raw.replace(/"/g, '""')}"`;
}

function rowToCsv(row, columns) {
  return columns.map((column) => toCsvCell(row[column])).join(',');
}

function parseSitemapLocs(xml) {
  const locs = [];
  const pattern = /<loc>(.*?)<\/loc>/g;
  let match = pattern.exec(xml);
  while (match) {
    const loc = collapseWhitespace(match[1]);
    if (loc) {
      locs.push(loc);
    }
    match = pattern.exec(xml);
  }
  return locs;
}

function addIssue(row, issue) {
  row.issueSet.add(issue);
}

function applyBaseRules(row) {
  if (!row.canonical_url) {
    addIssue(row, 'MISSING_CANONICAL');
  }

  if (!row.page_title) {
    addIssue(row, 'MISSING_TITLE');
  } else {
    if (row.title_length < 25) {
      addIssue(row, 'TITLE_TOO_SHORT');
    }
    if (row.title_length > 60) {
      addIssue(row, 'TITLE_TOO_LONG');
    }
  }

  if (!row.meta_description) {
    addIssue(row, 'MISSING_META_DESCRIPTION');
  } else {
    if (row.meta_description_length < 120) {
      addIssue(row, 'DESC_TOO_SHORT');
    }
    if (row.meta_description_length > 160) {
      addIssue(row, 'DESC_TOO_LONG');
    }
  }

  if (!row.has_h1) {
    addIssue(row, 'MISSING_H1');
  }

  if (!row.has_schema_jsonld) {
    addIssue(row, 'MISSING_JSONLD');
  }

  if (row.had_jsonld_parse_error) {
    addIssue(row, 'JSONLD_PARSE_ERROR');
  }

  if (row.canonical_url && !/^https:\/\//i.test(row.canonical_url)) {
    addIssue(row, 'NON_HTTPS_CANONICAL');
  }

  if (row.canonical_host && row.canonical_host !== 'calchowmuch.com') {
    addIssue(row, 'CANONICAL_WRONG_HOST');
  }

  if (
    row.page_title &&
    row.h1_text &&
    hasSignificantTitleH1Mismatch(row.page_title, row.h1_text)
  ) {
    addIssue(row, 'TITLE_H1_MISMATCH');
  }

  if (row.is_calculator_page) {
    if (!row.has_breadcrumb_schema) {
      addIssue(row, 'MISSING_BREADCRUMB_SCHEMA');
    }
    if (!row.has_softwareapp_schema) {
      addIssue(row, 'MISSING_SOFTWAREAPP_SCHEMA');
    }
    if (row.word_count_estimate < 400) {
      addIssue(row, 'LOW_WORD_COUNT');
    }
  }
}

function markDuplicateIssues(rows, key, issueFlag) {
  const groups = new Map();
  rows.forEach((row) => {
    const value = row[key];
    const normalized = normalizeForDuplicate(value);
    if (!normalized) return;
    if (!groups.has(normalized)) groups.set(normalized, []);
    groups.get(normalized).push(row);
  });

  groups.forEach((groupRows) => {
    if (groupRows.length > 1) {
      groupRows.forEach((row) => addIssue(row, issueFlag));
    }
  });

  return groups;
}

function topDuplicates(groups, limit = 20) {
  return [...groups.entries()]
    .map(([normalized, rows]) => ({
      normalized,
      count: rows.length,
      sample: collapseWhitespace(rows[0]?.page_title || rows[0]?.meta_description || normalized),
    }))
    .filter((entry) => entry.count > 1)
    .sort((a, b) => b.count - a.count || a.sample.localeCompare(b.sample))
    .slice(0, limit);
}

async function buildRow({ sourceUrl, slugPath, sourceFilePath }) {
  let html = '';
  try {
    html = await fs.readFile(sourceFilePath, 'utf8');
  } catch {
    html = '';
  }

  const dom = html ? new JSDOM(html, { url: sourceUrl }) : null;
  const document = dom?.window?.document ?? null;

  const pageTitle = collapseWhitespace(document?.querySelector('title')?.textContent ?? '');
  const metaDescription = collapseWhitespace(
    document?.querySelector('meta[name="description"]')?.getAttribute('content') ?? ''
  );
  const canonicalUrl = collapseWhitespace(
    document?.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? ''
  );

  const h1Node = document?.querySelector('h1') ?? null;
  const hasH1 = Boolean(h1Node);
  const h1FullText = collapseWhitespace(h1Node?.textContent ?? '');
  const h1Text = h1FullText.length > 160 ? h1FullText.slice(0, 160) : h1FullText;

  const schema = document
    ? parseJsonLd(document)
    : { hasSchemaJsonLd: false, schemaTypes: [], hadParseError: false };
  const schemaTypesString = schema.schemaTypes.join(';');
  const schemaTypesLower = new Set(schema.schemaTypes.map((type) => type.toLowerCase()));

  const { canonicalHost, canonicalPath } = parseCanonicalParts(canonicalUrl);
  const effectiveCanonicalPath = canonicalPath || slugPath || '';
  const calculatorPage = isCalculatorPage({
    canonicalPath: effectiveCanonicalPath,
    sourceFilePath,
  });

  const row = {
    calculator_name: deriveCalculatorName({
      h1Text,
      pageTitle,
      canonicalPath: effectiveCanonicalPath,
      slugPath,
    }),
    page_title: pageTitle,
    meta_description: metaDescription,
    canonical_url: canonicalUrl,
    title_length: pageTitle.length,
    meta_description_length: metaDescription.length,
    canonical_host: canonicalHost,
    canonical_path: canonicalPath,
    title_has_brand: BRAND_REGEX.test(pageTitle),
    description_has_brand: BRAND_REGEX.test(metaDescription),
    title_has_pipe_or_dash: pageTitle.includes(' | ') || pageTitle.includes(' - '),
    has_h1: hasH1,
    h1_text: h1Text,
    h1_length: h1Text.length,
    title_equals_h1:
      Boolean(pageTitle && h1Text) &&
      normalizeForDuplicate(pageTitle) === normalizeForDuplicate(h1Text),
    has_schema_jsonld: schema.hasSchemaJsonLd,
    schema_types: schemaTypesString,
    has_breadcrumb_schema: schemaTypesLower.has('breadcrumblist'),
    has_faq_schema: schemaTypesLower.has('faqpage'),
    has_softwareapp_schema: schemaTypesLower.has('softwareapplication'),
    word_count_estimate: document ? estimateWordCount(document) : 0,
    issues: '',
    issueSet: new Set(),
    is_calculator_page: calculatorPage,
    had_jsonld_parse_error: schema.hadParseError,
  };

  applyBaseRules(row);
  return row;
}

function finalizeIssues(row) {
  row.issues = ISSUE_ORDER.filter((issue) => row.issueSet.has(issue)).join(';');
}

function sortRowsDeterministically(rows) {
  rows.sort((left, right) => {
    const byCanonical = String(left.canonical_url || '').localeCompare(String(right.canonical_url || ''));
    if (byCanonical !== 0) return byCanonical;
    return String(left.source_file_path || '').localeCompare(String(right.source_file_path || ''));
  });
}

function printSummary({ rows, issueCounts, titleDupTop, descDupTop }) {
  process.stdout.write(`total pages scanned: ${rows.length}\n`);
  process.stdout.write(
    `total calculator pages detected: ${rows.filter((row) => row.is_calculator_page).length}\n`
  );

  process.stdout.write('counts per issue flag (top 20):\n');
  const issueEntries = [...issueCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 20);
  issueEntries.forEach(([issue, count]) => {
    process.stdout.write(`- ${issue}: ${count}\n`);
  });

  process.stdout.write('top 20 duplicate titles:\n');
  if (titleDupTop.length === 0) {
    process.stdout.write('- none\n');
  } else {
    titleDupTop.forEach((entry) => {
      process.stdout.write(`- ${entry.count} | ${entry.sample}\n`);
    });
  }

  process.stdout.write('top 20 duplicate descriptions:\n');
  if (descDupTop.length === 0) {
    process.stdout.write('- none\n');
  } else {
    descDupTop.forEach((entry) => {
      process.stdout.write(`- ${entry.count} | ${entry.sample}\n`);
    });
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sitemapXml = await fs.readFile(args.sitemapPath, 'utf8');
  const locs = parseSitemapLocs(sitemapXml);

  const rows = [];
  for (const loc of locs) {
    const slugPath = slugFromUrl(loc);
    const sourceFilePath = sitemapPathToFilePath(slugPath, args.publicDir);
    const row = await buildRow({
      sourceUrl: loc,
      slugPath,
      sourceFilePath,
    });
    rows.push(row);
  }

  const titleGroups = markDuplicateIssues(rows, 'page_title', 'TITLE_DUPLICATE');
  const descGroups = markDuplicateIssues(rows, 'meta_description', 'DESC_DUPLICATE');
  markDuplicateIssues(rows, 'canonical_url', 'CANONICAL_DUPLICATE');

  rows.forEach(finalizeIssues);
  sortRowsDeterministically(rows);

  const issuesOnlyRows = rows.filter((row) => row.issues);
  const issueCounts = new Map();
  rows.forEach((row) => {
    if (!row.issues) return;
    row.issues.split(';').forEach((issue) => {
      issueCounts.set(issue, (issueCounts.get(issue) ?? 0) + 1);
    });
  });

  const outputDir = args.outputDir;
  await fs.mkdir(outputDir, { recursive: true });

  const fullCsvPath = path.join(outputDir, 'pages_seo_export.csv');
  const issuesCsvPath = path.join(outputDir, 'pages_seo_issues.csv');

  const fullCsv = [
    OUTPUT_COLUMNS.join(','),
    ...rows.map((row) => rowToCsv(row, OUTPUT_COLUMNS)),
  ].join('\n');
  await fs.writeFile(fullCsvPath, `${fullCsv}\n`, 'utf8');

  const issuesCsv = [
    OUTPUT_COLUMNS.join(','),
    ...issuesOnlyRows.map((row) => rowToCsv(row, OUTPUT_COLUMNS)),
  ].join('\n');
  await fs.writeFile(issuesCsvPath, `${issuesCsv}\n`, 'utf8');

  const titleDupTop = topDuplicates(titleGroups, 20).map((entry) => ({
    count: entry.count,
    sample: entry.sample,
  }));
  const descDupTop = topDuplicates(descGroups, 20).map((entry) => ({
    count: entry.count,
    sample: entry.sample,
  }));

  printSummary({ rows, issueCounts, titleDupTop, descDupTop });
  process.stdout.write(`full export: ${fullCsvPath}\n`);
  process.stdout.write(`issues export: ${issuesCsvPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${String(error)}\n`);
  process.exit(1);
});
