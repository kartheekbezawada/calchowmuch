#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { getCalculatorScope, getClusterScope } from './test-scope-resolver.mjs';

const ROOT = process.cwd();

function readArg(name) {
  const prefix = `${name}=`;
  const valueArg = process.argv.find((arg) => arg.startsWith(prefix));
  return valueArg ? valueArg.slice(prefix.length) : null;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function run(command, args, extraEnv = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function collectFiles(dir, matcher) {
  if (!fs.existsSync(dir)) {
    fail(`Missing test directory: ${dir}`);
  }

  const files = fs
    .readdirSync(dir)
    .filter((name) => matcher(name))
    .sort()
    .map((name) => path.join(dir, name));

  return files;
}

function runVitest(files, scopeLabel) {
  if (!files.length) {
    fail(`No unit test files matched for ${scopeLabel}`);
  }
  run('npx', ['vitest', 'run', ...files]);
}

function runPlaywright(files, scopeLabel, extraEnv = {}) {
  if (!files.length) {
    fail(`No Playwright spec files matched for ${scopeLabel}`);
  }
  run('npx', ['playwright', 'test', ...files], extraEnv);
}

const level = readArg('--level');
const type = readArg('--type');

if (!level || !['cluster', 'calc'].includes(level)) {
  fail('Invalid --level. Use --level=cluster or --level=calc');
}

if (!type || !['unit', 'e2e', 'seo', 'cwv'].includes(type)) {
  fail('Invalid --type. Use --type=unit|e2e|seo|cwv');
}

const clusterId = process.env.CLUSTER;
if (!clusterId) {
  fail('CLUSTER is required.');
}

if (level === 'cluster') {
  const scope = getClusterScope(clusterId);
  const dir = scope.clusterReleaseDir;
  if (!dir) {
    fail(`Missing clusterReleaseDir for CLUSTER=${clusterId}`);
  }

  if (type === 'unit') {
    const files = collectFiles(
      dir,
      (name) =>
        name.endsWith('.test.js') &&
        (name.startsWith('unit') || name.startsWith('contracts'))
    );
    runVitest(files, `CLUSTER=${clusterId} TYPE=${type}`);
  } else if (type === 'e2e') {
    const files = collectFiles(
      dir,
      (name) => name.endsWith('.spec.js') && name.startsWith('e2e')
    );
    runPlaywright(files, `CLUSTER=${clusterId} TYPE=${type}`);
  } else if (type === 'seo') {
    const files = collectFiles(
      dir,
      (name) => name.endsWith('.spec.js') && name.startsWith('seo')
    );
    runPlaywright(files, `CLUSTER=${clusterId} TYPE=${type}`);
  } else if (type === 'cwv') {
    const files = collectFiles(
      dir,
      (name) => name.endsWith('.spec.js') && name.startsWith('cwv')
    );
    runPlaywright(files, `CLUSTER=${clusterId} TYPE=${type}`);
  }

  process.exit(0);
}

const calcId = process.env.CALC;
if (!calcId) {
  fail('CALC is required when --level=calc.');
}

const scope = getCalculatorScope(clusterId, calcId);
const dir = scope.calculator.releaseDir;
if (!dir) {
  fail(`Missing releaseDir for CLUSTER=${clusterId} CALC=${calcId}`);
}

if (type === 'unit') {
  const files = collectFiles(dir, (name) => name.endsWith('.test.js') && name.startsWith('unit'));
  runVitest(files, `CLUSTER=${clusterId} CALC=${calcId} TYPE=${type}`);
} else if (type === 'e2e') {
  const files = collectFiles(
    dir,
    (name) => name.endsWith('.spec.js') && name.startsWith('e2e')
  );
  runPlaywright(files, `CLUSTER=${clusterId} CALC=${calcId} TYPE=${type}`);
} else if (type === 'seo') {
  const files = collectFiles(
    dir,
    (name) => name.endsWith('.spec.js') && name.startsWith('seo')
  );
  runPlaywright(files, `CLUSTER=${clusterId} CALC=${calcId} TYPE=${type}`);
} else if (type === 'cwv') {
  const files = collectFiles(
    dir,
    (name) => name.endsWith('.spec.js') && name.startsWith('cwv')
  );
  runPlaywright(files, `CLUSTER=${clusterId} CALC=${calcId} TYPE=${type}`, {
    CWV_ASSERT_MODE: 'smoke',
  });
  run('node', ['scripts/validate-scoped-cwv-budgets.mjs']);
}
