#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const paths = {
  registry: path.join(ROOT, 'config', 'clusters', 'cluster-registry.json'),
  ownership: path.join(ROOT, 'config', 'clusters', 'route-ownership.json'),
  policy: path.join(ROOT, 'config', 'policy', 'global-navigation-spec.json'),
  clusterNav: path.join(ROOT, 'clusters', 'percentage', 'config', 'navigation.json'),
  clusterAssets: path.join(ROOT, 'clusters', 'percentage', 'config', 'asset-manifest.json'),
};

const REQUIRED_ROUTE = '/percentage-calculators/percent-change/';
const REQUIRED_CALCULATOR_ID = 'percent-change';
const REQUIRED_CLUSTER = 'percentage';

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

function validateRegistry(registry) {
  assert(Array.isArray(registry.clusters), 'cluster-registry.json must include clusters[]');
  const percentage = registry.clusters.find((entry) => entry.clusterId === REQUIRED_CLUSTER);
  assert(percentage, 'cluster-registry.json missing percentage cluster');
  assert(Array.isArray(percentage.routePrefixes), 'percentage cluster must define routePrefixes[]');
  assert(
    percentage.routePrefixes.includes('/percentage-calculators/'),
    'percentage cluster must own /percentage-calculators/ prefix'
  );
}

function validateOwnership(ownership) {
  assert(Array.isArray(ownership.routes), 'route-ownership.json must include routes[]');
  const row = ownership.routes.find((entry) => entry.route === REQUIRED_ROUTE);
  assert(row, `route-ownership.json missing ${REQUIRED_ROUTE}`);

  const requiredFields = [
    'route',
    'calculatorId',
    'activeOwnerClusterId',
    'previousOwnerClusterId',
    'rollbackTag',
  ];

  requiredFields.forEach((field) => {
    assert(typeof row[field] === 'string' && row[field].trim(), `route ownership missing ${field}`);
  });

  assert(row.calculatorId === REQUIRED_CALCULATOR_ID, 'route ownership calculatorId mismatch');
  assert(row.activeOwnerClusterId === REQUIRED_CLUSTER, 'route ownership activeOwnerClusterId mismatch');
}

function validateNavParity(policy, clusterNav) {
  assert(Array.isArray(policy.globalDestinations), 'policy globalDestinations[] is required');
  assert(Array.isArray(clusterNav.globalDestinations), 'cluster nav globalDestinations[] is required');

  const toKey = (row) => `${row.clusterId}|${row.label}|${row.href}`;
  const policySet = new Set(policy.globalDestinations.map(toKey));
  const clusterSet = new Set(clusterNav.globalDestinations.map(toKey));

  policySet.forEach((key) => {
    assert(clusterSet.has(key), `cluster nav parity missing destination: ${key}`);
  });
}

function validateClusterManifest(manifest) {
  assert(manifest.clusterId === REQUIRED_CLUSTER, 'percentage cluster asset manifest clusterId mismatch');
  assert(manifest.routes && typeof manifest.routes === 'object', 'cluster asset manifest routes object is required');
  const routeEntry = manifest.routes[REQUIRED_ROUTE];
  assert(routeEntry, `cluster asset manifest missing route ${REQUIRED_ROUTE}`);
  assert(routeEntry.calculatorId === REQUIRED_CALCULATOR_ID, 'cluster asset manifest calculatorId mismatch');
  assert(routeEntry.clusterId === REQUIRED_CLUSTER, 'cluster asset manifest route clusterId mismatch');
}

function main() {
  const registry = readJson(paths.registry);
  const ownership = readJson(paths.ownership);
  const policy = readJson(paths.policy);
  const clusterNav = readJson(paths.clusterNav);
  const clusterAssets = readJson(paths.clusterAssets);

  validateRegistry(registry);
  validateOwnership(ownership);
  validateNavParity(policy, clusterNav);
  validateClusterManifest(clusterAssets);

  console.log('Cluster contract validation passed.');
}

try {
  main();
} catch (error) {
  console.error(`Cluster contract validation failed: ${error.message}`);
  process.exit(1);
}
