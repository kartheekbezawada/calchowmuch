#!/usr/bin/env node
/**
 * Tax-data schema validator.
 *
 * Enforces the contract in `files/docs/salary calculator/salary-calculator-tax-engine-spec.md` §11.1
 * and the Phase 1 checklist: every table carries versioning metadata, every rate is a sane
 * fraction, and progressive bands are contiguous and non-overlapping.
 *
 * Two modes:
 *   node scripts/validate-tax-data.mjs            structural checks only (development)
 *   node scripts/validate-tax-data.mjs --strict   ALSO requires `lastVerified` on every file
 *
 * `--strict` is the pre-ship gate. A table whose figures have not been confirmed against the
 * official source has `lastVerified: null`, which fails strict mode. This exists because the
 * cost of shipping a wrong tax threshold is a confidently-presented wrong number, which is
 * worse than no calculator at all.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TAX_DATA_ROOT = path.resolve(
  HERE,
  '..',
  'public/calculators/salary-calculators/shared/tax-data',
);

const REQUIRED_META = [
  'country',
  'dataset',
  'taxYear',
  'effectiveFrom',
  'effectiveTo',
  'source',
  'lastVerified',
];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const errors = [];
const warnings = [];
const aggregated = [];

function fail(file, message) {
  errors.push(`${file}: ${message}`);
}

function warn(file, message) {
  warnings.push(`${file}: ${message}`);
}

function walkJson(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkJson(full);
    return entry.isFile() && entry.name.endsWith('.json') ? [full] : [];
  });
}

/** Metadata every table must carry, per spec §11.1. */
function validateMeta(rel, data, strict) {
  for (const key of REQUIRED_META) {
    if (!(key in data)) {
      fail(rel, `missing required field \`${key}\` (spec §11.1)`);
    }
  }

  for (const key of ['effectiveFrom', 'effectiveTo']) {
    if (data[key] !== undefined && !ISO_DATE.test(String(data[key]))) {
      fail(rel, `\`${key}\` must be an ISO date (YYYY-MM-DD), got ${JSON.stringify(data[key])}`);
    }
  }

  if (data.effectiveFrom && data.effectiveTo && data.effectiveFrom >= data.effectiveTo) {
    fail(rel, `\`effectiveFrom\` (${data.effectiveFrom}) must be before \`effectiveTo\` (${data.effectiveTo})`);
  }

  if (typeof data.source !== 'string' || !/^https?:\/\//.test(data.source || '')) {
    fail(rel, '`source` must be an official URL (spec §11.4)');
  }

  if (data.lastVerified === null || data.lastVerified === undefined) {
    const message = '`lastVerified` is null — figures have not been confirmed against `source`';
    if (strict) {
      fail(rel, `${message}. Blocked from shipping.`);
    } else {
      warn(rel, message);
    }
  } else if (!ISO_DATE.test(String(data.lastVerified))) {
    fail(rel, `\`lastVerified\` must be an ISO date, got ${JSON.stringify(data.lastVerified)}`);
  }

  if (strict && data.verification) {
    const status = data.verification.status;
    // `aggregated-source` is a real, narrower tier — figures taken from a reputable aggregator
    // rather than confirmed against each issuing authority. It is accepted in strict mode ONLY
    // for US state and payroll files, where per-jurisdiction confirmation across 51 authorities
    // is impractical, and only when the file records what that means. Everything else must be
    // `verified`, so the UK tables and the IRS-sourced federal/FICA files cannot quietly slip
    // down a tier.
    const aggregatedAllowed = /^us\/(states\/|payroll-taxes)/.test(rel);
    if (status === 'aggregated-source' && aggregatedAllowed) {
      if (!data.verification.note) {
        fail(rel, '`aggregated-source` requires a `verification.note` saying what was and was not confirmed.');
      }
      aggregated.push(rel);
    } else if (status !== 'verified') {
      fail(rel, `\`verification.status\` is "${status}", expected "verified"${aggregatedAllowed ? ' or "aggregated-source"' : ''}. Blocked from shipping.`);
    }
  }
}

/**
 * Progressive bands must be contiguous and non-overlapping, ordered, with exactly one open
 * top band. A gap or an overlap silently produces a wrong tax figure rather than an error,
 * so this is checked structurally rather than trusted.
 */
