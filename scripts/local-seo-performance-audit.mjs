#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import process from 'node:process';
import { JSDOM } from 'jsdom';
import { chromium } from 'playwright';

const DEFAULTS = {
  baseUrl: 'http://127.0.0.1:8000',
  slugsPath: 'requirements/compliance/REQ-20260208-029.slugs.txt',
  auditPath: 'requirements/compliance/Audit.md',
  outputDir: 'test-results/seo/local-audit',
  timeoutMs: 30000,
  ignorePerf: false,
};

function parseArgs(argv) {
  const args = { ...DEFAULTS };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--base-url') args.baseUrl = argv[++i];
    if (token === '--slugs') args.slugsPath = argv[++i];
    if (token === '--audit-md') args.auditPath = argv[++i];
    if (token === '--out-dir') args.outputDir = argv[++i];
    if (token === '--timeout-ms') args.timeoutMs = Number(argv[++i] ?? DEFAULTS.timeoutMs);
    if (token === '--ignore-perf') args.ignorePerf = true;
  }
  return args;
}

function normalizeSlug(rawSlug) {
  if (!rawSlug) return '/';
  let slug = rawSlug.trim();
  if (!slug.startsWith('/')) slug = `/${slug}`;
  if (slug !== '/' && !slug.endsWith('/')) slug = `${slug}/`;
  return slug.replace(/\/{2,}/g, '/');
}

