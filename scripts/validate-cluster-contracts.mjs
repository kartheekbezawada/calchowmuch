#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const HOMEPAGE_CLUSTER_ID = 'homepage';
const HOMEPAGE_ROUTES = ['/'];
const ROUTE_PREFIX_ALIASES = {
  '/finance/': ['/finance-calculators/'],
};

const paths = {
  registry: path.join(ROOT, 'config', 'clusters', 'cluster-registry.json'),
  ownership: path.join(ROOT, 'config', 'clusters', 'route-ownership.json'),
  policy: path.join(ROOT, 'config', 'policy', 'global-navigation-spec.json'),
  publicNavigation: path.join(ROOT, 'public', 'config', 'navigation.json'),
  clustersRoot: path.join(ROOT, 'clusters'),
};

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required contract file: ${path.relative(ROOT, filePath)}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
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

function validateRegistry(registry) {
  assert(Array.isArray(registry.clusters), 'cluster-registry.json must include clusters[]');
  assert(registry.clusters.length > 0, 'cluster-registry.json clusters[] must not be empty');

  const clusterMap = new Map();
  registry.clusters.forEach((entry, index) => {
    assert(
      typeof entry.clusterId === 'string' && entry.clusterId.trim(),
      `cluster-registry.json clusters[${index}] missing clusterId`
    );
    assert(
      typeof entry.displayName === 'string' && entry.displayName.trim(),
      `cluster-registry.json clusters[${index}] missing displayName`
    );
    assert(
      typeof entry.status === 'string' && entry.status.trim(),
      `cluster-registry.json clusters[${index}] missing status`
    );
    assert(
      Array.isArray(entry.routePrefixes) && entry.routePrefixes.length > 0,
      `cluster-registry.json ${entry.clusterId} must define routePrefixes[]`
    );
    assert(
      Array.isArray(entry.owners) && entry.owners.length > 0,
      `cluster-registry.json ${entry.clusterId} must define owners[]`
    );

    if (Object.prototype.hasOwnProperty.call(entry, 'showOnHomepage')) {
      assert(
        typeof entry.showOnHomepage === 'boolean',
        `cluster-registry.json ${entry.clusterId} showOnHomepage must be boolean`
      );
    }
    if (Object.prototype.hasOwnProperty.call(entry, 'contractsEnabled')) {
      assert(
        typeof entry.contractsEnabled === 'boolean',
        `cluster-registry.json ${entry.clusterId} contractsEnabled must be boolean`
      );
    }

    const clusterId = entry.clusterId.trim();
    assert(!clusterMap.has(clusterId), `cluster-registry.json duplicate clusterId: ${clusterId}`);
    clusterMap.set(clusterId, entry);
  });

  const homepage = clusterMap.get(HOMEPAGE_CLUSTER_ID);
  assert(homepage, 'cluster-registry.json missing homepage cluster');
  assert(
    homepage.showOnHomepage === false,
    'homepage cluster must set showOnHomepage=false to avoid self-card rendering'
  );

  return clusterMap;
}

function validateOwnership(ownership, clusterIds) {
  assert(Array.isArray(ownership.routes), 'route-ownership.json must include routes[]');

  const seenRoutes = new Set();
  ownership.routes.forEach((row, index) => {
    const requiredFields = [
      'route',
      'calculatorId',
      'activeOwnerClusterId',
      'previousOwnerClusterId',
      'rollbackTag',
    ];

    requiredFields.forEach((field) => {
      assert(
        typeof row[field] === 'string' && row[field].trim(),
        `route-ownership.json routes[${index}] missing ${field}`
      );
    });

    const normalizedRoute = normalizeRoute(row.route);
    assert(normalizedRoute, `route-ownership.json routes[${index}] has invalid route`);
    assert(
      !seenRoutes.has(normalizedRoute),
      `route-ownership.json duplicate route entry detected: ${normalizedRoute}`
    );
    seenRoutes.add(normalizedRoute);

    assert(
      clusterIds.has(row.activeOwnerClusterId),
      `route-ownership.json route ${normalizedRoute} has unknown activeOwnerClusterId=${row.activeOwnerClusterId}`
    );

    if (Object.prototype.hasOwnProperty.call(row, 'generationMode')) {
      assert(
        typeof row.generationMode === 'string' && row.generationMode.trim(),
        `route-ownership.json route ${normalizedRoute} generationMode must be non-empty string`
      );
    }
  });

  HOMEPAGE_ROUTES.forEach((requiredRoute) => {
    const normalizedRequired = normalizeRoute(requiredRoute);
    const row = ownership.routes.find((entry) => normalizeRoute(entry.route) === normalizedRequired);
    assert(row, `route-ownership.json missing ${normalizedRequired}`);
    assert(
      row.activeOwnerClusterId === HOMEPAGE_CLUSTER_ID,
      `${normalizedRequired} must be owned by ${HOMEPAGE_CLUSTER_ID}`
    );
  });
}

