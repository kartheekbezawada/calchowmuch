#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { getCalculatorScope, getClusterScope } from './test-scope-resolver.mjs';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const REPORT_MD_PATH = path.join(ROOT, 'schema_duplicates_report.md');
const REPORT_CSV_PATH = path.join(ROOT, 'schema_duplicates_report.csv');
const DEFAULT_SITE_URL = 'https://calchowmuch.com';
const REMOVE_MARKER = Symbol('schema-node-remove');

export const TARGET_SCHEMA_TYPES = ['FAQPage', 'BreadcrumbList', 'SoftwareApplication'];
const TARGET_SCHEMA_SET = new Set(TARGET_SCHEMA_TYPES);

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function normalizeScopeMode(rawScope) {
  const value = String(rawScope || 'full')
    .trim()
    .toLowerCase();

  if (['full', 'full-repo', 'repo'].includes(value)) {
    return 'full';
  }
  if (['cluster', 'full-cluster'].includes(value)) {
    return 'cluster';
  }
  if (['calc', 'single-calculator', 'single_calc'].includes(value)) {
    return 'calc';
  }
  if (['route', 'single-route', 'single_route'].includes(value)) {
    return 'route';
  }

  throw new Error(
    `Invalid --scope value "${rawScope}". Use full|cluster|calc|route (or aliases full-repo|single-calculator).`
  );
}

export function normalizeRoutePath(rawRoute) {
  if (!rawRoute || typeof rawRoute !== 'string') {
    return null;
  }

  let route = rawRoute.trim();
  if (!route) {
    return null;
  }
  if (!route.startsWith('/')) {
    route = `/${route}`;
  }
  route = route.replace(/\/+/g, '/');
  if (route !== '/' && !route.endsWith('/')) {
    route = `${route}/`;
  }
  return route;
}

function readArgValue(argv, name) {
  const exact = argv.indexOf(name);
  if (exact >= 0 && argv[exact + 1]) {
    return argv[exact + 1];
  }
  const prefix = `${name}=`;
  const token = argv.find((entry) => entry.startsWith(prefix));
  return token ? token.slice(prefix.length) : null;
}

function hasFlag(argv, name) {
  return argv.includes(name);
}

export function parseCliArgs(argv = process.argv.slice(2)) {
  const rawScope = readArgValue(argv, '--scope') ?? 'full';
  const rawRoute = readArgValue(argv, '--route') ?? process.env.TARGET_ROUTE ?? null;

  return {
    scope: normalizeScopeMode(rawScope),
    route: normalizeRoutePath(rawRoute),
    dryRun: hasFlag(argv, '--dry-run'),
  };
}

function walkIndexHtmlFiles(dirPath, out = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkIndexHtmlFiles(fullPath, out);
    } else if (entry.isFile() && entry.name === 'index.html') {
      out.push(fullPath);
    }
  });
  return out;
}

function routeToPublicIndexPath(routePath) {
  const normalized = normalizeRoutePath(routePath);
  if (!normalized) {
    return null;
  }
  if (normalized === '/') {
    return path.join(PUBLIC_DIR, 'index.html');
  }
  const withoutOuterSlashes = normalized.replace(/^\/|\/$/g, '');
  return path.join(PUBLIC_DIR, withoutOuterSlashes, 'index.html');
}