function slugToFolder(slug) {
  if (slug === '/') return '__root__';
  return slug.replace(/^\/|\/$/g, '').replace(/\//g, '__');
}

function toTitleCase(value) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function inferCategory(slug) {
  if (slug === '/') return 'Home';
  if (slug.startsWith('/finance/') || slug.startsWith('/finance-calculators/')) return 'Finance';
  if (slug.startsWith('/percentage-calculators/')) return 'Percentage Calculators';
  if (slug.startsWith('/time-and-date/')) return 'Time & Date';
  if (
    slug.startsWith('/credit-card-calculators/credit-card-') ||
    slug.startsWith('/credit-card-calculators/balance-transfer-')
  ) {
    return 'Credit Cards';
  }
  if (
    slug.startsWith('/loan-calculators/mortgage-calculator/') ||
    slug.startsWith('/loan-calculators/how-much-can-i-borrow/') ||
    slug.startsWith('/loan-calculators/remortgage-calculator/') ||
    slug.startsWith('/loan-calculators/buy-to-let-mortgage-calculator/') ||
    slug.startsWith('/loan-calculators/offset-mortgage-calculator/') ||
    slug.startsWith('/loan-calculators/interest-rate-change-calculator/') ||
    slug.startsWith('/loan-calculators/ltv-calculator/')
  ) {
    return 'Home Loan';
  }
  if (
    slug.startsWith('/car-loan-calculators/car-loan-calculator/') ||
    slug.startsWith('/car-loan-calculators/pcp-calculator/') ||
    slug.startsWith('/car-loan-calculators/auto-loan-calculator/') ||
    slug.startsWith('/car-loan-calculators/hire-purchase-calculator/') ||
    slug.startsWith('/car-loan-calculators/car-lease-calculator/')
  ) {
    return 'Auto Loans';
  }
  return toTitleCase(slug.split('/').filter(Boolean)[0] ?? 'Other');
}

function normalizeText(text) {
  return (text ?? '')
    .replace(/\s+/g, ' ')
    .replace(/^Q:\s*/i, '')
    .replace(/^A:\s*/i, '')
    .trim()
    .toLowerCase();
}

function h1KeywordCheck(h1Text, titleText) {
  const h1Tokens = normalizeText(h1Text)
    .split(' ')
    .filter((token) => token.length > 2);
  const titleTokens = new Set(
    normalizeText(titleText)
      .replace('calchowmuch', '')
      .split(' ')
      .filter((token) => token.length > 2),
  );
  if (!h1Tokens.length || !titleTokens.size) return false;
  const overlap = h1Tokens.filter((token) => titleTokens.has(token)).length;
  return overlap / h1Tokens.length >= 0.45;
}

function readJsonLdObjects(document, debugUrl = '') {
  const nodes = [...document.querySelectorAll('script[type="application/ld+json"]')];

  // DEBUG: Log how many script tags were found
  if (debugUrl.includes('reverse-percentage') || debugUrl.includes('what-percent-is-x-of-y')) {
    console.log(`[DEBUG ${debugUrl}] Found ${nodes.length} JSON-LD script tags`);
  }

  const parsed = [];
  for (const node of nodes) {
    const raw = node.textContent?.trim();

    // DEBUG: Log script content length
    if (debugUrl.includes('reverse-percentage') || debugUrl.includes('what-percent-is-x-of-y')) {
      console.log(`[DEBUG ${debugUrl}] Script content length: ${raw?.length || 0}`);
      if (raw) {
        console.log(`[DEBUG ${debugUrl}] First 100 chars: ${raw.substring(0, 100)}`);
      }
    }

    if (!raw) continue;
    try {
      parsed.push(JSON.parse(raw));
    } catch (error) {
      // DEBUG: Log parsing errors for failing calculators
      if (debugUrl.includes('reverse-percentage') || debugUrl.includes('what-percent-is-x-of-y')) {
        console.error(`[DEBUG ${debugUrl}] JSON parse error: ${error.message}`);
      }
    }
  }

  // DEBUG: Log final parsed count
  if (debugUrl.includes('reverse-percentage') || debugUrl.includes('what-percent-is-x-of-y')) {
    console.log(`[DEBUG ${debugUrl}] Successfully parsed ${parsed.length} JSON-LD objects`);
  }

  return parsed;
}

function collectTypes(payload, types = []) {
  if (!payload) return types;
  if (Array.isArray(payload)) {
    payload.forEach((entry) => collectTypes(entry, types));
    return types;
  }
  if (typeof payload !== 'object') return types;
  if (typeof payload['@type'] === 'string') {
    types.push(payload['@type']);
  } else if (Array.isArray(payload['@type'])) {
    payload['@type'].forEach((entry) => {
      if (typeof entry === 'string') types.push(entry);
    });
  }
  if (payload['@graph']) collectTypes(payload['@graph'], types);
  return types;
}

function extractFaqPage(payload) {
  if (!payload) return null;
  if (Array.isArray(payload)) {
    for (const entry of payload) {
      const found = extractFaqPage(entry);
      if (found) return found;
    }
    return null;
  }
  if (typeof payload !== 'object') return null;

  const type = payload['@type'];
  const hasFaqType =
    (typeof type === 'string' && type === 'FAQPage') ||
    (Array.isArray(type) && type.includes('FAQPage'));
  if (hasFaqType) return payload;
  if (payload['@graph']) return extractFaqPage(payload['@graph']);
  return null;
}

function detectCalculatorPage(document) {
  const bodyPage = document.querySelector('body')?.getAttribute('data-page');
  if (bodyPage === 'calculator') return true;
  return Boolean(
    document.querySelector('.calculator-ui,[id^="calc-"],[id*="calc-"]') &&
      document.querySelector('.explanation-pane,[id*="explanation"]'),
  );
}

function getVisibleFaqQuestions(document) {
  const candidates = [
    ...document.querySelectorAll('.faq-box strong'),
    ...document.querySelectorAll('.faq-item summary'),
    ...document.querySelectorAll('.faq-item h3'),
    ...document.querySelectorAll('[id*="faq"] strong'),
  ];
  const unique = new Set();
  for (const node of candidates) {
    const text = normalizeText(node.textContent);
    if (text) unique.add(text.replace(/\?$/, ''));
  }
  return [...unique];
}

function formatSecondsFromMs(ms) {
  if (typeof ms !== 'number' || Number.isNaN(ms)) return 'N/A';
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatNumber(value, digits = 2) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A';
  return value.toFixed(digits);
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal, redirect: 'follow' });
  } finally {
    clearTimeout(timer);
  }
}

async function loadSlugs(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  const slugs = raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map(normalizeSlug);
  return [...new Set(slugs)];
}

