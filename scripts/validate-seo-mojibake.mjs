#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parseCliArgs, resolveScopeFiles } from './schema-structured-data-dedupe.mjs';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const REPORT_MD_PATH = path.join(ROOT, 'seo_mojibake_report.md');
const REPORT_CSV_PATH = path.join(ROOT, 'seo_mojibake_report.csv');

const MOJIBAKE_TOKENS = ['â€“', 'â€™', 'â€œ'];
const TRACKED_META_KEYS = new Set([
  'description',
  'og:title',
  'og:description',
  'twitter:title',
  'twitter:description',
]);

function normalizeScopeLabel({ scope, route }) {
  if (scope === 'route') {
    return `route:${route}`;
  }
  if (scope === 'cluster') {
    return `cluster:${process.env.CLUSTER || ''}`;
  }
  if (scope === 'calc') {
    return `calc:${process.env.CLUSTER || ''}/${process.env.CALC || ''}`;
  }
  return 'full';
}

function deriveRoutePath(filePath) {
  const relToPublic = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
  if (relToPublic === 'index.html') {
    return '/';
  }
  if (relToPublic.endsWith('/index.html')) {
    return `/${relToPublic.slice(0, -'/index.html'.length)}/`;
  }
  return `/${relToPublic}`;
}

function isCalculatorRoute(routePath) {
  return routePath.includes('-calculators/') || routePath.endsWith('-calculator/');
}

function parseTagAttributes(tag) {
  const attrs = {};
  const attrRegex = /([a-zA-Z_:][a-zA-Z0-9_:\-]*)\s*=\s*(["'])([\s\S]*?)\2/g;
  let match;
  while ((match = attrRegex.exec(tag))) {
    attrs[match[1].toLowerCase()] = match[3];
  }
  return attrs;
}

function tokenizeHits(text) {
  if (!text) return [];
  return MOJIBAKE_TOKENS.filter((token) => text.includes(token));
}

function snippet(text, max = 220) {
  return String(text || '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, max);
}

function scanHtml(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const rowIssues = [];

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    const hits = tokenizeHits(titleMatch[1]);
    if (hits.length) {
      rowIssues.push({
        field: 'title',
        tokens: hits,
        snippet: snippet(titleMatch[1]),
      });
    }
  }

  const metaRegex = /<meta\b[^>]*>/gi;
  let metaMatch;
  while ((metaMatch = metaRegex.exec(html))) {
    const attrs = parseTagAttributes(metaMatch[0]);
    const key = (attrs.name || attrs.property || '').toLowerCase();
    if (!TRACKED_META_KEYS.has(key)) {
      continue;
    }
    const content = attrs.content || '';
    const hits = tokenizeHits(content);
    if (hits.length) {
      rowIssues.push({
        field: `meta:${key}`,
        tokens: hits,
        snippet: snippet(content),
      });
    }
  }

  const ldRegex =
    /<script\b[^>]*type\s*=\s*(["'])application\/ld\+json\1[^>]*>([\s\S]*?)<\/script>/gi;
  let ldMatch;
  let ldIndex = 0;
  while ((ldMatch = ldRegex.exec(html))) {
    ldIndex += 1;
    const body = ldMatch[2] || '';
    const hits = tokenizeHits(body);
    if (hits.length) {
      rowIssues.push({
        field: `jsonld#${ldIndex}`,
        tokens: hits,
        snippet: snippet(body),
      });
    }
  }

  return rowIssues;
}

function toCsvCell(value) {
  const text = String(value ?? '');
  if (/[,"\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function buildCsvReport(findings) {
  const header = ['path', 'route', 'field', 'tokens', 'snippet'];
  const lines = [header.join(',')];
  findings.forEach((finding) => {
    lines.push(
      [
        finding.path,
        finding.route,
        finding.field,
        finding.tokens.join(' | '),
        finding.snippet,
      ]
        .map(toCsvCell)
        .join(',')
    );
  });
  return `${lines.join('\n')}\n`;
}

function buildMarkdownReport({ summary, scopeLabel, findings }) {
  const lines = [];
  lines.push('# SEO Mojibake Report');
  lines.push('');
  lines.push(`- Scope: \`${scopeLabel}\``);
  lines.push(`- HTML files scanned: **${summary.scannedFiles}**`);
  lines.push(`- Calculator pages scanned: **${summary.scannedCalculators}**`);
  lines.push(`- Findings: **${summary.findings}**`);
  lines.push(`- Status: **${summary.findings > 0 ? 'FAIL' : 'PASS'}**`);
  lines.push('');
  lines.push('| Path | Route | Field | Tokens | Snippet |');
  lines.push('| :--- | :--- | :--- | :--- | :--- |');

  if (!findings.length) {
    lines.push('| - | - | - | - | - |');
  } else {
    findings.forEach((finding) => {
      lines.push(
        `| \`${finding.path}\` | \`${finding.route}\` | ${finding.field} | ${finding.tokens.join(', ')} | ${finding.snippet || '-'} |`
      );
    });
  }

  lines.push('');
  return `${lines.join('\n')}\n`;
}

export function executeFromCli(argv = process.argv.slice(2)) {
  const options = parseCliArgs(argv);
  const files = resolveScopeFiles({
    scope: options.scope,
    route: options.route,
  });

  if (!files.length) {
    throw new Error(`No HTML files matched scope "${options.scope}".`);
  }

  const findings = [];
  let scannedCalculators = 0;

  files.forEach((filePath) => {
    const route = deriveRoutePath(filePath);
    if (!isCalculatorRoute(route)) {
      return;
    }
    scannedCalculators += 1;
    const issues = scanHtml(filePath);
    issues.forEach((issue) => {
      findings.push({
        path: path.relative(ROOT, filePath).replace(/\\/g, '/'),
        route,
        field: issue.field,
        tokens: issue.tokens,
        snippet: issue.snippet,
      });
    });
  });

  const summary = {
    scannedFiles: files.length,
    scannedCalculators,
    findings: findings.length,
  };

  const scopeLabel = normalizeScopeLabel({
    scope: options.scope,
    route: options.route,
  });

  fs.writeFileSync(REPORT_MD_PATH, buildMarkdownReport({ summary, scopeLabel, findings }));
  fs.writeFileSync(REPORT_CSV_PATH, buildCsvReport(findings));

  console.log(
    `[seo:mojibake] scannedFiles=${summary.scannedFiles} scannedCalculators=${summary.scannedCalculators} findings=${summary.findings}`
  );
  console.log(
    `[seo:mojibake] reports: ${path.relative(ROOT, REPORT_MD_PATH)}, ${path.relative(ROOT, REPORT_CSV_PATH)}`
  );

  if (summary.scannedCalculators === 0) {
    throw new Error(`No calculator pages found for scope "${scopeLabel}".`);
  }
  if (summary.findings > 0) {
    process.exit(1);
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)
) {
  try {
    executeFromCli();
  } catch (error) {
    console.error(`[seo:mojibake] ${error.message}`);
    process.exit(1);
  }
}