export function resolveScopeFiles({ scope, route, env = process.env } = {}) {
  if (!scope) {
    throw new Error('Scope is required to resolve files.');
  }

  if (scope === 'full') {
    return walkIndexHtmlFiles(PUBLIC_DIR).sort();
  }

  if (scope === 'cluster') {
    const clusterId = String(env.CLUSTER || '').trim();
    if (!clusterId) {
      throw new Error('CLUSTER is required for --scope=cluster.');
    }
    const clusterScope = getClusterScope(clusterId);
    const clusterRoutes = Array.isArray(clusterScope.routes) ? clusterScope.routes : [];
    if (!clusterRoutes.length) {
      throw new Error(`No routes found for CLUSTER="${clusterId}" in scope map.`);
    }

    const files = [...new Set(clusterRoutes.map(routeToPublicIndexPath).filter(Boolean))];
    const missing = files.filter((filePath) => !fs.existsSync(filePath));
    if (missing.length) {
      throw new Error(
        `Missing generated HTML for CLUSTER="${clusterId}": ${missing
          .map((entry) => path.relative(ROOT, entry))
          .join(', ')}`
      );
    }
    return files.sort();
  }

  if (scope === 'calc') {
    const clusterId = String(env.CLUSTER || '').trim();
    const calcId = String(env.CALC || '').trim();
    if (!clusterId) {
      throw new Error('CLUSTER is required for --scope=calc.');
    }
    if (!calcId) {
      throw new Error('CALC is required for --scope=calc.');
    }
    const calcScope = getCalculatorScope(clusterId, calcId);
    const calcRoute = normalizeRoutePath(calcScope.calculator?.route);
    if (!calcRoute) {
      throw new Error(`Missing route in scope map for CLUSTER="${clusterId}" CALC="${calcId}".`);
    }

    const filePath = routeToPublicIndexPath(calcRoute);
    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error(
        `Missing generated HTML for CLUSTER="${clusterId}" CALC="${calcId}" (${calcRoute}).`
      );
    }
    return [filePath];
  }

  if (scope === 'route') {
    const normalizedRoute = normalizeRoutePath(route);
    if (!normalizedRoute) {
      throw new Error('--route is required for --scope=route.');
    }
    const filePath = routeToPublicIndexPath(normalizedRoute);
    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error(`Missing generated HTML for route ${normalizedRoute}.`);
    }
    return [filePath];
  }

  throw new Error(`Unsupported scope "${scope}".`);
}

export function extractJsonLdScripts(html) {
  const scripts = [];
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptIndex = 0;

  while ((match = scriptRegex.exec(html))) {
    const fullMatch = match[0];
    const attrs = match[1] || '';
    const typeMatch = attrs.match(
      /\btype\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'>/]+))/i
    );
    const typeValue = (typeMatch?.[1] || typeMatch?.[2] || typeMatch?.[3] || '').toLowerCase();
    if (typeValue !== 'application/ld+json') {
      continue;
    }

    const openTagEndLocal = fullMatch.indexOf('>') + 1;
    const closeTagStartLocal = fullMatch.toLowerCase().lastIndexOf('</script');

    scripts.push({
      index: scriptIndex,
      start: match.index,
      end: scriptRegex.lastIndex,
      openTag: fullMatch.slice(0, openTagEndLocal),
      closeTag: fullMatch.slice(closeTagStartLocal),
      rawText: match[2] || '',
      parseError: false,
      payload: null,
      changed: false,
    });

    scriptIndex += 1;
  }

  return scripts;
}

function escapeJsonForScript(payload) {
  return JSON.stringify(payload).replace(/<\/script/gi, '<\\/script');
}

function getNodeTypes(node) {
  const rawType = node?.['@type'];
  if (typeof rawType === 'string') {
    return [rawType];
  }
  if (Array.isArray(rawType)) {
    return rawType.filter((entry) => typeof entry === 'string');
  }
  return [];
}

function normalizeNodesFromPayload(payload) {
  const nodes = [];

  const pushNode = (value) => {
    if (!isObject(value)) {
      return;
    }
    if (Array.isArray(value['@graph'])) {
      value['@graph'].forEach((graphNode) => {
        if (isObject(graphNode)) {
          nodes.push(graphNode);
        }
      });
      return;
    }
    nodes.push(value);
  };

  if (Array.isArray(payload)) {
    payload.forEach((item) => pushNode(item));
    return nodes;
  }

  pushNode(payload);
  return nodes;
}

function extractFaqSnippet(node) {
  const entities = Array.isArray(node?.mainEntity) ? node.mainEntity : [];
  const questions = entities
    .map((entity) => String(entity?.name || '').trim())
    .filter(Boolean)
    .slice(0, 2);
  return questions.join(' | ');
}

function extractBreadcrumbSnippet(node) {
  const items = Array.isArray(node?.itemListElement) ? node.itemListElement : [];
  const names = items
    .map((item) => String(item?.name || '').trim())
    .filter(Boolean)
    .slice(0, 8);
  return names.join(' > ');
}

