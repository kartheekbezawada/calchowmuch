#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const HOMEPAGE_CLUSTER_ID = 'homepage';

const paths = {
  registry: path.join(ROOT, 'config', 'clusters', 'cluster-registry.json'),
  ownership: path.join(ROOT, 'config', 'clusters', 'route-ownership.json'),
  publicNavigation: path.join(ROOT, 'public', 'config', 'navigation.json'),
  clustersRoot: path.join(ROOT, 'clusters'),
};

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required file: ${path.relative(ROOT, filePath)}`);
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readOptionalJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function getHomepageSearchExclusion(row, normalizedRoute) {
  if (Object.prototype.hasOwnProperty.call(row, 'homepageSearchExcluded')) {
    assert(
      typeof row.homepageSearchExcluded === 'boolean',
      `${normalizedRoute} homepageSearchExcluded must be boolean`
    );
  }

  const hasReason = Object.prototype.hasOwnProperty.call(row, 'homepageSearchExclusionReason');
  const hasEvidence = Object.prototype.hasOwnProperty.call(row, 'homepageSearchExclusionEvidence');

  if (!row.homepageSearchExcluded) {
    assert(!hasReason, `${normalizedRoute} homepageSearchExclusionReason requires homepageSearchExcluded=true`);
    assert(
      !hasEvidence,
      `${normalizedRoute} homepageSearchExclusionEvidence requires homepageSearchExcluded=true`
    );
    return null;
  }

  assert(
    hasReason && typeof row.homepageSearchExclusionReason === 'string' && row.homepageSearchExclusionReason.trim(),
    `${normalizedRoute} homepageSearchExcluded=true requires homepageSearchExclusionReason`
  );
  assert(
    hasEvidence &&
      typeof row.homepageSearchExclusionEvidence === 'string' &&
      row.homepageSearchExclusionEvidence.trim(),
    `${normalizedRoute} homepageSearchExcluded=true requires homepageSearchExclusionEvidence`
  );

  return {
    reason: row.homepageSearchExclusionReason.trim(),
    evidence: row.homepageSearchExclusionEvidence.trim(),
  };
}

function normalizeRoute(route) {
  if (typeof route !== 'string' || !route.trim()) {
    return null;
  }

  let normalized = route.trim();
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  normalized = normalized.replace(/\/+/g, '/');
  if (normalized !== '/' && !normalized.endsWith('/')) {
    normalized = `${normalized}/`;
  }
  return normalized;
}

function collectPublicNavigationEntries(navigation) {
  return (navigation.categories || []).flatMap((category) =>
    (category.subcategories || []).flatMap((subcategory) =>
      (subcategory.calculators || []).map((calculator) => ({
        route: normalizeRoute(calculator.url),
        name: calculator.name,
        keywords: Array.isArray(calculator.keywords) ? calculator.keywords : [],
        source: 'public/config/navigation.json',
      }))
    )
  );
}

function collectClusterNavigationEntries(clusterId, navigation) {
  return (navigation.sections || []).flatMap((section) =>
    (section.calculators || []).map((calculator) => ({
      route: normalizeRoute(calculator.url),
      name: calculator.name,
      keywords: Array.isArray(calculator.keywords) ? calculator.keywords : [],
      source: `clusters/${clusterId}/config/navigation.json`,
    }))
  );
}

function addRouteEntry(index, entry) {
  if (!entry.route) {
    return;
  }

  const current = index.get(entry.route) || {
    names: new Set(),
    keywords: new Set(),
    sources: new Set(),
  };

  if (typeof entry.name === 'string' && entry.name.trim()) {
    current.names.add(entry.name.trim());
  }

  for (const keyword of entry.keywords || []) {
    if (typeof keyword === 'string' && keyword.trim()) {
      current.keywords.add(keyword.trim());
    }
  }

  current.sources.add(entry.source);
  index.set(entry.route, current);
}

function buildNavigationIndex(registry, publicNavigation) {
  const index = new Map();

  for (const entry of collectPublicNavigationEntries(publicNavigation)) {
    addRouteEntry(index, entry);
  }

  for (const cluster of registry.clusters || []) {
    const navigationPath = path.join(paths.clustersRoot, cluster.clusterId, 'config', 'navigation.json');
    const clusterNavigation = readOptionalJson(navigationPath);
    if (!clusterNavigation) {
      continue;
    }

    for (const entry of collectClusterNavigationEntries(cluster.clusterId, clusterNavigation)) {
      addRouteEntry(index, entry);
    }
  }

  return index;
}

function validateHomepageSearchCoverage(registry, ownership, routeIndex) {
  const clusterMap = new Map((registry.clusters || []).map((cluster) => [cluster.clusterId, cluster]));

  for (const row of ownership.routes || []) {
    const normalizedRoute = normalizeRoute(row.route);
    if (!normalizedRoute || normalizedRoute === '/') {
      continue;
    }

    const cluster = clusterMap.get(row.activeOwnerClusterId);
    assert(cluster, `Unknown activeOwnerClusterId for ${normalizedRoute}: ${row.activeOwnerClusterId}`);
    const exclusion = getHomepageSearchExclusion(row, normalizedRoute);

    if (cluster.clusterId === HOMEPAGE_CLUSTER_ID) {
      continue;
    }

    if (cluster.showOnHomepage === false) {
      assert(
        exclusion,
        `${normalizedRoute} is owned by hidden cluster ${cluster.clusterId}; add homepageSearchExcluded metadata with approved reason and evidence`
      );
      continue;
    }

    if (exclusion) {
      continue;
    }

    const indexedRoute = routeIndex.get(normalizedRoute);
    assert(
      indexedRoute,
      `${normalizedRoute} is missing homepage-search coverage; add it to governed navigation sources for cluster ${cluster.clusterId}`
    );
    assert(
      indexedRoute.names.size > 0,
      `${normalizedRoute} is missing a navigation label in homepage-search sources (${Array.from(indexedRoute.sources).join(', ')})`
    );
  }
}

function main() {
  const registry = readJson(paths.registry);
  const ownership = readJson(paths.ownership);
  const publicNavigation = readJson(paths.publicNavigation);
  const routeIndex = buildNavigationIndex(registry, publicNavigation);

  validateHomepageSearchCoverage(registry, ownership, routeIndex);
  console.log('Homepage search discoverability validation passed.');
}

try {
  main();
} catch (error) {
  console.error(`Homepage search discoverability validation failed: ${error.message}`);
  process.exit(1);
}