async function loadSitemapPaths(baseUrl, timeoutMs) {
  try {
    const response = await fetchWithTimeout(new URL('/sitemap.xml', baseUrl).href, timeoutMs);
    if (!response.ok) return new Set();
    const xml = await response.text();
    const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
    const paths = matches
      .map((entry) => {
        try {
          return normalizeSlug(new URL(entry[1]).pathname);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    return new Set(paths);
  } catch {
    return new Set();
  }
}

function runLighthouse({ url, preset, chromePath, outputPath, slugFolder }) {
  const profileDir = `/tmp/lighthouse-audit-${slugFolder}-${preset}-${Date.now()}`;
  const chromeFlags = [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--user-data-dir=${profileDir}`,
    '--window-size=1365,940',
  ].join(' ');
  const args = [
    'lighthouse',
    url,
    '--only-categories=performance',
    '--chrome-flags',
    chromeFlags,
    '--output=json',
    '--output-path',
    outputPath,
    '--quiet',
  ];
  if (preset === 'desktop') args.push('--preset=desktop');

  const run = spawnSync('npx', args, {
    env: {
      ...process.env,
      // In WSL, Lighthouse may otherwise pick Windows Chrome and fail CDP attach.
      CHROME_PATH: chromePath,
    },
    encoding: 'utf8',
    timeout: 240000,
    maxBuffer: 8 * 1024 * 1024,
  });

  const errorLogPath = outputPath.replace(/\.json$/, '.error.log');
  if (run.status !== 0) {
    const errorPayload = [
      `command: npx ${args.join(' ')}`,
      `exitCode: ${run.status ?? 'null'}`,
      `signal: ${run.signal ?? 'none'}`,
      '',
      'stdout:',
      run.stdout ?? '',
      '',
      'stderr:',
      run.stderr ?? '',
    ].join('\n');
    return fs
      .writeFile(errorLogPath, errorPayload, 'utf8')
      .then(async () => {
        const fallback = {
          auditStatus: 'ERROR',
          command: `npx ${args.join(' ')}`,
          exitCode: run.status ?? null,
          signal: run.signal ?? null,
          stderr: run.stderr ?? '',
          stdout: run.stdout ?? '',
        };
        await fs.writeFile(outputPath, `${JSON.stringify(fallback, null, 2)}\n`, 'utf8');
        return { ok: false, note: `Lighthouse ${preset} failed` };
      });
  }

  return fs
    .readFile(outputPath, 'utf8')
    .then((raw) => JSON.parse(raw))
    .then((report) => {
      const score = Math.round((report?.categories?.performance?.score ?? 0) * 100);
      const lcpMs = report?.audits?.['largest-contentful-paint']?.numericValue;
      const cls = report?.audits?.['cumulative-layout-shift']?.numericValue;
      const inpMs =
        report?.audits?.['interaction-to-next-paint']?.numericValue ??
        report?.audits?.['max-potential-fid']?.numericValue;
      return { ok: true, score, lcpMs, cls, inpMs };
    })
    .catch(async (error) => {
      const fallback = {
        auditStatus: 'ERROR',
        message: `Unable to parse Lighthouse ${preset} JSON`,
        error: String(error),
      };
      await fs.writeFile(outputPath, `${JSON.stringify(fallback, null, 2)}\n`, 'utf8');
      return { ok: false, note: `Lighthouse ${preset} output parse failure` };
    });
}

async function buildPageAudit({
  slug,
  baseUrl,
  timeoutMs,
  sitemapPaths,
  chromePath,
  outputRoot,
  ignorePerf,
}) {
  const pageUrl = new URL(slug, baseUrl).href;
  const slugFolder = slugToFolder(slug);
  const pageOutputDir = path.join(outputRoot, slugFolder);
  await fs.mkdir(pageOutputDir, { recursive: true });

  const seoFailures = [];
  const seoWarnings = [];
  const notes = [];

  let responseStatus = 0;
  let html = '';
  try {
    const response = await fetchWithTimeout(pageUrl, timeoutMs);
    responseStatus = response.status;
    html = await response.text();
  } catch (error) {
    seoFailures.push(`Page request failed: ${String(error)}`);
  }

  let document = null;
  if (html) {
    document = new JSDOM(html, { url: pageUrl }).window.document;
  }

  const title = document?.querySelector('title')?.textContent?.trim() ?? '';
  const titleLength = title.length;
  const metaDescription =
    document?.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ?? '';
  const descriptionLength = metaDescription.length;

  const robotsValues = [
    ...((document &&
      [...document.querySelectorAll('meta[name="robots"],meta[name="googlebot"]')].map((node) =>
        normalizeText(node.getAttribute('content') ?? ''),
      )) ||
      []),
  ];
  const hasIndexFollow = robotsValues.some((entry) => entry.includes('index') && entry.includes('follow'));
  const hasNoIndex = robotsValues.some((entry) => entry.includes('noindex') || entry.includes('none'));
  const hasNoFollow = robotsValues.some((entry) => entry.includes('nofollow') || entry.includes('none'));

  const canonicalNodes = document ? [...document.querySelectorAll('link[rel="canonical"]')] : [];
  const canonicalHref = canonicalNodes[0]?.getAttribute('href')?.trim() ?? '';

  if (responseStatus !== 200) {
    seoFailures.push(`HTTP status ${responseStatus || 'unreachable'} for ${slug}`);
  }

  if (!hasIndexFollow) {
    seoFailures.push('Missing robots index,follow meta');
  }

  if (hasNoIndex || hasNoFollow) {
    seoFailures.push('Robots meta contains noindex/nofollow');
  }

  if (canonicalNodes.length !== 1) {
    seoFailures.push(`Canonical count is ${canonicalNodes.length}; expected exactly 1`);
  }

  let canonicalPath = '';
  try {
    const canonicalUrl = new URL(canonicalHref);
    canonicalPath = normalizeSlug(canonicalUrl.pathname);
    if (canonicalUrl.origin !== 'https://calchowmuch.com') {
      seoFailures.push(`Canonical domain mismatch: ${canonicalUrl.origin}`);
    }
  } catch {
    if (canonicalHref) {
      seoFailures.push('Canonical is not absolute URL');
    } else {
      seoFailures.push('Canonical missing');
    }
  }

  if (titleLength === 0) {
    seoFailures.push('Missing <title>');
  } else if (titleLength < 35 || titleLength > 61) {
    seoWarnings.push(`Title out of optimal snippet range (${titleLength}; target 35-61)`);
  }

  if (!metaDescription) {
    seoFailures.push('Missing meta description');
  } else if (descriptionLength < 110 || descriptionLength > 165) {
    seoWarnings.push(`Meta description out of optimal snippet range (${descriptionLength}; target 110-165)`);
  }

  const h1Nodes = document ? [...document.querySelectorAll('h1')] : [];
  const h1Text = h1Nodes[0]?.textContent?.trim() ?? '';
  if (h1Nodes.length !== 1) {
    seoFailures.push(`H1 count is ${h1Nodes.length}; expected exactly 1`);
  }
  if (h1Text && title && !h1KeywordCheck(h1Text, title)) {
    seoWarnings.push('H1 keyword alignment needs manual review');
  }

  if (!sitemapPaths.has(slug)) {
    seoFailures.push(`Slug missing from sitemap.xml: ${slug}`);
  }

  const isCalculator = Boolean(document && detectCalculatorPage(document));
  const explanationContainer =
    document?.querySelector('.explanation-pane,[id*="explanation"]') ?? null;
  const explanationTextLength = normalizeText(explanationContainer?.textContent ?? '').length;
  const calculatorUiRoot = document?.querySelector('.calculator-ui,[id^="calc-"],[id*="calc-"]');

  if (isCalculator) {
    if (!calculatorUiRoot) seoFailures.push('Calculator UI root not detected');
  }

  const jsonLdObjects = document ? readJsonLdObjects(document, pageUrl) : [];
  const jsonLdTypes = collectTypes(jsonLdObjects, []);
  const typeCount = jsonLdTypes.reduce((acc, type) => {
    acc[type] = (acc[type] ?? 0) + 1;
    return acc;
  }, {});

  let schemaStatus = 'N/A';
  let schemaSummary = {
    webPage: 'N/A',
    softwareApplication: 'N/A',
    faqPage: 'N/A',
    breadcrumbList: 'N/A',
    faqCount: 'N/A',
  };

  if (isCalculator) {
    schemaStatus = 'PASS';
    const schemaFailures = [];
    const requiredTypes = ['WebPage', 'SoftwareApplication', 'FAQPage', 'BreadcrumbList'];
    for (const type of requiredTypes) {
      if (!typeCount[type]) schemaFailures.push(`Missing JSON-LD ${type}`);
    }
    if ((typeCount.SoftwareApplication ?? 0) !== 1) {
      schemaFailures.push(`SoftwareApplication count is ${typeCount.SoftwareApplication ?? 0}; expected 1`);
    }

    const faqNode = extractFaqPage(jsonLdObjects);
    const faqEntries = Array.isArray(faqNode?.mainEntity) ? faqNode.mainEntity : [];
    if (faqEntries.length < 4 || faqEntries.length > 20) {
      schemaFailures.push(`FAQPage has ${faqEntries.length} entries; expected range 4-20`);
    }

    const visibleFaqQuestions = getVisibleFaqQuestions(document);
    const schemaFaqQuestions = faqEntries
      .map((entry) => normalizeText(entry?.name ?? '').replace(/\?$/, ''))
      .filter(Boolean);
    if (visibleFaqQuestions.length > 0) {
      const unmatched = visibleFaqQuestions.filter((question) => !schemaFaqQuestions.includes(question));
      if (unmatched.length > 0) {
        schemaFailures.push(`FAQ visible/schema mismatch (${unmatched.length} unmatched questions)`);
      }
    }

    if (schemaFailures.length) {
      schemaStatus = 'FAIL';
      seoFailures.push(...schemaFailures);
    }

    schemaSummary = {
      webPage: typeCount.WebPage ? 'PASS' : 'FAIL',
      softwareApplication:
        (typeCount.SoftwareApplication ?? 0) === 1
          ? 'PASS'
          : `FAIL (${typeCount.SoftwareApplication ?? 0})`,
      faqPage: typeCount.FAQPage ? 'PASS' : 'FAIL',
      breadcrumbList: typeCount.BreadcrumbList ? 'PASS' : 'FAIL',
      faqCount: String(faqEntries.length),
    };
  }

  const desktopJsonPath = path.join(pageOutputDir, 'lighthouse-desktop.json');
  const mobileJsonPath = path.join(pageOutputDir, 'lighthouse-mobile.json');

  let desktop;
  let mobile;
  if (ignorePerf) {
    const ignoredPayload = (preset) => ({
      auditStatus: 'IGNORED',
      reason: 'Performance audit ignored by run option',
      preset,
      url: pageUrl,
      timestamp: new Date().toISOString(),
    });
    await fs.writeFile(desktopJsonPath, `${JSON.stringify(ignoredPayload('desktop'), null, 2)}\n`, 'utf8');
    await fs.writeFile(mobileJsonPath, `${JSON.stringify(ignoredPayload('mobile'), null, 2)}\n`, 'utf8');
    desktop = { ok: false, ignored: true };
    mobile = { ok: false, ignored: true };
  } else {
    desktop = await runLighthouse({
      url: pageUrl,
      preset: 'desktop',
      chromePath,
      outputPath: desktopJsonPath,
      slugFolder,
    });
    mobile = await runLighthouse({
      url: pageUrl,
      preset: 'mobile',
      chromePath,
      outputPath: mobileJsonPath,
      slugFolder,
    });
  }

  const perfChecks = [];
  const perfMessages = [];
  const checkPerfRun = (label, run) => {
    if (!run.ok) {
      perfMessages.push(`${label} lighthouse unavailable`);
      return;
    }
    const runFailures = [];
    if (typeof run.score === 'number' && run.score < 80) {
      runFailures.push(`score ${run.score} < 80`);
    }
    if (typeof run.lcpMs === 'number' && run.lcpMs > 2500) {
      runFailures.push(`LCP ${formatSecondsFromMs(run.lcpMs)} > 2.50s`);
    }
    if (typeof run.cls === 'number' && run.cls > 0.1) {
      runFailures.push(`CLS ${formatNumber(run.cls, 3)} > 0.1`);
    }
    if (typeof run.inpMs === 'number' && run.inpMs > 200) {
      runFailures.push(`INP ${formatNumber(run.inpMs, 0)}ms > 200ms`);
    }
    if (runFailures.length > 0) {
      perfChecks.push(...runFailures.map((entry) => `${label} ${entry}`));
    }
  };
  checkPerfRun('Desktop', desktop);
  checkPerfRun('Mobile', mobile);

  let perfStatus = 'PASS';
  if (ignorePerf) {
    perfStatus = 'NA';
  } else {
    if (!desktop.ok || !mobile.ok) {
      perfStatus = 'WARN';
    }
    if (perfChecks.length > 0) {
      perfStatus = 'WARN';
    }
    if (perfMessages.length > 0) notes.push(...perfMessages);
    if (perfChecks.length > 0) notes.push(...perfChecks);
  }

  let seoStatus = 'PASS';
  if (seoFailures.length > 0) seoStatus = 'FAIL';
  else if (seoWarnings.length > 0) seoStatus = 'WARN';

  if (seoFailures.length > 0) notes.push(...seoFailures.slice(0, 4));
  if (seoWarnings.length > 0) notes.push(...seoWarnings.slice(0, 3));

  let serpRisk = 'LOW';
  if (seoStatus === 'FAIL') serpRisk = 'HIGH';
  else if (seoStatus === 'WARN' || perfStatus === 'WARN') serpRisk = 'MED';
  const serpVerdict = serpRisk === 'HIGH' ? 'BLOCK' : serpRisk === 'MED' ? 'WATCH' : 'SAFE';

  const perfScoreDisplay = ignorePerf
    ? 'IGNORED'
    : desktop.ok && mobile.ok
      ? `D:${desktop.score} / M:${mobile.score}`
      : 'N/A';
  return {
    category: inferCategory(slug),
    slug,
    pageUrl,
    responseStatus,
    seoStatus,
    perfStatus,
    perfScoreDisplay,
    schemaStatus,
    serpRisk,
    serpVerdict,
    notes,
    titleLength,
    descriptionLength,
    canonicalHref,
    canonicalPath,
    h1Count: h1Nodes.length,
    h1Text,
    hasIndexFollow,
    explanationDetected: Boolean(explanationContainer),
    explanationTextLength,
    isCalculator,
    schemaSummary,
    desktop,
    mobile,
    seoFailures,
    seoWarnings,
    ignorePerf,
  };
}

function buildAuditMarkdown({ baseUrl, timestampIso, slugsPath, results }) {
  const lines = [];
  lines.push('# SEO & Performance Audit Log');
  lines.push('');
  lines.push(`Environment (localhost base URL): ${baseUrl}`);
  lines.push('Audit Type: Pre-Deployment');
  lines.push('SERP Priority: P0');
  lines.push(`Timestamp (ISO): ${timestampIso}`);
  lines.push(`Slug List: ${slugsPath}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Master Audit Table');
  lines.push('');
  lines.push('| Category | Slug | SEO Status | Perf Score | Schema Status | SERP Risk | Notes |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- |');
  for (const result of results) {
    const note = result.notes.slice(0, 2).join('; ') || '—';
    lines.push(
      `| ${result.category} | ${result.slug} | ${result.seoStatus} | ${result.perfScoreDisplay} | ${result.schemaStatus} | ${result.serpRisk} | ${note} |`,
    );
  }
  lines.push('');
  lines.push('## Per-Page Details');
  lines.push('');

  for (const result of results) {
    lines.push(`## ${result.slug}`);
    lines.push('');
    lines.push(`URL: ${result.pageUrl}`);
    lines.push(`HTTP Status: ${result.responseStatus || 'UNREACHABLE'}`);
    lines.push('');
    lines.push('SEO');
    lines.push(`- H1: ${result.h1Count} (${result.h1Text || 'missing'})`);
    lines.push(`- Title length: ${result.titleLength || 0}`);
    lines.push(`- Meta description: ${result.descriptionLength || 0}`);
    lines.push(`- Canonical: ${result.canonicalHref || 'missing'}`);
    lines.push(
      `- Intent clarity: calculator=${result.isCalculator ? 'yes' : 'no'}, explanation=${result.explanationDetected ? 'yes' : 'no'} (len ${result.explanationTextLength})`,
    );
    lines.push(`- Robots index,follow: ${result.hasIndexFollow ? 'PASS' : 'FAIL'}`);
    if (result.canonicalPath) lines.push(`- Canonical path: ${result.canonicalPath}`);
    if (result.seoFailures.length > 0) {
      lines.push(`- SEO failures: ${result.seoFailures.join('; ')}`);
    }
    if (result.seoWarnings.length > 0) {
      lines.push(`- SEO warnings: ${result.seoWarnings.join('; ')}`);
    }
    lines.push('');
    lines.push('Schema');
    lines.push(`- WebPage: ${result.schemaSummary.webPage}`);
    lines.push(`- SoftwareApplication: ${result.schemaSummary.softwareApplication}`);
    lines.push(`- FAQPage: ${result.schemaSummary.faqPage}`);
    lines.push(`- BreadcrumbList: ${result.schemaSummary.breadcrumbList}`);
    lines.push(`- FAQ count: ${result.schemaSummary.faqCount}`);
    lines.push(`- Schema Status: ${result.schemaStatus}`);
    lines.push('');
    lines.push('Performance');
    if (result.ignorePerf) {
      lines.push('- Desktop: IGNORED');
      lines.push('- Mobile: IGNORED');
    } else {
      lines.push(
        `- Desktop: score ${result.desktop.ok ? result.desktop.score : 'N/A'}, LCP ${formatSecondsFromMs(result.desktop.lcpMs)}, CLS ${formatNumber(result.desktop.cls, 3)}, INP ${result.desktop.ok ? `${formatNumber(result.desktop.inpMs, 0)}ms` : 'N/A'}`,
      );
      lines.push(
        `- Mobile: score ${result.mobile.ok ? result.mobile.score : 'N/A'}, LCP ${formatSecondsFromMs(result.mobile.lcpMs)}, CLS ${formatNumber(result.mobile.cls, 3)}, INP ${result.mobile.ok ? `${formatNumber(result.mobile.inpMs, 0)}ms` : 'N/A'}`,
      );
    }
    lines.push(`- Perf Status: ${result.perfStatus}`);
    lines.push('');
    lines.push(`SERP Verdict: ${result.serpVerdict}`);
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const timestampIso = new Date().toISOString();
  const slugs = await loadSlugs(args.slugsPath);
  const chromePath = chromium.executablePath();
  const sitemapPaths = await loadSitemapPaths(args.baseUrl, args.timeoutMs);

  await fs.mkdir(args.outputDir, { recursive: true });
  const results = [];
  for (const slug of slugs) {
    // Serial execution keeps artifact ordering deterministic.
    const result = await buildPageAudit({
      slug,
      baseUrl: args.baseUrl,
      timeoutMs: args.timeoutMs,
      sitemapPaths,
      chromePath,
      outputRoot: args.outputDir,
      ignorePerf: args.ignorePerf,
    });
    results.push(result);
    const statusLine = `[audit] ${slug} -> SEO ${result.seoStatus}, PERF ${result.perfStatus}, SCHEMA ${result.schemaStatus}`;
    process.stdout.write(`${statusLine}\n`);
  }

  const markdown = buildAuditMarkdown({
    baseUrl: args.baseUrl,
    timestampIso,
    slugsPath: args.slugsPath,
    results,
  });
  await fs.writeFile(args.auditPath, markdown, 'utf8');

  const failCount = results.filter((entry) => entry.seoStatus === 'FAIL').length;
  const warnCount = results.filter((entry) => entry.seoStatus === 'WARN' || entry.perfStatus === 'WARN').length;
  process.stdout.write(
    `\nAudit complete: ${results.length} slugs, ${failCount} FAIL, ${warnCount} WARN. Audit log -> ${args.auditPath}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`${String(error)}\n`);
  process.exit(1);
});