function extractSoftwareSnippet(node) {
  const name = String(node?.name || '').trim();
  const category = String(node?.applicationCategory || '').trim();
  if (name && category) {
    return `${name} (${category})`;
  }
  return name || category || '';
}

function extractSnippetByType(type, node) {
  if (type === 'FAQPage') {
    return extractFaqSnippet(node);
  }
  if (type === 'BreadcrumbList') {
    return extractBreadcrumbSnippet(node);
  }
  if (type === 'SoftwareApplication') {
    return extractSoftwareSnippet(node);
  }
  return '';
}

function createEmptyTypeCounter() {
  return TARGET_SCHEMA_TYPES.reduce((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {});
}

function createTypeCollector() {
  return {
    counts: createEmptyTypeCounter(),
    blocks: TARGET_SCHEMA_TYPES.reduce((acc, type) => {
      acc[type] = new Set();
      return acc;
    }, {}),
    snippets: TARGET_SCHEMA_TYPES.reduce((acc, type) => {
      acc[type] = new Set();
      return acc;
    }, {}),
  };
}

function collectPayloadTypeData(payload, blockIndex, collector) {
  const nodes = normalizeNodesFromPayload(payload);
  nodes.forEach((node) => {
    const types = getNodeTypes(node);
    types.forEach((type) => {
      if (!TARGET_SCHEMA_SET.has(type)) {
        return;
      }
      collector.counts[type] += 1;
      collector.blocks[type].add(blockIndex);
      const snippet = extractSnippetByType(type, node);
      if (snippet) {
        collector.snippets[type].add(snippet);
      }
    });
  });
}

function buildNodeRefs(state) {
  const refs = [];
  const payload = state.payload;

  if (Array.isArray(payload)) {
    payload.forEach((item, itemIndex) => {
      if (isObject(item) && Array.isArray(item['@graph'])) {
        item['@graph'].forEach((_, graphIndex) => {
          refs.push({
            kind: 'graph-in-array',
            state,
            arrayIndex: itemIndex,
            graphIndex,
          });
        });
      } else {
        refs.push({
          kind: 'array',
          state,
          arrayIndex: itemIndex,
        });
      }
    });
    return refs;
  }

  if (isObject(payload) && Array.isArray(payload['@graph'])) {
    payload['@graph'].forEach((_, graphIndex) => {
      refs.push({
        kind: 'graph',
        state,
        graphIndex,
      });
    });
    return refs;
  }

  refs.push({
    kind: 'root',
    state,
  });
  return refs;
}

function readRefNode(ref) {
  if (ref.kind === 'root') {
    return ref.state.payload;
  }
  if (ref.kind === 'array') {
    return ref.state.payload?.[ref.arrayIndex];
  }
  if (ref.kind === 'graph') {
    return ref.state.payload?.['@graph']?.[ref.graphIndex];
  }
  if (ref.kind === 'graph-in-array') {
    return ref.state.payload?.[ref.arrayIndex]?.['@graph']?.[ref.graphIndex];
  }
  return null;
}

function writeRefNode(ref, node) {
  if (ref.kind === 'root') {
    ref.state.payload = node;
    ref.state.changed = true;
    return;
  }
  if (ref.kind === 'array') {
    ref.state.payload[ref.arrayIndex] = node;
    ref.state.changed = true;
    return;
  }
  if (ref.kind === 'graph') {
    ref.state.payload['@graph'][ref.graphIndex] = node;
    ref.state.changed = true;
    return;
  }
  if (ref.kind === 'graph-in-array') {
    ref.state.payload[ref.arrayIndex]['@graph'][ref.graphIndex] = node;
    ref.state.changed = true;
  }
}

function removeRefNode(ref) {
  writeRefNode(ref, REMOVE_MARKER);
}

function cleanupPayload(payload) {
  if (payload === REMOVE_MARKER || payload == null) {
    return null;
  }

  if (Array.isArray(payload)) {
    const cleaned = [];
    payload.forEach((item) => {
      if (item === REMOVE_MARKER) {
        return;
      }
      if (isObject(item) && Array.isArray(item['@graph'])) {
        const cleanedGraph = item['@graph'].filter((entry) => entry !== REMOVE_MARKER);
        if (!cleanedGraph.length) {
          return;
        }
        if (cleanedGraph.length !== item['@graph'].length) {
          cleaned.push({
            ...item,
            '@graph': cleanedGraph,
          });
        } else {
          cleaned.push(item);
        }
        return;
      }
      cleaned.push(item);
    });
    return cleaned.length ? cleaned : null;
  }

  if (isObject(payload) && Array.isArray(payload['@graph'])) {
    const cleanedGraph = payload['@graph'].filter((entry) => entry !== REMOVE_MARKER);
    if (!cleanedGraph.length) {
      return null;
    }
    if (cleanedGraph.length !== payload['@graph'].length) {
      return {
        ...payload,
        '@graph': cleanedGraph,
      };
    }
  }

  return payload;
}

function dedupeScriptStates(scriptStates) {
  const seenGlobal = new Set();

  scriptStates.forEach((state) => {
    if (state.parseError || state.payload == null) {
      return;
    }

    const refs = buildNodeRefs(state);
    refs.forEach((ref) => {
      const node = readRefNode(ref);
      if (!isObject(node)) {
        return;
      }

      const rawType = node['@type'];
      if (typeof rawType === 'string') {
        if (!TARGET_SCHEMA_SET.has(rawType)) {
          return;
        }
        if (seenGlobal.has(rawType)) {
          removeRefNode(ref);
          return;
        }
        seenGlobal.add(rawType);
        return;
      }

      if (!Array.isArray(rawType)) {
        return;
      }

      const localSeen = new Set();
      const filtered = [];
      let changed = false;

      rawType.forEach((entry) => {
        if (typeof entry !== 'string') {
          filtered.push(entry);
          return;
        }
        if (!TARGET_SCHEMA_SET.has(entry)) {
          filtered.push(entry);
          return;
        }
        if (seenGlobal.has(entry) || localSeen.has(entry)) {
          changed = true;
          return;
        }
        localSeen.add(entry);
        seenGlobal.add(entry);
        filtered.push(entry);
      });

      if (!changed) {
        return;
      }

      if (!filtered.length) {
        removeRefNode(ref);
        return;
      }

      writeRefNode(ref, {
        ...node,
        '@type': filtered,
      });
    });
  });

  scriptStates.forEach((state) => {
    if (state.parseError || !state.changed) {
      return;
    }
    state.payload = cleanupPayload(state.payload);
  });
}

function reconstructHtmlWithScriptUpdates(originalHtml, scriptStates) {
  let cursor = 0;
  let output = '';

  scriptStates.forEach((state) => {
    output += originalHtml.slice(cursor, state.start);
    cursor = state.end;

    if (state.parseError || !state.changed) {
      output += originalHtml.slice(state.start, state.end);
      return;
    }

    if (state.payload == null) {
      return;
    }

    const jsonText = escapeJsonForScript(state.payload);
    output += `${state.openTag}${jsonText}${state.closeTag}`;
  });

  output += originalHtml.slice(cursor);
  return output;
}

function canonicalFromHtml(html) {
  const match = html.match(
    /<link\b(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']([^"']+)["'])[^>]*>/i
  );
  return match?.[1] || null;
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

function deriveUrl({ filePath, html }) {
  const canonical = canonicalFromHtml(html);
  if (canonical) {
    return canonical;
  }
  const routePath = deriveRoutePath(filePath);
  return new URL(routePath, DEFAULT_SITE_URL).href;
}

function stringifySetValues(setValue, separator = ' | ') {
  return [...setValue].join(separator);
}

function blocksSetToString(setValue) {
  const values = [...setValue].sort((a, b) => a - b);
  return `[${values.join(',')}]`;
}

function hasDuplicateType(counter) {
  return TARGET_SCHEMA_TYPES.some((type) => Number(counter[type] || 0) > 1);
}

export function processHtmlDocument({ html, filePath }) {
  const scriptStates = extractJsonLdScripts(html);
  const preCollector = createTypeCollector();
  const postCollector = createTypeCollector();
  let parseErrorCount = 0;

  scriptStates.forEach((state) => {
    const trimmed = state.rawText.trim();
    if (!trimmed) {
      return;
    }
    try {
      state.payload = JSON.parse(trimmed);
      collectPayloadTypeData(state.payload, state.index, preCollector);
    } catch {
      state.parseError = true;
      parseErrorCount += 1;
    }
  });

  if (!parseErrorCount) {
    dedupeScriptStates(scriptStates);
    scriptStates.forEach((state) => {
      if (state.parseError || state.payload == null) {
        return;
      }
      collectPayloadTypeData(state.payload, state.index, postCollector);
    });
  }

  const changed = scriptStates.some((state) => state.changed);
  const updatedHtml = changed ? reconstructHtmlWithScriptUpdates(html, scriptStates) : html;

  const preHasDuplicates = hasDuplicateType(preCollector.counts);
  const postHasDuplicates = hasDuplicateType(postCollector.counts);

  let status = 'OK';
  let action = changed ? 'FIXED' : 'UNCHANGED';

  if (parseErrorCount > 0) {
    status = 'PARSE_ERROR';
    action = 'PARSE_ERROR';
  } else if (postHasDuplicates) {
    status = 'DUPLICATE';
    action = 'UNRESOLVED';
  }

  const relPath = path.relative(ROOT, filePath).replace(/\\/g, '/');

  return {
    path: relPath,
    route: deriveRoutePath(filePath),
    url: deriveUrl({ filePath, html }),
    totalJsonLdBlocks: scriptStates.length,
    parseErrorCount,
    preCounts: preCollector.counts,
    postCounts: postCollector.counts,
    preBlocks: TARGET_SCHEMA_TYPES.reduce((acc, type) => {
      acc[type] = [...preCollector.blocks[type]].sort((a, b) => a - b);
      return acc;
    }, {}),
    snippets: TARGET_SCHEMA_TYPES.reduce((acc, type) => {
      acc[type] = [...preCollector.snippets[type]];
      return acc;
    }, {}),
    hadDuplicatesBeforeFix: preHasDuplicates,
    changed,
    status,
    action,
    updatedHtml,
  };
}

function toCsvCell(value) {
  const text = String(value ?? '');
  if (/[,"\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function buildCsvReport(rows) {
  const header = [
    'path',
    'route',
    'url',
    'jsonld_blocks',
    'parse_errors',
    'faq_pre',
    'breadcrumb_pre',
    'software_pre',
    'faq_post',
    'breadcrumb_post',
    'software_post',
    'faq_blocks',
    'breadcrumb_blocks',
    'software_blocks',
    'faq_snippet',
    'breadcrumb_snippet',
    'software_snippet',
    'status',
    'action',
  ];

  const lines = [header.join(',')];
  rows.forEach((row) => {
    const fields = [
      row.path,
      row.route,
      row.url,
      row.totalJsonLdBlocks,
      row.parseErrorCount,
      row.preCounts.FAQPage,
      row.preCounts.BreadcrumbList,
      row.preCounts.SoftwareApplication,
      row.postCounts.FAQPage,
      row.postCounts.BreadcrumbList,
      row.postCounts.SoftwareApplication,
      blocksSetToString(new Set(row.preBlocks.FAQPage)),
      blocksSetToString(new Set(row.preBlocks.BreadcrumbList)),
      blocksSetToString(new Set(row.preBlocks.SoftwareApplication)),
      row.snippets.FAQPage.join(' || '),
      row.snippets.BreadcrumbList.join(' || '),
      row.snippets.SoftwareApplication.join(' || '),
      row.status,
      row.action,
    ];
    lines.push(fields.map((field) => toCsvCell(field)).join(','));
  });
  return `${lines.join('\n')}\n`;
}

function buildMarkdownReport({ rows, scope, summary }) {
  const lines = [];
  lines.push('# Schema Dedupe Report');
  lines.push('');
  lines.push(`- Scope: \`${scope}\``);
  lines.push(`- Pages scanned: **${summary.scanned}**`);
  lines.push(`- Pages changed (auto-fix): **${summary.changed}**`);
  lines.push(`- Parse errors: **${summary.parseErrors}**`);
  lines.push(`- Unresolved duplicates: **${summary.unresolved}**`);
  lines.push(`- Status: **${summary.failed ? 'FAIL' : 'PASS'}**`);
  lines.push('');
  lines.push(
    '| Path | Blocks | FAQ (pre→post) | Breadcrumb (pre→post) | SoftwareApplication (pre→post) | Blocks by Type | Snippets | Status | Action |'
  );
  lines.push('| :--- | ---: | :---: | :---: | :---: | :--- | :--- | :---: | :---: |');

  rows.forEach((row) => {
    const blocksByType = [
      `FAQ ${blocksSetToString(new Set(row.preBlocks.FAQPage))}`,
      `Breadcrumb ${blocksSetToString(new Set(row.preBlocks.BreadcrumbList))}`,
      `Software ${blocksSetToString(new Set(row.preBlocks.SoftwareApplication))}`,
    ].join('<br>');

    const snippets = [
      row.snippets.FAQPage.length ? `FAQ: ${row.snippets.FAQPage.join(' || ')}` : null,
      row.snippets.BreadcrumbList.length
        ? `Breadcrumb: ${row.snippets.BreadcrumbList.join(' || ')}`
        : null,
      row.snippets.SoftwareApplication.length
        ? `Software: ${row.snippets.SoftwareApplication.join(' || ')}`
        : null,
    ]
      .filter(Boolean)
      .join('<br>');

    lines.push(
      `| \`${row.path}\` | ${row.totalJsonLdBlocks} | ${row.preCounts.FAQPage}→${row.postCounts.FAQPage} | ${row.preCounts.BreadcrumbList}→${row.postCounts.BreadcrumbList} | ${row.preCounts.SoftwareApplication}→${row.postCounts.SoftwareApplication} | ${blocksByType || '-'} | ${snippets || '-'} | ${row.status} | ${row.action} |`
    );
  });

  lines.push('');
  return `${lines.join('\n')}\n`;
}

function runDedupe({ files, dryRun, scopeLabel }) {
  const rows = [];

  files.forEach((filePath) => {
    const html = fs.readFileSync(filePath, 'utf8');
    const row = processHtmlDocument({ html, filePath });
    rows.push(row);
    if (row.changed && !dryRun && row.status !== 'PARSE_ERROR') {
      fs.writeFileSync(filePath, row.updatedHtml);
    }
  });

  const summary = {
    scanned: rows.length,
    changed: rows.filter((row) => row.changed).length,
    parseErrors: rows.filter((row) => row.status === 'PARSE_ERROR').length,
    unresolved: rows.filter((row) => row.status === 'DUPLICATE').length,
    failed: false,
  };
  summary.failed = summary.parseErrors > 0 || summary.unresolved > 0;

  fs.writeFileSync(REPORT_MD_PATH, buildMarkdownReport({ rows, scope: scopeLabel, summary }));
  fs.writeFileSync(REPORT_CSV_PATH, buildCsvReport(rows));

  return { rows, summary };
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

  const scopeLabel =
    options.scope === 'route'
      ? `route:${options.route}`
      : options.scope === 'cluster'
        ? `cluster:${process.env.CLUSTER}`
        : options.scope === 'calc'
          ? `calc:${process.env.CLUSTER}/${process.env.CALC}`
          : 'full';

  const { summary } = runDedupe({
    files,
    dryRun: options.dryRun,
    scopeLabel,
  });

  console.log(
    `[schema:dedupe] scanned=${summary.scanned} changed=${summary.changed} parseErrors=${summary.parseErrors} unresolved=${summary.unresolved}`
  );
  console.log(
    `[schema:dedupe] reports: ${path.relative(ROOT, REPORT_MD_PATH)}, ${path.relative(ROOT, REPORT_CSV_PATH)}`
  );

  if (summary.failed) {
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  try {
    executeFromCli();
  } catch (error) {
    console.error(`[schema:dedupe] ${error.message}`);
    process.exit(1);
  }
}