function validateNavParity(policy, clusterNav, clusterId) {
  assert(Array.isArray(policy.globalDestinations), 'policy globalDestinations[] is required');
  assert(Array.isArray(clusterNav.globalDestinations), `${clusterId} nav globalDestinations[] is required`);

  const toKey = (row) => `${row.clusterId}|${row.label}|${normalizeRoute(row.href)}`;
  const policySet = new Set(policy.globalDestinations.map(toKey));
  const clusterSet = new Set(clusterNav.globalDestinations.map(toKey));

  assert(
    policySet.size === clusterSet.size,
    `${clusterId} nav globalDestinations size mismatch (policy=${policySet.size}, cluster=${clusterSet.size})`
  );

  policySet.forEach((key) => {
    assert(clusterSet.has(key), `${clusterId} nav parity missing destination: ${key}`);
  });
}

function validateClusterContractFiles(cluster, policy) {
  if (!cluster.contractsEnabled) {
    return;
  }

  const clusterId = cluster.clusterId;
  const navigationPath = path.join(paths.clustersRoot, clusterId, 'config', 'navigation.json');
  const manifestPath = path.join(paths.clustersRoot, clusterId, 'config', 'asset-manifest.json');

  const clusterNavigation = readJson(navigationPath);
  const clusterManifest = readJson(manifestPath);

  assert(
    clusterNavigation.clusterId === clusterId,
    `clusters/${clusterId}/config/navigation.json clusterId mismatch`
  );
  validateNavParity(policy, clusterNavigation, clusterId);

  assert(
    clusterManifest.clusterId === clusterId,
    `clusters/${clusterId}/config/asset-manifest.json clusterId mismatch`
  );
  assert(
    clusterManifest.routes && typeof clusterManifest.routes === 'object',
    `clusters/${clusterId}/config/asset-manifest.json must include routes object`
  );

  Object.entries(clusterManifest.routes).forEach(([routeKey, routeEntry]) => {
    const normalizedKey = normalizeRoute(routeKey);
    const normalizedRoute = normalizeRoute(routeEntry?.route);
    assert(normalizedKey, `clusters/${clusterId}/config/asset-manifest.json invalid route key: ${routeKey}`);
    assert(normalizedRoute, `clusters/${clusterId}/config/asset-manifest.json route entry missing route`);
    assert(
      normalizedKey === normalizedRoute,
      `clusters/${clusterId}/config/asset-manifest.json route mismatch for ${routeKey}`
    );
    assert(
      routeEntry.clusterId === clusterId,
      `clusters/${clusterId}/config/asset-manifest.json route ${routeKey} clusterId mismatch`
    );
    assert(
      typeof routeEntry.calculatorId === 'string' && routeEntry.calculatorId.trim(),
      `clusters/${clusterId}/config/asset-manifest.json route ${routeKey} missing calculatorId`
    );
  });
}

function buildPrefixVariants(prefix) {
  const normalizedPrefix = normalizeRoute(prefix);
  if (!normalizedPrefix) {
    return [];
  }

  const variants = new Set([normalizedPrefix]);
  const aliases = ROUTE_PREFIX_ALIASES[normalizedPrefix] || [];
  aliases.forEach((alias) => {
    const normalizedAlias = normalizeRoute(alias);
    if (normalizedAlias) {
      variants.add(normalizedAlias);
    }
  });

  return Array.from(variants);
}

function flattenNavigationRoutes(navigation) {
  return (navigation.categories || []).flatMap((category) =>
    (category.subcategories || []).flatMap((subcategory) =>
      (subcategory.calculators || [])
        .map((calculator) => normalizeRoute(calculator.url))
        .filter(Boolean)
    )
  );
}

function validateHomepageVisibilityContract(registry, navigationRoutes) {
  const visibleClusters = registry.clusters.filter(
    (cluster) => cluster.clusterId !== HOMEPAGE_CLUSTER_ID && cluster.showOnHomepage !== false
  );

  visibleClusters.forEach((cluster) => {
    const prefixes = (cluster.routePrefixes || [])
      .flatMap((prefix) => buildPrefixVariants(prefix))
      .filter(Boolean);

    assert(prefixes.length > 0, `${cluster.clusterId} is homepage-visible but has no valid routePrefixes`);

    const hasNavigationMatch = navigationRoutes.some((route) =>
      prefixes.some((prefix) => route.startsWith(prefix))
    );
    const hasFallbackPrefixes = prefixes.some((prefix) => prefix !== '/');

    assert(
      hasNavigationMatch || hasFallbackPrefixes,
      `${cluster.clusterId} is homepage-visible but cannot be resolved from navigation or routePrefixes`
    );
  });
}

function main() {
  const registry = readJson(paths.registry);
  const ownership = readJson(paths.ownership);
  const policy = readJson(paths.policy);
  const publicNavigation = readJson(paths.publicNavigation);

  const clusterMap = validateRegistry(registry);
  validateOwnership(ownership, new Set(clusterMap.keys()));
  validateHomepageVisibilityContract(registry, flattenNavigationRoutes(publicNavigation));

  registry.clusters.forEach((cluster) => {
    validateClusterContractFiles(cluster, policy);
  });

  console.log('Cluster contract validation passed.');
}

try {
  main();
} catch (error) {
  console.error(`Cluster contract validation failed: ${error.message}`);
  process.exit(1);
}
