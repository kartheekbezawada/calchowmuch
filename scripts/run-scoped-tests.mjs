#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { getCalculatorScope, getClusterScope } from './test-scope-resolver.mjs';
import { acquirePortLease, releasePortLease } from './ports.mjs';

const ROOT = process.cwd();
const PLAYWRIGHT_SUITE_ORDER = ['e2e', 'seo', 'cwv'];
const PLAYWRIGHT_PORT_GROUP = 'playwright';
let activePlaywrightLeaseId = null;
let activePlaywrightPort = null;

function readArg(name) {
  const prefix = `${name}=`;
  const valueArg = process.argv.find((arg) => arg.startsWith(prefix));
  return valueArg ? valueArg.slice(prefix.length) : null;
}

function hasFlag(name) {
  return process.argv.includes(name);
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

function runWithResult(command, args, extraEnv = {}) {
  const startedAt = Date.now();
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'pipe',
    encoding: 'utf8',
    env: { ...process.env, ...extraEnv },
  });

  return {
    status: result.status ?? 1,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    durationMs: Date.now() - startedAt,
  };
}

function parsePositiveInt(value) {
  if (value == null || value === '') {
    return null;
  }
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function ensurePlaywrightPortLease(scopeLabel) {
  if (activePlaywrightLeaseId && activePlaywrightPort) {
    return { leaseId: activePlaywrightLeaseId, port: activePlaywrightPort };
  }

  const preferredPort = parsePositiveInt(process.env.PW_WEB_SERVER_PORT);
  const lease = acquirePortLease({
    group: PLAYWRIGHT_PORT_GROUP,
    preferPort: preferredPort,
    owner: `run-scoped-tests:${scopeLabel}`,
  });

  activePlaywrightLeaseId = lease.leaseId;
  activePlaywrightPort = lease.port;

  if (lease.conflict) {
    console.warn(
      `[ports] Preferred port conflict detected. requested=${preferredPort} ` +
        `pid=${lease.conflict.pid ?? 'unknown'} process=${lease.conflict.process ?? 'unknown'} ` +
        `fallback=${lease.port}`
    );
  }

  const cleanup = () => {
    if (!activePlaywrightLeaseId) return;
    try {
      releasePortLease({ leaseId: activePlaywrightLeaseId });
    } catch {
      // best-effort release
    } finally {
      activePlaywrightLeaseId = null;
      activePlaywrightPort = null;
    }
  };

  process.on('exit', cleanup);
  process.on('SIGINT', () => {
    cleanup();
    process.exit(130);
  });
  process.on('SIGTERM', () => {
    cleanup();
    process.exit(143);
  });

  return { leaseId: activePlaywrightLeaseId, port: activePlaywrightPort };
}

function resolveExplicitPlaywrightEndpoint(extraEnv = {}) {
  const explicitBaseUrl = extraEnv.PW_BASE_URL || process.env.PW_BASE_URL || null;
  const explicitPort =
    parsePositiveInt(extraEnv.PW_WEB_SERVER_PORT) || parsePositiveInt(process.env.PW_WEB_SERVER_PORT);

  if (explicitBaseUrl) {
    try {
      const parsed = new URL(explicitBaseUrl);
      const derivedPort =
        explicitPort || parsePositiveInt(parsed.port) || (parsed.protocol === 'https:' ? 443 : 80);
      return {
        baseUrl: explicitBaseUrl,
        port: derivedPort,
      };
    } catch {
      // fall through to lease-based resolution when the explicit URL is malformed
    }
  }

  if (explicitPort) {
    return {
      baseUrl: `http://localhost:${explicitPort}`,
      port: explicitPort,
    };
  }

  return null;
}

function withPlaywrightPortEnv(scopeLabel, extraEnv = {}) {
  const explicitEndpoint = resolveExplicitPlaywrightEndpoint(extraEnv);
  if (explicitEndpoint) {
    return {
      ...extraEnv,
      PW_WEB_SERVER_PORT: String(explicitEndpoint.port),
      PW_BASE_URL: explicitEndpoint.baseUrl,
      SCOPED_CWV_BASE_URL:
        extraEnv.SCOPED_CWV_BASE_URL ||
        process.env.SCOPED_CWV_BASE_URL ||
        explicitEndpoint.baseUrl,
    };
  }

  const lease = ensurePlaywrightPortLease(scopeLabel);
  const baseUrl = `http://localhost:${lease.port}`;
  return {
    ...extraEnv,
    PW_WEB_SERVER_PORT: String(lease.port),
    PW_BASE_URL: baseUrl,
    SCOPED_CWV_BASE_URL: extraEnv.SCOPED_CWV_BASE_URL || process.env.SCOPED_CWV_BASE_URL || baseUrl,
  };
}

function resolveWorkers() {
  const ci = Boolean(process.env.CI);
  if (ci) {
    return parsePositiveInt(process.env.PW_WORKERS_CI) ?? 2;
  }
  return parsePositiveInt(process.env.PW_WORKERS_LOCAL);
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

function collectPlaywrightSuites(dir) {
  const suites = {};
  PLAYWRIGHT_SUITE_ORDER.forEach((suite) => {
    suites[suite] = collectFiles(
      dir,
      (name) => name.endsWith('.spec.js') && name.startsWith(suite)
    );
  });
  return suites;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function nowStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function classifySuiteFromPath(filePath) {
  const base = path.basename(filePath || '');
  if (base.startsWith('e2e')) return 'e2e';
  if (base.startsWith('seo')) return 'seo';
  if (base.startsWith('cwv')) return 'cwv';
  return 'other';
}

function walkPlaywrightSuites(suites, visitor) {
  (suites || []).forEach((suite) => {
    (suite.specs || []).forEach((spec) => {
      visitor(spec, suite);
    });
    walkPlaywrightSuites(suite.suites || [], visitor);
  });
}

function parsePlaywrightJson(reportPath) {
  if (!fs.existsSync(reportPath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  } catch {
    return null;
  }
}

function summarizeBySuite(reportJson, suiteFiles) {
  const initialized = {};
  PLAYWRIGHT_SUITE_ORDER.forEach((suite) => {
    initialized[suite] = {
      suite,
      files: suiteFiles[suite] || [],
      tests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      durationMs: 0,
      status: 'not_run',
    };
  });

  if (!reportJson) {
    return initialized;
  }

  walkPlaywrightSuites(reportJson.suites, (spec) => {
    const suite = classifySuiteFromPath(spec.file);
    if (!initialized[suite]) {
      return;
    }
    (spec.tests || []).forEach((testCase) => {
      initialized[suite].tests += 1;
      const results = testCase.results || [];
      const durationMs = results.reduce((sum, item) => sum + Number(item.duration || 0), 0);
      initialized[suite].durationMs += durationMs;
      const terminal = results[results.length - 1];
      const status = terminal?.status || testCase.status || 'unknown';

      if (status === 'passed') {
        initialized[suite].passed += 1;
      } else if (status === 'skipped') {
        initialized[suite].skipped += 1;
      } else {
        initialized[suite].failed += 1;
      }
    });
  });

  PLAYWRIGHT_SUITE_ORDER.forEach((suite) => {
    const row = initialized[suite];
    if (!row.files.length) {
      row.status = 'not_included';
      return;
    }
    row.status = row.failed > 0 ? 'fail' : 'pass';
  });

  return initialized;
}

function runPlaywrightGrouped(scopeDetails, suiteFiles, extraEnv = {}) {
  const orderedFiles = PLAYWRIGHT_SUITE_ORDER.flatMap((suite) => suiteFiles[suite] || []);
  if (!orderedFiles.length) {
    fail(`No Playwright spec files matched for ${scopeDetails.scopeLabel}`);
  }

  const scopePath =
    scopeDetails.level === 'cluster'
      ? path.join('cluster', scopeDetails.clusterId)
      : path.join('calc', scopeDetails.clusterId, scopeDetails.calcId);
  const runDir = path.join(ROOT, 'test-results', 'playwright', scopePath, nowStamp());
  const artifactDir = path.join(runDir, 'artifacts');
  const htmlReportDir = path.join(runDir, 'html-report');
  const jsonReportPath = path.join(runDir, 'playwright.raw.json');
  const stdoutLogPath = path.join(runDir, 'playwright.stdout.log');
  const summaryPath = path.join(runDir, 'playwright-all.summary.json');
  const cwvValidatorOutputPath = path.join(runDir, 'cwv-validator.log');

  ensureDir(runDir);
  ensureDir(artifactDir);
  ensureDir(htmlReportDir);

  const workers = resolveWorkers();
  const args = [
    'playwright',
    'test',
    ...orderedFiles,
    '--reporter=list,json,html',
    '--output',
    artifactDir,
  ];
  if (workers) {
    args.push('--workers', String(workers));
  }

  const env = {
    ...withPlaywrightPortEnv(scopeDetails.scopeLabel, extraEnv),
    PLAYWRIGHT_JSON_OUTPUT_NAME: jsonReportPath,
    PLAYWRIGHT_HTML_OUTPUT_DIR: htmlReportDir,
    PLAYWRIGHT_HTML_OPEN: 'never',
  };

  const commandForSummary = `npx ${args.join(' ')}`;
  const startedAt = new Date().toISOString();
  const execution = runWithResult('npx', args, env);
  fs.writeFileSync(stdoutLogPath, `${execution.stdout}${execution.stderr}`);

  if (execution.stdout) process.stdout.write(execution.stdout);
  if (execution.stderr) process.stderr.write(execution.stderr);

  let cwvValidatorStatus = null;
  let cwvValidatorStdout = '';
  let cwvValidatorStderr = '';
  const includesCwv = (suiteFiles.cwv || []).length > 0;
  const shouldRunCwvValidator = includesCwv && scopeDetails.level === 'calc';
  if (shouldRunCwvValidator && execution.status === 0) {
    const validator = runWithResult(
      'node',
      ['scripts/validate-scoped-cwv-budgets.mjs'],
      withPlaywrightPortEnv(scopeDetails.scopeLabel, extraEnv)
    );
    cwvValidatorStatus = validator.status;
    cwvValidatorStdout = validator.stdout;
    cwvValidatorStderr = validator.stderr;
    fs.writeFileSync(cwvValidatorOutputPath, `${validator.stdout}${validator.stderr}`);
    if (validator.stdout) process.stdout.write(validator.stdout);
    if (validator.stderr) process.stderr.write(validator.stderr);
    if (validator.status !== 0) {
      execution.status = validator.status;
    }
  }

  const reportJson = parsePlaywrightJson(jsonReportPath);
  const suiteSummary = summarizeBySuite(reportJson, suiteFiles);
  const scopeRoutes =
    scopeDetails.level === 'cluster' ? scopeDetails.routes || [] : [scopeDetails.route].filter(Boolean);
  const summary = {
    scope: {
      level: scopeDetails.level,
      cluster: scopeDetails.clusterId,
      calc: scopeDetails.calcId || null,
      routes: scopeRoutes,
    },
    includedSuites: PLAYWRIGHT_SUITE_ORDER.filter((suite) => (suiteFiles[suite] || []).length > 0),
    suiteOrder: PLAYWRIGHT_SUITE_ORDER,
    workers: workers ?? 'auto',
    ci: Boolean(process.env.CI),
    results: suiteSummary,
    artifacts: {
      runDir,
      playwrightJson: jsonReportPath,
      playwrightStdoutLog: stdoutLogPath,
      htmlReportDir,
      testOutputDir: artifactDir,
      scopedCwvArtifact:
        scopeDetails.level === 'calc'
          ? path.join(
              ROOT,
              'test-results',
              'performance',
              'scoped-cwv',
              scopeDetails.clusterId,
              `${scopeDetails.calcId}.json`
            )
          : null,
      cwvValidatorOutput: cwvValidatorStatus !== null ? cwvValidatorOutputPath : null,
    },
    timingsMs: {
      total: execution.durationMs,
      perSuite: PLAYWRIGHT_SUITE_ORDER.reduce((acc, suite) => {
        acc[suite] = suiteSummary[suite]?.durationMs ?? 0;
        return acc;
      }, {}),
    },
    command: commandForSummary,
    generatedAt: new Date().toISOString(),
    startedAt,
    statuses: {
      playwright: execution.status === 0 ? 'pass' : 'fail',
      cwvValidator:
        shouldRunCwvValidator && cwvValidatorStatus !== null
          ? cwvValidatorStatus === 0
            ? 'pass'
            : 'fail'
          : 'not_run',
    },
    cwvValidatorLogs:
      includesCwv && cwvValidatorStatus !== null
        ? {
            stdout: cwvValidatorStdout,
            stderr: cwvValidatorStderr,
          }
        : null,
  };
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`Grouped Playwright summary: ${summaryPath}`);

  if (execution.status !== 0) {
    process.exit(execution.status ?? 1);
  }
}

function printDryRun(scopeDetails, suiteFiles, selectedType) {
  const workers = resolveWorkers();
  const dryPayload = {
    scope: {
      level: scopeDetails.level,
      cluster: scopeDetails.clusterId,
      calc: scopeDetails.calcId || null,
      route: scopeDetails.route || null,
      routes: scopeDetails.routes || [],
    },
    type: selectedType,
    suiteOrder: PLAYWRIGHT_SUITE_ORDER,
    suites: suiteFiles,
    workers: workers ?? 'auto',
    ci: Boolean(process.env.CI),
    commandPreview:
      selectedType === 'playwright-all'
        ? `npx playwright test ${PLAYWRIGHT_SUITE_ORDER.flatMap((suite) => suiteFiles[suite] || []).join(' ')} --reporter=list,json,html`
        : null,
  };
  console.log(JSON.stringify(dryPayload, null, 2));
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
  run('npx', ['playwright', 'test', ...files], withPlaywrightPortEnv(scopeLabel, extraEnv));
}

const level = readArg('--level');
const type = readArg('--type');
const dryRun = hasFlag('--dry-run');

if (!level || !['cluster', 'calc'].includes(level)) {
  fail('Invalid --level. Use --level=cluster or --level=calc');
}

if (!type || !['unit', 'e2e', 'seo', 'cwv', 'playwright-all'].includes(type)) {
  fail('Invalid --type. Use --type=unit|e2e|seo|cwv|playwright-all');
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
  const scopeDetails = {
    level: 'cluster',
    clusterId,
    routes: scope.routes || [],
    scopeLabel: `CLUSTER=${clusterId} TYPE=${type}`,
  };

  if (type === 'unit') {
    const files = collectFiles(
      dir,
      (name) =>
        name.endsWith('.test.js') &&
        (name.startsWith('unit') || name.startsWith('contracts'))
    );
    if (dryRun) {
      printDryRun(scopeDetails, { unit: files }, type);
      process.exit(0);
    }
    runVitest(files, `CLUSTER=${clusterId} TYPE=${type}`);
  } else if (type === 'e2e') {
    const files = collectFiles(
      dir,
      (name) => name.endsWith('.spec.js') && name.startsWith('e2e')
    );
    if (dryRun) {
      printDryRun(scopeDetails, { e2e: files }, type);
      process.exit(0);
    }
    runPlaywright(files, `CLUSTER=${clusterId} TYPE=${type}`);
  } else if (type === 'seo') {
    const files = collectFiles(
      dir,
      (name) => name.endsWith('.spec.js') && name.startsWith('seo')
    );
    if (dryRun) {
      printDryRun(scopeDetails, { seo: files }, type);
      process.exit(0);
    }
    runPlaywright(files, `CLUSTER=${clusterId} TYPE=${type}`);
    run('node', ['scripts/content-quality-thin-score.mjs', '--scope=cluster']);
  } else if (type === 'cwv') {
    const files = collectFiles(
      dir,
      (name) => name.endsWith('.spec.js') && name.startsWith('cwv')
    );
    if (dryRun) {
      printDryRun(scopeDetails, { cwv: files }, type);
      process.exit(0);
    }
    runPlaywright(files, `CLUSTER=${clusterId} TYPE=${type}`);
  } else if (type === 'playwright-all') {
    const suiteFiles = collectPlaywrightSuites(dir);
    if (dryRun) {
      printDryRun(scopeDetails, suiteFiles, type);
      process.exit(0);
    }
    runPlaywrightGrouped(scopeDetails, suiteFiles);
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
const scopeDetails = {
  level: 'calc',
  clusterId,
  calcId,
  route: scope.calculator.route || null,
  scopeLabel: `CLUSTER=${clusterId} CALC=${calcId} TYPE=${type}`,
};

if (type === 'unit') {
  const files = collectFiles(dir, (name) => name.endsWith('.test.js') && name.startsWith('unit'));
  if (dryRun) {
    printDryRun(scopeDetails, { unit: files }, type);
    process.exit(0);
  }
  runVitest(files, `CLUSTER=${clusterId} CALC=${calcId} TYPE=${type}`);
} else if (type === 'e2e') {
  const files = collectFiles(
    dir,
    (name) => name.endsWith('.spec.js') && name.startsWith('e2e')
  );
  if (dryRun) {
    printDryRun(scopeDetails, { e2e: files }, type);
    process.exit(0);
  }
  runPlaywright(files, `CLUSTER=${clusterId} CALC=${calcId} TYPE=${type}`);
} else if (type === 'seo') {
  const files = collectFiles(
    dir,
    (name) => name.endsWith('.spec.js') && name.startsWith('seo')
  );
  if (dryRun) {
    printDryRun(scopeDetails, { seo: files }, type);
    process.exit(0);
  }
  runPlaywright(files, `CLUSTER=${clusterId} CALC=${calcId} TYPE=${type}`);
  run('node', ['scripts/content-quality-thin-score.mjs', '--scope=calc']);
} else if (type === 'cwv') {
  const files = collectFiles(
    dir,
    (name) => name.endsWith('.spec.js') && name.startsWith('cwv')
  );
  if (dryRun) {
    printDryRun(scopeDetails, { cwv: files }, type);
    process.exit(0);
  }
  runPlaywright(files, `CLUSTER=${clusterId} CALC=${calcId} TYPE=${type}`, {
    CWV_ASSERT_MODE: 'smoke',
  });
  run(
    'node',
    ['scripts/validate-scoped-cwv-budgets.mjs'],
    withPlaywrightPortEnv(`CLUSTER=${clusterId} CALC=${calcId} TYPE=${type}`, {
      CWV_ASSERT_MODE: 'smoke',
    })
  );
} else if (type === 'playwright-all') {
  const suiteFiles = collectPlaywrightSuites(dir);
  if (dryRun) {
    printDryRun(scopeDetails, suiteFiles, type);
    process.exit(0);
  }
  runPlaywrightGrouped(scopeDetails, suiteFiles, {
    CWV_ASSERT_MODE: 'smoke',
  });
}