function validateBands(rel, label, bands) {
  if (!Array.isArray(bands) || bands.length === 0) {
    fail(rel, `${label}: expected a non-empty \`bands\` array`);
    return;
  }

  bands.forEach((band, i) => {
    const where = `${label}[${i}]${band.id ? ` (${band.id})` : ''}`;

    if (typeof band.rate !== 'number' || Number.isNaN(band.rate)) {
      fail(rel, `${where}: \`rate\` must be a number`);
    } else if (band.rate < 0 || band.rate > 1) {
      fail(rel, `${where}: \`rate\` must be a fraction between 0 and 1, got ${band.rate}. A rate of 20% is 0.2, not 20.`);
    }

    if (typeof band.from !== 'number' || band.from < 0) {
      fail(rel, `${where}: \`from\` must be a non-negative number`);
    }

    const isLast = i === bands.length - 1;
    if (isLast) {
      if (band.to !== null) {
        fail(rel, `${where}: the top band must have \`to: null\` (unbounded), got ${JSON.stringify(band.to)}`);
      }
    } else {
      if (typeof band.to !== 'number') {
        fail(rel, `${where}: \`to\` must be a number for all but the top band`);
      } else if (band.to <= band.from) {
        fail(rel, `${where}: \`to\` (${band.to}) must be greater than \`from\` (${band.from})`);
      }

      const next = bands[i + 1];
      if (typeof band.to === 'number' && typeof next.from === 'number' && band.to !== next.from) {
        fail(
          rel,
          `${where}: band boundary discontinuity — this band ends at ${band.to} but the next starts at ${next.from}. ` +
            'Bands must be contiguous; a gap silently under-taxes and an overlap silently double-taxes.',
        );
      }
    }
  });

  const rates = bands.map((b) => b.rate);
  const sorted = [...rates].sort((a, b) => a - b);
  if (JSON.stringify(rates) !== JSON.stringify(sorted)) {
    warn(rel, `${label}: rates are not in ascending order (${rates.join(', ')}). Legitimate for some regressive schedules, but worth confirming.`);
  }
}

/** Dataset-specific structure. */
function validateDataset(rel, data, strict) {
  switch (data.dataset) {
    case 'income-tax': {
      const pa = data.personalAllowance;
      if (!pa || typeof pa.amount !== 'number') {
        fail(rel, '`personalAllowance.amount` is required');
      } else if (pa.taper) {
        const { thresholdIncome, reducedByPerPoundOver, fullyRemovedAtIncome } = pa.taper;
        const expected = thresholdIncome + pa.amount / reducedByPerPoundOver;
        if (Math.abs(expected - fullyRemovedAtIncome) > 1) {
          fail(
            rel,
            `personalAllowance.taper is internally inconsistent: losing ${reducedByPerPoundOver} per pound above ` +
              `${thresholdIncome} exhausts an allowance of ${pa.amount} at ${expected}, but ` +
              `\`fullyRemovedAtIncome\` says ${fullyRemovedAtIncome}.`,
          );
        }
      }

      if (!data.bandSets || typeof data.bandSets !== 'object') {
        fail(rel, '`bandSets` is required');
        break;
      }
      for (const [key, set] of Object.entries(data.bandSets)) {
        validateBands(rel, `bandSets.${key}.bands`, set.bands);
      }
      for (const [key, region] of Object.entries(data.regions || {})) {
        if (!data.bandSets[region.bandSet]) {
          fail(rel, `regions.${key} references unknown bandSet "${region.bandSet}"`);
        }
      }
      break;
    }

    case 'national-insurance': {
      const ni = data.class1Employee;
      if (!ni) {
        fail(rel, '`class1Employee` is required');
        break;
      }
      validateBands(rel, 'class1Employee.bands', ni.bands);
      if (ni.bands?.[0] && ni.bands[0].from !== ni.primaryThreshold) {
        fail(rel, `class1Employee: first band starts at ${ni.bands[0].from} but \`primaryThreshold\` is ${ni.primaryThreshold}`);
      }
      break;
    }

    case 'student-loans': {
      if (!data.plans || Object.keys(data.plans).length === 0) {
        fail(rel, '`plans` is required and must be non-empty');
        break;
      }
      for (const [key, plan] of Object.entries(data.plans)) {
        if (typeof plan.annualThreshold !== 'number' || plan.annualThreshold <= 0) {
          fail(rel, `plans.${key}: \`annualThreshold\` must be a positive number`);
        }
        if (typeof plan.rate !== 'number' || plan.rate <= 0 || plan.rate > 1) {
          fail(rel, `plans.${key}: \`rate\` must be a fraction between 0 and 1, got ${plan.rate}`);
        }
      }
      break;
    }

    case 'pension': {
      const ae = data.autoEnrolment;
      if (!ae) {
        fail(rel, '`autoEnrolment` is required');
        break;
      }
      if (ae.qualifyingEarnings.lower >= ae.qualifyingEarnings.upper) {
        fail(rel, 'autoEnrolment.qualifyingEarnings: `lower` must be less than `upper`');
      }
      const parts = ae.minimumEmployeeContribution + ae.minimumEmployerContribution;
      if (Math.abs(parts - ae.minimumTotalContribution) > 1e-9) {
        fail(
          rel,
          `autoEnrolment: employee (${ae.minimumEmployeeContribution}) + employer ` +
            `(${ae.minimumEmployerContribution}) = ${parts.toFixed(4)}, which does not equal ` +
            `\`minimumTotalContribution\` (${ae.minimumTotalContribution}).`,
        );
      }
      const defaults = Object.values(data.reliefMethods || {}).filter((m) => m.isDefault);
      if (defaults.length !== 1) {
        fail(rel, `reliefMethods: expected exactly one method with \`isDefault: true\`, found ${defaults.length}`);
      }
      break;
    }

    case 'federal-income-tax': {
      const statuses = data.filingStatuses || {};
      const required = ['single', 'marriedFilingJointly', 'marriedFilingSeparately', 'headOfHousehold'];
      for (const key of required) {
        if (!statuses[key]) {
          fail(rel, `missing filing status "${key}" — all four are required (spec §8.1)`);
          continue;
        }
        if (typeof statuses[key].standardDeduction !== 'number') {
          fail(rel, `filingStatuses.${key}: \`standardDeduction\` must be a number`);
        }
        validateBands(rel, `filingStatuses.${key}.bands`, statuses[key].bands);
      }
      break;
    }

    case 'fica': {
      for (const key of ['socialSecurity', 'medicare', 'additionalMedicare']) {
        if (!data[key]) fail(rel, `\`${key}\` is required`);
      }
      const ss = data.socialSecurity || {};
      if (ss.wageBase !== null && (typeof ss.wageBase !== 'number' || ss.wageBase <= 0)) {
        fail(rel, 'socialSecurity.wageBase must be a positive number (Social Security is capped)');
      }
      if (data.medicare && data.medicare.wageBase !== null) {
        fail(rel, 'medicare.wageBase must be null — Medicare has no wage cap');
      }
      for (const [key, node] of Object.entries(data)) {
        if (node && typeof node === 'object' && typeof node.rate === 'number') {
          if (node.rate < 0 || node.rate > 1) {
            fail(rel, `${key}.rate must be a fraction between 0 and 1, got ${node.rate}`);
          }
        }
      }
      break;
    }

    case 'us-state-income-tax': {
      const structure = data.taxStructure;
      if (!['none', 'flat', 'graduated'].includes(structure)) {
        fail(rel, `\`taxStructure\` must be none|flat|graduated, got "${structure}"`);
        break;
      }
      if (structure === 'none') {
        if (Object.keys(data.filingStatuses || {}).length > 0) {
          fail(rel, 'taxStructure "none" must not define filing statuses');
        }
        break;
      }
      const statuses = data.filingStatuses || {};
      if (!statuses.single) {
        fail(rel, 'a `single` filing status is required for flat and graduated states');
        break;
      }
      for (const [key, status] of Object.entries(statuses)) {
        validateBands(rel, `filingStatuses.${key}.bands`, status.bands);
      }
      break;
    }

    case 'payroll-taxes': {
      for (const [code, entry] of Object.entries(data.states || {})) {
        if (!Array.isArray(entry.contributions) || entry.contributions.length === 0) {
          fail(rel, `states.${code}: \`contributions\` must be a non-empty array`);
          continue;
        }
        for (const c of entry.contributions) {
          if (typeof c.rate !== 'number' || c.rate < 0 || c.rate > 1) {
            fail(rel, `states.${code}.${c.id}: rate must be a fraction between 0 and 1, got ${c.rate}`);
          }
          if (c.wageBase !== null && (typeof c.wageBase !== 'number' || c.wageBase <= 0)) {
            fail(rel, `states.${code}.${c.id}: wageBase must be null or a positive number`);
          }
        }
      }
      break;
    }

    default:
      warn(rel, `unrecognised \`dataset\` value "${data.dataset}" — no structural checks applied`);
  }
}

