#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const POLICY_PATH = path.join(ROOT, 'config', 'ports.json');
const TMP_DIR = path.join(ROOT, 'tmp');
const STATE_PATH = path.join(TMP_DIR, 'ports-state.json');
const LOCK_PATH = path.join(TMP_DIR, 'ports-state.lock');
const LOCK_TIMEOUT_MS = 5000;
const LOCK_RETRY_MS = 50;
const DEFAULT_TTL_SECONDS = 2 * 60 * 60;
const VALID_STATUS = new Set(['reserved', 'in-use', 'available']);

function fail(message) {
  throw new Error(message);
}

function sleepMs(ms) {
  const sab = new SharedArrayBuffer(4);
  const arr = new Int32Array(sab);
  Atomics.wait(arr, 0, 0, ms);
}

function ensureTmp() {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJsonAtomic(filePath, payload) {
  ensureTmp();
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(payload, null, 2));
  fs.renameSync(tmpPath, filePath);
}

function validatePolicy(policy) {
  if (!policy || typeof policy !== 'object') {
    fail('Invalid ports policy: expected object.');
  }

  if (!Number.isInteger(policy.maxManagedPorts) || policy.maxManagedPorts <= 0) {
    fail('Invalid ports policy: maxManagedPorts must be a positive integer.');
  }

  if (!Array.isArray(policy.fixed) || !Array.isArray(policy.ranges)) {
    fail('Invalid ports policy: fixed and ranges arrays are required.');
  }

  let managedCount = 0;

  for (const entry of policy.fixed) {
    if (!entry?.name || !Number.isInteger(entry.defaultPort)) {
      fail('Invalid fixed entry in ports policy.');
    }
    if (!VALID_STATUS.has(entry.status)) {
      fail(`Invalid fixed status for ${entry.name}: ${entry.status}`);
    }
    managedCount += 1;
  }

  const seenPorts = new Set(policy.fixed.map((entry) => entry.defaultPort));

  for (const entry of policy.ranges) {
    if (!entry?.name || !Number.isInteger(entry.start) || !Number.isInteger(entry.end)) {
      fail('Invalid range entry in ports policy.');
    }
    if (entry.start > entry.end) {
      fail(`Invalid range for ${entry.name}: start > end.`);
    }
    if (!VALID_STATUS.has(entry.status)) {
      fail(`Invalid range status for ${entry.name}: ${entry.status}`);
    }
    for (let port = entry.start; port <= entry.end; port += 1) {
      if (seenPorts.has(port)) {
        fail(`Overlapping managed port detected: ${port}`);
      }
      seenPorts.add(port);
      managedCount += 1;
    }
  }

  if (managedCount > policy.maxManagedPorts) {
    fail(
      `Managed port count ${managedCount} exceeds maxManagedPorts ${policy.maxManagedPorts}.`
    );
  }

  return policy;
}

export function loadPolicy() {
  if (!fs.existsSync(POLICY_PATH)) {
    fail(`Missing ports policy: ${POLICY_PATH}`);
  }
  return validatePolicy(readJson(POLICY_PATH));
}

function loadState() {
  if (!fs.existsSync(STATE_PATH)) {
    return { version: 1, leases: [] };
  }
  const parsed = readJson(STATE_PATH);
  if (!Array.isArray(parsed.leases)) {
    return { version: 1, leases: [] };
  }
  return parsed;
}

function acquireLock() {
  ensureTmp();
  const deadline = Date.now() + LOCK_TIMEOUT_MS;

  while (Date.now() < deadline) {
    try {
      fs.mkdirSync(LOCK_PATH);
      return;
    } catch (error) {
      if (error && error.code !== 'EEXIST') {
        throw error;
      }
      sleepMs(LOCK_RETRY_MS);
    }
  }

  fail('Timed out waiting for ports state lock.');
}

function releaseLock() {
  if (fs.existsSync(LOCK_PATH)) {
    fs.rmSync(LOCK_PATH, { recursive: true, force: true });
  }
}

function withLockedState(mutator) {
  acquireLock();
  try {
    const state = loadState();
    const next = mutator(state) || state;
    writeJsonAtomic(STATE_PATH, next);
    return next;
  } finally {
    releaseLock();
  }
}

