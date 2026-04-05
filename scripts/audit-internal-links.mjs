#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { JSDOM, VirtualConsole } from 'jsdom';

const DEFAULT_BASE_URL = 'https://calchowmuch.com';
const GTEP_ROUTES = new Set([
  '/about-us/',
  '/contact-us/',
  '/faq/',
  '/faqs/',
  '/privacy/',
  '/sitemap/',
  '/sitemap.xml/',
  '/terms-and-conditions/',
]);

const DEFAULTS = {
  baseUrl: DEFAULT_BASE_URL,
  ownershipPath: 'config/clusters/route-ownership.json',
  registryPath: 'config/clusters/cluster-registry.json',
  clustersRoot: 'clusters',
  publicDir: 'public',
  outputDir: 'requirements/universal-rules/seo_exports',
};

function parseArgs(argv) {
  const args = { ...DEFAULTS };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--base-url') args.baseUrl = argv[index + 1];
    if (token === '--ownership') args.ownershipPath = argv[index + 1];
    if (token === '--registry') args.registryPath = argv[index + 1];
    if (token === '--clusters-root') args.clustersRoot = argv[index + 1];
    if (token === '--public-dir') args.publicDir = argv[index + 1];
    if (token === '--output-dir') args.outputDir = argv[index + 1];
  }

  return args;
}

function collapseWhitespace(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function toTitleCase(value) {
  return String(value ?? '')
    .split(/[-_\s]+/g)
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ');
}

export function normalizePathnameToRoute(pathname) {
  if (typeof pathname !== 'string') {
    return null;
  }

  let normalized = pathname.trim();
  if (!normalized) {
    return null;
  }

  normalized = normalized.replace(/\/{2,}/g, '/');
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  if (normalized === '/') {
    return normalized;
  }

  if (normalized.endsWith('/index.html')) {
    normalized = normalized.slice(0, -'index.html'.length);
  } else if (/\.html$/i.test(normalized)) {
    normalized = `${normalized.slice(0, -'.html'.length)}/`;
  } else {
    const basename = path.posix.basename(normalized);
    if (/\.[a-z0-9]+$/i.test(basename)) {
      return null;
    }
  }

  if (!normalized.endsWith('/')) {
    normalized = `${normalized}/`;
  }

  return normalized;
}

export function normalizeInternalHref(href, baseUrl = DEFAULT_BASE_URL) {
  if (typeof href !== 'string') {
    return null;
  }

  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(trimmed)) {
    return null;
  }

  try {
    const targetUrl = new URL(trimmed, baseUrl);
    const originUrl = new URL(baseUrl);
    if (targetUrl.origin !== originUrl.origin) {
      return null;
    }
    return normalizePathnameToRoute(targetUrl.pathname);
  } catch {
    return null;
  }
}