function main() {
  const strict = process.argv.includes('--strict');
  const files = walkJson(TAX_DATA_ROOT);

  if (files.length === 0) {
    console.error(`No tax-data JSON found under ${TAX_DATA_ROOT}`);
    process.exit(1);
  }

  for (const file of files) {
    const rel = path.relative(TAX_DATA_ROOT, file).replace(/\\/g, '/');
    let data;
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
      fail(rel, `invalid JSON — ${error.message}`);
      continue;
    }
    validateMeta(rel, data, strict);
    validateDataset(rel, data, strict);
  }

  console.log(`Checked ${files.length} tax-data file${files.length === 1 ? '' : 's'} in ${strict ? 'STRICT (pre-ship)' : 'structural'} mode.\n`);

  if (warnings.length) {
    console.log(`Warnings (${warnings.length}):`);
    warnings.forEach((w) => console.log(`  ! ${w}`));
    console.log('');
  }

  if (errors.length) {
    console.error(`Errors (${errors.length}):`);
    errors.forEach((e) => console.error(`  x ${e}`));
    console.error('');
    process.exit(1);
  }

  if (aggregated.length) {
    console.log(`NOTE: ${aggregated.length} file(s) ship at the 'aggregated-source' tier.`);
    console.log('      Figures come from a reputable aggregator, NOT from confirmation against');
    console.log('      each issuing authority. The UI must disclose this.');
    console.log("      See each file's verification.note for what was and was not checked.");
    console.log('');
  }

  console.log('All structural checks passed.');
  if (!strict && warnings.length) {
    console.log('Run with --strict before shipping — unverified tables will block.');
  }
}

main();
