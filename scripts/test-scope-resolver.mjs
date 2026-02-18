#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SCOPE_MAP_PATH = path.join(ROOT, 'config', 'testing', 'test-scope-map.json');

function fail(message) {
  throw new Error(message);
}

export function loadScopeMap() {
  if (!fs.existsSync(SCOPE_MAP_PATH)) {
    fail(`Missing scope map: ${SCOPE_MAP_PATH}`);
  }

  const parsed = JSON.parse(fs.readFileSync(SCOPE_MAP_PATH, 'utf8'));
  if (!parsed || typeof parsed !== 'object' || !parsed.clusters) {
    fail('Invalid test scope map: expected top-level clusters object.');
  }

  return parsed;
}

export function getClusterScope(clusterId) {
  const map = loadScopeMap();
  const cluster = map.clusters[clusterId];
  if (!cluster) {
    const valid = Object.keys(map.clusters).sort().join(', ');
    fail(`Unknown CLUSTER="${clusterId}". Valid values: ${valid}`);
  }

  return {
    clusterId,
    ...cluster,
  };
}

export function getCalculatorScope(clusterId, calculatorId) {
  const cluster = getClusterScope(clusterId);
  const calculator = cluster.calculators?.[calculatorId];

  if (!calculator) {
    const valid = Object.keys(cluster.calculators || {})
      .sort()
      .join(', ');
    fail(
      `Unknown CALC="${calculatorId}" for CLUSTER="${clusterId}". Valid values: ${valid || 'none'}`
    );
  }

  return {
    clusterId,
    calculatorId,
    cluster,
    calculator,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const cluster = process.env.CLUSTER;
  const calc = process.env.CALC;

  if (!cluster) {
    fail('CLUSTER is required.');
  }

  if (calc) {
    const scope = getCalculatorScope(cluster, calc);
    console.log(JSON.stringify(scope, null, 2));
  } else {
    const scope = getClusterScope(cluster);
    console.log(JSON.stringify(scope, null, 2));
  }
}