function parseSsOutput(stdout) {
  const map = new Map();
  const lines = String(stdout || '').split('\n').filter(Boolean);

  for (const line of lines) {
    const portMatch = line.match(/:(\d+)\s/);
    if (!portMatch) continue;
    const port = Number.parseInt(portMatch[1], 10);
    if (!Number.isInteger(port)) continue;

    const pidMatch = line.match(/pid=(\d+)/);
    const procMatch = line.match(/users:\(\("([^\"]+)"/);
    map.set(port, {
      pid: pidMatch ? Number.parseInt(pidMatch[1], 10) : null,
      process: procMatch ? procMatch[1] : null,
      source: 'ss',
    });
  }

  return map;
}

function parseLsofOutput(stdout) {
  const map = new Map();
  const lines = String(stdout || '').split('\n').filter(Boolean);

  for (const line of lines.slice(1)) {
    const cols = line.trim().split(/\s+/);
    if (cols.length < 9) continue;

    const command = cols[0] || null;
    const pid = Number.parseInt(cols[1] || '', 10);
    const name = cols[cols.length - 1] || '';
    const match = name.match(/:(\d+)\s*\(LISTEN\)$/) || name.match(/:(\d+)$/);
    if (!match) continue;

    const port = Number.parseInt(match[1], 10);
    if (!Number.isInteger(port)) continue;

    map.set(port, {
      pid: Number.isInteger(pid) ? pid : null,
      process: command,
      source: 'lsof',
    });
  }

  return map;
}

export function scanListeningPorts() {
  const ss = spawnSync('ss', ['-ltnpH'], { encoding: 'utf8' });
  if (ss.status === 0) {
    return parseSsOutput(ss.stdout);
  }

  const lsof = spawnSync('lsof', ['-nP', '-iTCP', '-sTCP:LISTEN'], {
    encoding: 'utf8',
  });
  if (lsof.status === 0) {
    return parseLsofOutput(lsof.stdout);
  }

  return new Map();
}

function processIsAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) {
    return false;
  }
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function pruneLeases(state) {
  const now = Date.now();
  state.leases = (state.leases || []).filter((lease) => {
    if (!lease || typeof lease !== 'object') return false;
    const expired = Number.isInteger(lease.expiresAt) && lease.expiresAt <= now;
    const pidDead = Number.isInteger(lease.pid) && !processIsAlive(lease.pid);
    return !expired && !pidDead;
  });
  return state;
}

function getRange(policy, group) {
  const range = policy.ranges.find((entry) => entry.name === group);
  if (!range) {
    fail(`Unknown port group: ${group}`);
  }
  return range;
}

function getFixedByPort(policy, port) {
  return policy.fixed.find((entry) => entry.defaultPort === port) || null;
}

function activeLeasesByPort(state) {
  const map = new Map();
  for (const lease of state.leases || []) {
    if (!lease?.active) continue;
    map.set(lease.port, lease);
  }
  return map;
}

function buildPortStatusRow({ policy, port, listening, lease }) {
  const fixed = getFixedByPort(policy, port);
  let group = null;
  for (const range of policy.ranges) {
    if (port >= range.start && port <= range.end) {
      group = range.name;
      break;
    }
  }

  let status = 'available';
  if (fixed?.status === 'reserved') {
    status = 'reserved';
  }
  if (lease || listening) {
    status = 'in-use';
  }

  return {
    port,
    group: group || (fixed ? fixed.name : 'unmanaged'),
    status,
    purpose: fixed?.purpose || policy.ranges.find((r) => r.name === group)?.purpose || null,
    owner: fixed?.owner || policy.ranges.find((r) => r.name === group)?.owner || null,
    leaseId: lease?.leaseId || null,
    pid: listening?.pid ?? lease?.pid ?? null,
    process: listening?.process ?? null,
  };
}

export function listManagedPortStatus() {
  const policy = loadPolicy();
  const listening = scanListeningPorts();

  const state = withLockedState((current) => pruneLeases(current));
  const active = activeLeasesByPort(state);

  const rows = [];
  for (const fixed of policy.fixed) {
    const port = fixed.defaultPort;
    rows.push(
      buildPortStatusRow({
        policy,
        port,
        listening: listening.get(port) || null,
        lease: active.get(port) || null,
      })
    );
  }

  for (const range of policy.ranges) {
    for (let port = range.start; port <= range.end; port += 1) {
      rows.push(
        buildPortStatusRow({
          policy,
          port,
          listening: listening.get(port) || null,
          lease: active.get(port) || null,
        })
      );
    }
  }

  return rows;
}

export function findNextFreePort({ group, preferPort = null }) {
  const policy = loadPolicy();
  const range = getRange(policy, group);
  const listening = scanListeningPorts();
  const state = withLockedState((current) => pruneLeases(current));
  const active = activeLeasesByPort(state);

  const isFree = (port) => !listening.has(port) && !active.has(port);

  if (Number.isInteger(preferPort)) {
    const fixed = getFixedByPort(policy, preferPort);
    if (fixed && isFree(preferPort)) {
      return {
        port: preferPort,
        selectedFrom: 'preferred-fixed',
        conflict: null,
      };
    }

    if (!isFree(preferPort)) {
      const conflict = listening.get(preferPort) || active.get(preferPort) || null;
      for (let port = range.start; port <= range.end; port += 1) {
        if (isFree(port)) {
          return {
            port,
            selectedFrom: 'range-fallback',
            conflict,
          };
        }
      }
      return {
        port: null,
        selectedFrom: 'none',
        conflict,
      };
    }
  }

  for (let port = range.start; port <= range.end; port += 1) {
    if (isFree(port)) {
      return {
        port,
        selectedFrom: 'range',
        conflict: null,
      };
    }
  }

  return {
    port: null,
    selectedFrom: 'none',
    conflict: null,
  };
}

export function acquirePortLease({
  group,
  preferPort = null,
  ttlSeconds = DEFAULT_TTL_SECONDS,
  owner = 'automation',
  metadata = {},
}) {
  const policy = loadPolicy();
  const range = getRange(policy, group);
  const listening = scanListeningPorts();

  let selectedPort = null;
  let selectedFrom = 'range';
  let conflict = null;

  const now = Date.now();
  const expiresAt = now + Math.max(1, Number(ttlSeconds) || DEFAULT_TTL_SECONDS) * 1000;

  const nextState = withLockedState((current) => {
    pruneLeases(current);
    const active = activeLeasesByPort(current);
    const isFree = (port) => !listening.has(port) && !active.has(port);

    if (Number.isInteger(preferPort)) {
      const fixed = getFixedByPort(policy, preferPort);
      if (fixed && isFree(preferPort)) {
        selectedPort = preferPort;
        selectedFrom = 'preferred-fixed';
      } else if (!isFree(preferPort)) {
        conflict = listening.get(preferPort) || active.get(preferPort) || null;
      }
    }

    if (selectedPort == null) {
      for (let port = range.start; port <= range.end; port += 1) {
        if (isFree(port)) {
          selectedPort = port;
          selectedFrom = conflict ? 'range-fallback' : 'range';
          break;
        }
      }
    }

    if (selectedPort == null) {
      fail(`No free ports available in group '${group}' (${range.start}-${range.end}).`);
    }

    const lease = {
      leaseId: `lease_${crypto.randomUUID()}`,
      group,
      port: selectedPort,
      owner,
      pid: process.pid,
      metadata,
      acquiredAt: now,
      expiresAt,
      active: true,
    };
    current.leases.push(lease);
    return current;
  });

  const lease = (nextState.leases || []).find((entry) => entry.port === selectedPort && entry.active);

  return {
    leaseId: lease?.leaseId,
    group,
    port: selectedPort,
    selectedFrom,
    conflict: conflict
      ? {
          pid: conflict.pid ?? null,
          process: conflict.process ?? null,
        }
      : null,
    ttlSeconds: Math.max(1, Number(ttlSeconds) || DEFAULT_TTL_SECONDS),
  };
}

export function releasePortLease({ leaseId }) {
  if (!leaseId) {
    fail('leaseId is required for release.');
  }

  let released = false;
  withLockedState((current) => {
    pruneLeases(current);
    current.leases = (current.leases || []).map((lease) => {
      if (lease.leaseId === leaseId && lease.active) {
        released = true;
        return { ...lease, active: false, releasedAt: Date.now() };
      }
      return lease;
    });

    current.leases = current.leases.filter((lease) => lease.active);
    return current;
  });

  return released;
}

export function garbageCollectLeases() {
  const before = loadState().leases.length;
  const afterState = withLockedState((current) => pruneLeases(current));
  return {
    removed: Math.max(0, before - afterState.leases.length),
    remaining: afterState.leases.length,
  };
}

function getArgValue(name) {
  const long = `--${name}`;
  const entry = process.argv.find((arg) => arg.startsWith(`${long}=`));
  if (entry) {
    return entry.slice(long.length + 1);
  }
  const index = process.argv.indexOf(long);
  if (index >= 0) {
    return process.argv[index + 1] || null;
  }
  return null;
}

function parseIntArg(name) {
  const raw = getArgValue(name);
  if (raw == null) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isInteger(parsed) ? parsed : null;
}

function printJson(payload) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

function runCli() {
  const command = process.argv[2];
  if (!command) {
    fail('Usage: node scripts/ports.mjs <list|next-free|acquire|release|gc>');
  }

  if (command === 'list') {
    const rows = listManagedPortStatus();
    printJson({ generatedAt: new Date().toISOString(), rows });
    return;
  }

  if (command === 'next-free') {
    const group = getArgValue('group');
    if (!group) fail('--group is required');
    const preferPort = parseIntArg('prefer');
    const result = findNextFreePort({ group, preferPort });
    if (!result.port) {
      fail(`No free port available for group '${group}'.`);
    }
    printJson(result);
    return;
  }

  if (command === 'acquire') {
    const group = getArgValue('group');
    if (!group) fail('--group is required');
    const preferPort = parseIntArg('prefer');
    const ttlSeconds = parseIntArg('ttl') || DEFAULT_TTL_SECONDS;
    const owner = getArgValue('owner') || 'automation';
    const result = acquirePortLease({ group, preferPort, ttlSeconds, owner });
    printJson(result);
    return;
  }

  if (command === 'release') {
    const leaseId = getArgValue('lease-id');
    const released = releasePortLease({ leaseId });
    printJson({ released, leaseId });
    return;
  }

  if (command === 'gc') {
    printJson(garbageCollectLeases());
    return;
  }

  fail(`Unknown command: ${command}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    runCli();
  } catch (error) {
    console.error(`Port utility error: ${error.message}`);
    process.exit(1);
  }
}