export function getClusterFamilyLabel(clusterId, displayName = '') {
  if (clusterId === 'home-loan' || clusterId === 'auto-loans') {
    return 'Loans';
  }

  const normalizedDisplay = collapseWhitespace(displayName);
  if (!normalizedDisplay) {
    return toTitleCase(clusterId);
  }

  return normalizedDisplay
    .replace(/\bCalculators\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function shouldAuditRoute({ route, routeArchetype }) {
  const normalizedRoute = normalizePathnameToRoute(route);
  if (!normalizedRoute || normalizedRoute === '/' || GTEP_ROUTES.has(normalizedRoute)) {
    return false;
  }

  return collapseWhitespace(routeArchetype).toLowerCase() !== 'content_shell';
}

function routeToPublicFilePath(route, publicDir) {
  if (route === '/') {
    return path.join(publicDir, 'index.html');
  }

  return path.join(publicDir, route.replace(/^\/+/, ''), 'index.html');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readOptionalJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return readJson(filePath);
}

function getAnchorText(anchor) {
  const textContent = collapseWhitespace(anchor.textContent);
  if (textContent) {
    return textContent;
  }

  return collapseWhitespace(anchor.getAttribute('aria-label') || anchor.getAttribute('title'));
}

function extractPageData(html, baseUrl) {
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', () => {});

  const dom = new JSDOM(html, {
    url: baseUrl,
    virtualConsole,
  });
  const document = dom.window.document;
  const body = document.querySelector('body');
  const links = [...document.querySelectorAll('a[href]')].map((anchor) => ({
    href: anchor.getAttribute('href') || '',
    text: getAnchorText(anchor),
  }));

  return {
    routeArchetype: collapseWhitespace(body?.getAttribute('data-route-archetype')),
    dataPage: collapseWhitespace(body?.getAttribute('data-page')),
    h1: collapseWhitespace(document.querySelector('h1')?.textContent),
    title: collapseWhitespace(document.querySelector('title')?.textContent),
    links,
  };
}

function collectClusterNavigationNames(registry, clustersRoot) {
  const routeNames = new Map();

  for (const cluster of registry.clusters || []) {
    const navigationPath = path.join(clustersRoot, cluster.clusterId, 'config', 'navigation.json');
    const navigation = readOptionalJson(navigationPath);
    if (!navigation) {
      continue;
    }

    for (const section of navigation.sections || []) {
      for (const calculator of section.calculators || []) {
        const route = normalizePathnameToRoute(calculator.url);
        const name = collapseWhitespace(calculator.name);
        if (route && name) {
          routeNames.set(route, name);
        }
      }
    }
  }

  return routeNames;
}

function buildClusterLookup(registry) {
  return new Map((registry.clusters || []).map((cluster) => [cluster.clusterId, cluster]));
}

function buildEdgeAggregateRecord(sourceRoute, targetRoute, sourceNode, targetNode) {
  return {
    sourceRoute,
    targetRoute,
    sourceClusterId: sourceNode.clusterId,
    sourceClusterDisplayName: sourceNode.clusterDisplayName,
    targetClusterId: targetNode.clusterId,
    targetClusterDisplayName: targetNode.clusterDisplayName,
    count: 0,
    anchorTexts: new Set(),
  };
}

function addAnchorText(set, text) {
  const normalized = collapseWhitespace(text);
  if (!normalized) {
    return;
  }

  if (set.size < 5) {
    set.add(normalized);
  }
}

function sortRoutes(values) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function formatPercent(value) {
  if (value == null || Number.isNaN(value)) {
    return 'N/A';
  }

  return `${value.toFixed(2)}%`;
}

function roundPercent(value) {
  if (value == null || Number.isNaN(value)) {
    return null;
  }

  return Number(value.toFixed(2));
}

function escapeCsv(value) {
  const stringValue = String(value ?? '');
  if (!/[",\n]/.test(stringValue)) {
    return stringValue;
  }

  return `"${stringValue.replace(/"/g, '""')}"`;
}

export function buildInternalLinkAudit({ routeRows, pageCatalog, clusterLookup }) {
  const catalogMap =
    pageCatalog instanceof Map ? pageCatalog : new Map(Object.entries(pageCatalog || {}));
  const clusterMap =
    clusterLookup instanceof Map ? clusterLookup : new Map(Object.entries(clusterLookup || {}));

  const nodesByRoute = new Map();
  const excludedRoutes = [];

  for (const row of routeRows || []) {
    const route = normalizePathnameToRoute(row.route);
    const page = route ? catalogMap.get(route) : null;

    if (route && !page) {
      excludedRoutes.push({
        route,
        reason: 'missing_html',
      });
      continue;
    }

    if (!shouldAuditRoute({ route, routeArchetype: page?.routeArchetype })) {
      if (route) {
        excludedRoutes.push({
          route,
          reason: page?.routeArchetype === 'content_shell' ? 'content_shell' : 'non-calculator-route',
        });
      }
      continue;
    }

    const cluster = clusterMap.get(row.activeOwnerClusterId) || {};
    const clusterDisplayName = collapseWhitespace(cluster.displayName) || toTitleCase(row.activeOwnerClusterId);
    const pageName = collapseWhitespace(page?.name) || collapseWhitespace(page?.h1) || collapseWhitespace(page?.title) || row.calculatorId || route;

    nodesByRoute.set(route, {
      route,
      calculatorId: row.calculatorId || '',
      clusterId: row.activeOwnerClusterId || '',
      clusterDisplayName,
      clusterFamily: getClusterFamilyLabel(row.activeOwnerClusterId || '', clusterDisplayName),
      pageName,
      routeArchetype: page?.routeArchetype || '',
      sourceFile: page?.sourceFile || '',
    });
  }

  const edgeAggregate = new Map();
  const shadowAggregate = new Map();

  for (const [sourceRoute, sourceNode] of nodesByRoute.entries()) {
    const page = catalogMap.get(sourceRoute);
    for (const link of page?.links || []) {
      const targetRoute = normalizeInternalHref(link.href);
      if (!targetRoute || targetRoute === sourceRoute) {
        continue;
      }

      if (targetRoute.startsWith('/calculators/')) {
        const shadowKey = `${sourceRoute}::${targetRoute}`;
        const record =
          shadowAggregate.get(shadowKey) || {
            sourceRoute,
            targetRoute,
            count: 0,
            anchorTexts: new Set(),
          };
        record.count += 1;
        addAnchorText(record.anchorTexts, link.text);
        shadowAggregate.set(shadowKey, record);
        continue;
      }

      const targetNode = nodesByRoute.get(targetRoute);
      if (!targetNode) {
        continue;
      }

      const edgeKey = `${sourceRoute}::${targetRoute}`;
      const edgeRecord =
        edgeAggregate.get(edgeKey) || buildEdgeAggregateRecord(sourceRoute, targetRoute, sourceNode, targetNode);
      edgeRecord.count += 1;
      addAnchorText(edgeRecord.anchorTexts, link.text);
      edgeAggregate.set(edgeKey, edgeRecord);
    }
  }

  const edges = [...edgeAggregate.values()]
    .map((edge) => ({
      ...edge,
      anchorTexts: [...edge.anchorTexts],
    }))
    .sort((left, right) =>
      left.sourceRoute === right.sourceRoute
        ? left.targetRoute.localeCompare(right.targetRoute)
        : left.sourceRoute.localeCompare(right.sourceRoute)
    );

  const shadowRouteTargets = [...shadowAggregate.values()]
    .map((record) => ({
      ...record,
      anchorTexts: [...record.anchorTexts],
    }))
    .sort((left, right) =>
      left.sourceRoute === right.sourceRoute
        ? left.targetRoute.localeCompare(right.targetRoute)
        : left.sourceRoute.localeCompare(right.sourceRoute)
    );

  const inboundByRoute = new Map();
  const outboundByRoute = new Map();
  const shadowBySource = new Map();

  for (const edge of edges) {
    const outboundTargets = outboundByRoute.get(edge.sourceRoute) || new Set();
    outboundTargets.add(edge.targetRoute);
    outboundByRoute.set(edge.sourceRoute, outboundTargets);

    const inboundSources = inboundByRoute.get(edge.targetRoute) || new Set();
    inboundSources.add(edge.sourceRoute);
    inboundByRoute.set(edge.targetRoute, inboundSources);
  }

  for (const shadow of shadowRouteTargets) {
    const targets = shadowBySource.get(shadow.sourceRoute) || new Set();
    targets.add(shadow.targetRoute);
    shadowBySource.set(shadow.sourceRoute, targets);
  }

  const sameClusterRoutes = new Map();
  for (const node of nodesByRoute.values()) {
    const routes = sameClusterRoutes.get(node.clusterId) || [];
    routes.push(node.route);
    sameClusterRoutes.set(node.clusterId, routes);
  }

  const nodes = [...nodesByRoute.values()]
    .map((node) => {
      const clusterRoutes = sameClusterRoutes.get(node.clusterId) || [];
      const expectedSameClusterRoutes = sortRoutes(clusterRoutes.filter((route) => route !== node.route));
      const linkedSameClusterRoutes = sortRoutes(
        [...(outboundByRoute.get(node.route) || new Set())].filter((route) => {
          const target = nodesByRoute.get(route);
          return target?.clusterId === node.clusterId;
        })
      );
      const missingSameClusterRoutes = expectedSameClusterRoutes.filter(
        (route) => !linkedSameClusterRoutes.includes(route)
      );
      const sameClusterCoveragePct = expectedSameClusterRoutes.length
        ? roundPercent((linkedSameClusterRoutes.length / expectedSameClusterRoutes.length) * 100)
        : null;

      return {
        ...node,
        inboundCanonicalLinks: (inboundByRoute.get(node.route) || new Set()).size,
        outboundCanonicalLinks: (outboundByRoute.get(node.route) || new Set()).size,
        shadowRouteLinks: (shadowBySource.get(node.route) || new Set()).size,
        orphan: ((inboundByRoute.get(node.route) || new Set()).size || 0) === 0,
        expectedSameClusterRoutes,
        linkedSameClusterRoutes,
        missingSameClusterRoutes,
        sameClusterExpectedCount: expectedSameClusterRoutes.length,
        sameClusterLinkedCount: linkedSameClusterRoutes.length,
        sameClusterCoveragePct,
      };
    })
    .sort((left, right) => left.route.localeCompare(right.route));

  const clusterSummaries = [...sameClusterRoutes.entries()]
    .map(([clusterId, routes]) => {
      const clusterNodes = nodes.filter((node) => node.clusterId === clusterId);
      const coverageValues = clusterNodes
        .map((node) => node.sameClusterCoveragePct)
        .filter((value) => value != null);
      const averageSameClusterCoveragePct = coverageValues.length
        ? roundPercent(coverageValues.reduce((sum, value) => sum + value, 0) / coverageValues.length)
        : null;
      const clusterDisplayName = clusterNodes[0]?.clusterDisplayName || toTitleCase(clusterId);
      const clusterFamily = clusterNodes[0]?.clusterFamily || getClusterFamilyLabel(clusterId, clusterDisplayName);

      return {
        clusterId,
        clusterDisplayName,
        clusterFamily,
        pageCount: clusterNodes.length,
        orphanCount: clusterNodes.filter((node) => node.orphan).length,
        averageSameClusterCoveragePct,
        routes: sortRoutes(routes),
      };
    })
    .sort((left, right) => left.clusterId.localeCompare(right.clusterId));

  const familyGroups = new Map();
  for (const node of nodes) {
    const group = familyGroups.get(node.clusterFamily) || {
      family: node.clusterFamily,
      pageCount: 0,
      orphanCount: 0,
      coverageTotal: 0,
      coverageCount: 0,
      clusterIds: new Set(),
    };

    group.pageCount += 1;
    group.orphanCount += node.orphan ? 1 : 0;
    group.clusterIds.add(node.clusterId);
    if (node.sameClusterCoveragePct != null) {
      group.coverageTotal += node.sameClusterCoveragePct;
      group.coverageCount += 1;
    }
    familyGroups.set(node.clusterFamily, group);
  }

  const familySummaries = [...familyGroups.values()]
    .map((group) => ({
      family: group.family,
      pageCount: group.pageCount,
      orphanCount: group.orphanCount,
      averageSameClusterCoveragePct: group.coverageCount
        ? roundPercent(group.coverageTotal / group.coverageCount)
        : null,
      clusterIds: sortRoutes(group.clusterIds),
    }))
    .sort((left, right) => left.family.localeCompare(right.family));

  const orphanRoutes = nodes.filter((node) => node.orphan);
  const summary = {
    canonicalPageCount: nodes.length,
    canonicalEdgeCount: edges.length,
    orphanCount: orphanRoutes.length,
    shadowLinkingPageCount: shadowBySource.size,
    shadowUniqueTargetCount: new Set(shadowRouteTargets.map((record) => record.targetRoute)).size,
  };

  return {
    summary,
    excludedRoutes: excludedRoutes.sort((left, right) => left.route.localeCompare(right.route)),
    nodes,
    edges,
    clusterSummaries,
    familySummaries,
    orphanRoutes,
    shadowRouteTargets,
  };
}

function renderMarkdownTable(headers, rows) {
  const escapeCell = (value) =>
    String(value ?? '')
      .replace(/\|/g, '\\|')
      .replace(/\n/g, ' ');
  const headerLine = `| ${headers.map(escapeCell).join(' | ')} |`;
  const separatorLine = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${row.map(escapeCell).join(' | ')} |`);
  return [headerLine, separatorLine, ...body];
}

function renderMarkdownReport(audit) {
  const coverageClusters = [...audit.clusterSummaries]
    .filter((summary) => summary.averageSameClusterCoveragePct != null)
    .sort((left, right) => left.clusterId.localeCompare(right.clusterId));
  const strongestClusters = [...coverageClusters]
    .sort((left, right) => right.averageSameClusterCoveragePct - left.averageSameClusterCoveragePct)
    .slice(0, 5);
  const weakestClusterCandidates = coverageClusters.filter(
    (summary) => summary.averageSameClusterCoveragePct < 100
  );
  const weakestClusters = (weakestClusterCandidates.length ? weakestClusterCandidates : coverageClusters)
    .sort((left, right) => left.averageSameClusterCoveragePct - right.averageSameClusterCoveragePct)
    .slice(0, 5);
  const weakestPages = [...audit.nodes]
    .filter((node) => node.sameClusterExpectedCount > 0 && node.missingSameClusterRoutes.length > 0)
    .sort((left, right) => {
      if (left.sameClusterCoveragePct === right.sameClusterCoveragePct) {
        return left.route.localeCompare(right.route);
      }
      return left.sameClusterCoveragePct - right.sameClusterCoveragePct;
    })
    .slice(0, 15);
  const topShadowTargets = [...audit.shadowRouteTargets]
    .sort((left, right) => right.count - left.count || left.targetRoute.localeCompare(right.targetRoute))
    .slice(0, 10);

  const lines = [
    '# Internal Link Audit',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Snapshot',
    `- Canonical calculator pages audited: ${audit.summary.canonicalPageCount}`,
    `- Canonical calculator-to-calculator edges: ${audit.summary.canonicalEdgeCount}`,
    `- Orphan pages: ${audit.summary.orphanCount}`,
    `- Pages linking to legacy \`/calculators/*\` routes: ${audit.summary.shadowLinkingPageCount}`,
    `- Unique legacy \`/calculators/*\` targets referenced: ${audit.summary.shadowUniqueTargetCount}`,
    '',
    '## Top Findings',
  ];

  if (audit.summary.orphanCount === 0) {
    lines.push('- No canonical calculator pages are orphaned within the calculator-to-calculator graph.');
  } else {
    lines.push(
      `- ${audit.summary.orphanCount} canonical calculator pages have zero inbound links from other canonical calculator pages.`
    );
  }

  if (weakestClusterCandidates.length > 0) {
    const weakestClusterSummary = weakestClusters
      .map((cluster) => `${cluster.clusterDisplayName} (${formatPercent(cluster.averageSameClusterCoveragePct)})`)
      .join(', ');
    lines.push(`- Weakest same-cluster coverage by cluster: ${weakestClusterSummary}.`);
  }

  if (audit.summary.shadowUniqueTargetCount > 0) {
    lines.push(
      `- Legacy shadow routes under \`/calculators/*\` are still referenced across ${audit.summary.shadowLinkingPageCount} audited pages.`
    );
  }

  lines.push('', '## Family Rollup', '');
  lines.push(
    ...renderMarkdownTable(
      ['Family', 'Pages', 'Avg Same-Cluster Coverage', 'Orphans', 'Clusters'],
      audit.familySummaries.map((summary) => [
        summary.family,
        String(summary.pageCount),
        formatPercent(summary.averageSameClusterCoveragePct),
        String(summary.orphanCount),
        summary.clusterIds.join(', '),
      ])
    )
  );

  lines.push('', '## Strongest Clusters', '');
  lines.push(
    ...renderMarkdownTable(
      ['Cluster', 'Pages', 'Avg Same-Cluster Coverage', 'Orphans'],
      strongestClusters.map((summary) => [
        summary.clusterDisplayName,
        String(summary.pageCount),
        formatPercent(summary.averageSameClusterCoveragePct),
        String(summary.orphanCount),
      ])
    )
  );

  lines.push('', '## Weakest Clusters', '');
  lines.push(
    ...renderMarkdownTable(
      ['Cluster', 'Pages', 'Avg Same-Cluster Coverage', 'Orphans'],
      weakestClusters.map((summary) => [
        summary.clusterDisplayName,
        String(summary.pageCount),
        formatPercent(summary.averageSameClusterCoveragePct),
        String(summary.orphanCount),
      ])
    )
  );

  lines.push('', '## Orphan Pages', '');
  if (audit.orphanRoutes.length === 0) {
    lines.push('- None');
  } else {
    for (const node of audit.orphanRoutes) {
      lines.push(`- \`${node.route}\` (${node.clusterDisplayName})`);
    }
  }

  lines.push('', '## Cross-Link Gaps', '');
  if (weakestPages.length === 0) {
    lines.push('- No same-cluster cross-link gaps detected.');
  } else {
    lines.push(
      ...renderMarkdownTable(
        ['Route', 'Cluster', 'Coverage', 'Missing Same-Cluster Routes'],
        weakestPages.map((node) => [
          `\`${node.route}\``,
          node.clusterDisplayName,
          formatPercent(node.sameClusterCoveragePct),
          node.missingSameClusterRoutes.map((route) => `\`${route}\``).join(', '),
        ])
      )
    );
  }

  if (topShadowTargets.length > 0) {
    lines.push('', '## Legacy Shadow Route References', '');
    lines.push(
      ...renderMarkdownTable(
        ['Source Route', 'Legacy Target', 'Link Count', 'Anchor Text Samples'],
        topShadowTargets.map((record) => [
          `\`${record.sourceRoute}\``,
          `\`${record.targetRoute}\``,
          String(record.count),
          record.anchorTexts.join(' | '),
        ])
      )
    );
  }

  return `${lines.join('\n')}\n`;
}

function renderCsvSummary(audit) {
  const headers = [
    'route',
    'calculator_id',
    'page_name',
    'cluster_id',
    'cluster_display_name',
    'cluster_family',
    'route_archetype',
    'inbound_canonical_links',
    'outbound_canonical_links',
    'shadow_route_links',
    'same_cluster_expected',
    'same_cluster_linked',
    'same_cluster_coverage_pct',
    'missing_same_cluster_count',
    'missing_same_cluster_routes',
    'orphan',
    'source_file',
  ];

  const rows = audit.nodes.map((node) =>
    [
      node.route,
      node.calculatorId,
      node.pageName,
      node.clusterId,
      node.clusterDisplayName,
      node.clusterFamily,
      node.routeArchetype,
      node.inboundCanonicalLinks,
      node.outboundCanonicalLinks,
      node.shadowRouteLinks,
      node.sameClusterExpectedCount,
      node.sameClusterLinkedCount,
      node.sameClusterCoveragePct == null ? '' : node.sameClusterCoveragePct,
      node.missingSameClusterRoutes.length,
      node.missingSameClusterRoutes.join(' | '),
      node.orphan ? 'true' : 'false',
      node.sourceFile,
    ].map(escapeCsv).join(',')
  );

  return `${headers.join(',')}\n${rows.join('\n')}\n`;
}

function writeOutputFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

function runAudit(options) {
  const registry = readJson(options.registryPath);
  const ownership = readJson(options.ownershipPath);
  const clusterLookup = buildClusterLookup(registry);
  const navigationNames = collectClusterNavigationNames(registry, options.clustersRoot);
  const pageCatalog = new Map();
  const missingHtmlRoutes = [];

  for (const row of ownership.routes || []) {
    const route = normalizePathnameToRoute(row.route);
    if (!route) {
      continue;
    }

    const filePath = routeToPublicFilePath(route, options.publicDir);
    if (!fs.existsSync(filePath)) {
      missingHtmlRoutes.push(route);
      continue;
    }

    const html = fs.readFileSync(filePath, 'utf8');
    const pageData = extractPageData(html, options.baseUrl);
    pageCatalog.set(route, {
      ...pageData,
      name: navigationNames.get(route) || pageData.h1 || pageData.title || row.calculatorId || route,
      sourceFile: path.relative(process.cwd(), filePath),
    });
  }

  const audit = buildInternalLinkAudit({
    routeRows: ownership.routes || [],
    pageCatalog,
    clusterLookup,
  });

  const jsonArtifact = {
    generatedAt: new Date().toISOString(),
    baseUrl: options.baseUrl,
    paths: {
      ownershipPath: options.ownershipPath,
      registryPath: options.registryPath,
      clustersRoot: options.clustersRoot,
      publicDir: options.publicDir,
      outputDir: options.outputDir,
    },
    missingHtmlRoutes: sortRoutes(missingHtmlRoutes),
    ...audit,
  };

  const markdownPath = path.join(options.outputDir, 'internal-link-audit.md');
  const csvPath = path.join(options.outputDir, 'internal-link-summary.csv');
  const jsonPath = path.join(options.outputDir, 'internal-link-graph.json');

  writeOutputFile(markdownPath, renderMarkdownReport(audit));
  writeOutputFile(csvPath, renderCsvSummary(audit));
  writeOutputFile(jsonPath, `${JSON.stringify(jsonArtifact, null, 2)}\n`);

  return {
    markdownPath,
    csvPath,
    jsonPath,
    summary: audit.summary,
    missingHtmlRoutes: jsonArtifact.missingHtmlRoutes,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = runAudit(args);

  console.log(
    [
      `Internal link audit completed.`,
      `Canonical pages: ${result.summary.canonicalPageCount}`,
      `Edges: ${result.summary.canonicalEdgeCount}`,
      `Orphans: ${result.summary.orphanCount}`,
      `Shadow targets: ${result.summary.shadowUniqueTargetCount}`,
      `Markdown: ${result.markdownPath}`,
      `CSV: ${result.csvPath}`,
      `JSON: ${result.jsonPath}`,
      result.missingHtmlRoutes.length
        ? `Missing HTML routes: ${result.missingHtmlRoutes.join(', ')}`
        : `Missing HTML routes: none`,
    ].join('\n')
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { DEFAULT_BASE_URL, GTEP_ROUTES, runAudit };
