#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { JSDOM } from 'jsdom';
import { getCalculatorScope, getClusterScope } from './test-scope-resolver.mjs';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const OUTPUT_ROOT = path.join(ROOT, 'test-results', 'content-quality');

const APPLICABLE_ARCHETYPES = new Set(['calc_exp', 'exp_only']);
const DEFAULT_MODE = 'soft';
const DEFAULT_THRESHOLD = 70;
const IMPORTANT_NOTES_PRIVACY_TEXT = 'All calculations run locally in your browser - no data is stored.';
const MONTH_YEAR_REGEX =
  /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/i;
const IMPORTANT_NOTES_REQUIRED_KEYS = ['last updated', 'accuracy', 'assumptions', 'privacy'];

const STOP_WORDS = new Set([
  'a',
  'about',
  'all',
  'also',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'can',
  'for',
  'from',
  'has',
  'have',
  'how',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'of',
  'on',
  'or',
  'our',
  'that',
  'the',
  'their',
  'this',
  'to',
  'use',
  'using',
  'with',
  'you',
  'your',
  'calculator',
  'calculators',
  'calc',
  'calchowmuch',
  'guide',
  'notes',
  'section',
  'results',
]);

function fail(message) {
  throw new Error(message);
}

function readArgValue(argv, name) {
  const exact = argv.indexOf(name);
  if (exact >= 0 && argv[exact + 1]) {
    return argv[exact + 1];
  }
  const prefix = `${name}=`;
  const token = argv.find((entry) => entry.startsWith(prefix));
  return token ? token.slice(prefix.length) : null;
}

function hasFlag(argv, name) {
  return argv.includes(name);
}

export function normalizeScopeMode(rawScope) {
  const value = String(rawScope || 'full')
    .trim()
    .toLowerCase();

  if (['full', 'full-repo', 'repo'].includes(value)) return 'full';
  if (['cluster', 'full-cluster'].includes(value)) return 'cluster';
  if (['calc', 'single-calculator', 'single_calc'].includes(value)) return 'calc';
  if (['route', 'single-route', 'single_route'].includes(value)) return 'route';

  throw new Error(
    `Invalid --scope value "${rawScope}". Use full|cluster|calc|route (or aliases full-repo|single-calculator).`
  );
}

export function normalizeMode(rawMode) {
  const value = String(rawMode || DEFAULT_MODE)
    .trim()
    .toLowerCase();
  if (value === 'soft' || value === 'hard') {
    return value;
  }
  throw new Error(`Invalid mode "${rawMode}". Use soft|hard.`);
}

export function normalizeRoutePath(rawRoute) {
  if (!rawRoute || typeof rawRoute !== 'string') return null;
  let route = rawRoute.trim();
  if (!route) return null;
  if (!route.startsWith('/')) route = `/${route}`;
  route = route.replace(/\/+/g, '/');
  if (route !== '/' && !route.endsWith('/')) route = `${route}/`;
  return route;
}

function routeToPublicIndexPath(routePath) {
  const normalized = normalizeRoutePath(routePath);
  if (!normalized) return null;
  if (normalized === '/') {
    return path.join(PUBLIC_DIR, 'index.html');
  }
  const withoutOuterSlashes = normalized.replace(/^\/|\/$/g, '');
  return path.join(PUBLIC_DIR, withoutOuterSlashes, 'index.html');
}

function publicPathToRoute(filePath) {
  const rel = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  const withoutIndex = rel.replace(/\/index\.html$/i, '');
  return normalizeRoutePath(`/${withoutIndex}/`);
}

function walkIndexHtmlFiles(dirPath, out = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkIndexHtmlFiles(fullPath, out);
    } else if (entry.isFile() && entry.name === 'index.html') {
      out.push(fullPath);
    }
  });
  return out;
}

function parseThreshold(rawThreshold) {
  if (rawThreshold == null || rawThreshold === '') {
    return DEFAULT_THRESHOLD;
  }
  const parsed = Number.parseInt(String(rawThreshold), 10);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
    throw new Error(`Invalid threshold "${rawThreshold}". Use integer 0-100.`);
  }
  return parsed;
}

export function parseCliArgs(argv = process.argv.slice(2), env = process.env) {
  const scope = normalizeScopeMode(readArgValue(argv, '--scope') ?? 'full');
  const route = normalizeRoutePath(readArgValue(argv, '--route') ?? env.TARGET_ROUTE ?? null);
  const mode = normalizeMode(readArgValue(argv, '--mode') ?? env.THIN_CONTENT_MODE ?? DEFAULT_MODE);
  const threshold = parseThreshold(readArgValue(argv, '--threshold') ?? env.THIN_CONTENT_THRESHOLD);

  return {
    scope,
    route,
    mode,
    threshold,
    dryRun: hasFlag(argv, '--dry-run'),
  };
}

export function resolveScopeFiles({ scope, route, env = process.env } = {}) {
  if (!scope) fail('Scope is required to resolve files.');

  if (scope === 'full') {
    return walkIndexHtmlFiles(PUBLIC_DIR).sort();
  }

  if (scope === 'cluster') {
    const clusterId = String(env.CLUSTER || '').trim();
    if (!clusterId) {
      throw new Error('CLUSTER is required for --scope=cluster.');
    }

    const clusterScope = getClusterScope(clusterId);
    const routes = Array.isArray(clusterScope.routes) ? clusterScope.routes : [];
    if (!routes.length) {
      throw new Error(`No routes found for CLUSTER="${clusterId}" in scope map.`);
    }

    const files = [...new Set(routes.map(routeToPublicIndexPath).filter(Boolean))];
    const missing = files.filter((filePath) => !fs.existsSync(filePath));
    if (missing.length) {
      throw new Error(
        `Missing generated HTML for CLUSTER="${clusterId}": ${missing
          .map((entry) => path.relative(ROOT, entry))
          .join(', ')}`
      );
    }

    return files.sort();
  }

  if (scope === 'calc') {
    const clusterId = String(env.CLUSTER || '').trim();
    const calcId = String(env.CALC || '').trim();
    if (!clusterId) {
      throw new Error('CLUSTER is required for --scope=calc.');
    }
    if (!calcId) {
      throw new Error('CALC is required for --scope=calc.');
    }

    const calcScope = getCalculatorScope(clusterId, calcId);
    const calcRoute = normalizeRoutePath(calcScope.calculator?.route);
    if (!calcRoute) {
      throw new Error(`Missing route in scope map for CLUSTER="${clusterId}" CALC="${calcId}".`);
    }

    const filePath = routeToPublicIndexPath(calcRoute);
    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error(
        `Missing generated HTML for CLUSTER="${clusterId}" CALC="${calcId}" (${calcRoute}).`
      );
    }

    return [filePath];
  }

  if (scope === 'route') {
    const normalizedRoute = normalizeRoutePath(route);
    if (!normalizedRoute) {
      throw new Error('--route is required for --scope=route.');
    }

    const filePath = routeToPublicIndexPath(normalizedRoute);
    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error(`Missing generated HTML for route ${normalizedRoute}.`);
    }

    return [filePath];
  }

  throw new Error(`Unsupported scope "${scope}".`);
}

function normalizeText(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeHeading(text) {
  return normalizeText(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

function countWords(text) {
  const normalized = normalizeText(text);
  if (!normalized) return 0;
  return normalized.split(' ').filter(Boolean).length;
}

function extractCandidateExplanationRoots(document) {
  const selectors = [
    '.explanation-pane > [id*="explanation"]',
    '.explanation-pane [id*="explanation"]',
    '[data-page="calculator"] [id$="-explanation"]',
    '[data-page="calculator"] [id*="-explanation"]',
    '.explanation-pane',
  ];

  const seen = new Set();
  const candidates = [];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      if (!(node instanceof document.defaultView.HTMLElement)) return;
      const key = `${node.tagName}:${node.id || ''}:${node.className || ''}`;
      if (seen.has(key)) return;
      seen.add(key);
      const text = normalizeText(node.textContent);
      const wordCount = countWords(text);
      if (wordCount >= 20) {
        candidates.push({ node, wordCount });
      }
    });
  });

  return candidates;
}

function pickExplanationRoot(document) {
  const candidates = extractCandidateExplanationRoots(document);
  if (!candidates.length) {
    const mathFlow = document.querySelector('.calculator-page-single.math-cluster-flow');
    if (mathFlow instanceof document.defaultView.HTMLElement) {
      return mathFlow;
    }
    return null;
  }
  candidates.sort((a, b) => b.wordCount - a.wordCount);
  return candidates[0].node;
}

function headingMatchesHowTo(text) {
  return text.includes('how to guide') || text.includes('howto guide');
}

function headingMatchesImportant(text) {
  return text.includes('important notes');
}

function headingMatchesFaq(text) {
  return text === 'faq' || text.includes('frequently asked questions') || text.includes(' faq');
}

function headingMatchesIntent(text) {
  if (!text) return false;
  if (headingMatchesHowTo(text) || headingMatchesImportant(text) || headingMatchesFaq(text)) {
    return false;
  }
  return /(guide|calculator|mortgage|loan|interest|investment|savings|payment|repayment|credit|sleep|time|percentage|value)/.test(
    text
  );
}

export function validateRequiredBlockOrder(headingTexts = []) {
  const normalizedHeadings = headingTexts.map((entry) => normalizeHeading(entry));
  const howToIndex = normalizedHeadings.findIndex((entry) => headingMatchesHowTo(entry));
  const importantNotesIndex = normalizedHeadings.findIndex((entry) => headingMatchesImportant(entry));
  const faqIndex = normalizedHeadings.findIndex((entry) => headingMatchesFaq(entry));
  const headingCount = normalizedHeadings.length;

  return {
    howToIndex,
    importantNotesIndex,
    faqIndex,
    headingCount,
    isValid:
      howToIndex >= 0 &&
      importantNotesIndex >= 0 &&
      faqIndex >= 0 &&
      howToIndex < faqIndex &&
      faqIndex < importantNotesIndex &&
      importantNotesIndex === headingCount - 1,
  };
}

function analyzeImportantNotesContract(explanationRoot) {
  const fallback = {
    hasHeading: false,
    hasRequiredKeys: false,
    missingFixedKeys: [...IMPORTANT_NOTES_REQUIRED_KEYS],
    hasDisclaimerKey: false,
    hasPrivacyExactText: false,
    hasLastUpdatedMonthYear: false,
  };
  if (!explanationRoot) return fallback;

  const headingNodes = [...explanationRoot.querySelectorAll('h2,h3,h4')];
  const notesHeadingNode = headingNodes.find((node) =>
    headingMatchesImportant(normalizeHeading(node.textContent))
  );
  if (!notesHeadingNode) return fallback;

  const sectionNodes = [];
  let cursor = notesHeadingNode.nextElementSibling;
  while (cursor) {
    if (/^H[2-4]$/i.test(cursor.tagName)) break;
    sectionNodes.push(cursor);
    cursor = cursor.nextElementSibling;
  }

  const sourceNodes = sectionNodes.length ? sectionNodes : [notesHeadingNode.parentElement || notesHeadingNode];
  const sectionText = normalizeText(sourceNodes.map((node) => node.textContent || '').join(' '));
  const hasFixedKey = (key) => new RegExp(`\\b${key}\\s*:`, 'i').test(sectionText);
  const missingFixedKeys = IMPORTANT_NOTES_REQUIRED_KEYS.filter((key) => !hasFixedKey(key));
  const hasDisclaimerKey = /\b[a-z ]*disclaimer\s*:/i.test(sectionText);
  const hasPrivacyExactText = sectionText.includes(IMPORTANT_NOTES_PRIVACY_TEXT);
  const hasLastUpdatedMonthYear = /\bLast updated:\s*/i.test(sectionText) && MONTH_YEAR_REGEX.test(sectionText);

  return {
    hasHeading: true,
    hasRequiredKeys: missingFixedKeys.length === 0,
    missingFixedKeys,
    hasDisclaimerKey,
    hasPrivacyExactText,
    hasLastUpdatedMonthYear,
  };
}

function tokenizeForSimilarity(text) {
  return new Set(
    normalizeText(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((token) => token && token.length >= 3 && !STOP_WORDS.has(token))
  );
}

function jaccardSimilarity(setA, setB) {
  if (!setA.size || !setB.size) return 0;
  const [smaller, larger] = setA.size <= setB.size ? [setA, setB] : [setB, setA];
  let overlap = 0;
  smaller.forEach((token) => {
    if (larger.has(token)) overlap += 1;
  });
  const unionSize = setA.size + setB.size - overlap;
  return unionSize > 0 ? overlap / unionSize : 0;
}

function getRouteTokens(route) {
  return normalizeRoutePath(route)
    .replace(/^\/|\/$/g, '')
    .split(/[\/-]/)
    .map((token) => token.toLowerCase())
    .filter(
      (token) =>
        token &&
        token.length >= 3 &&
        !STOP_WORDS.has(token) &&
        !['loan', 'loans', 'home', 'time', 'date', 'math', 'finance', 'credit', 'card', 'cards'].includes(
          token
        )
    );
}

function matchCount(text, patterns) {
  const normalized = normalizeText(text).toLowerCase();
  return patterns.reduce((count, pattern) => (pattern.test(normalized) ? count + 1 : count), 0);
}

function collectFaqQuestions(root) {
  if (!root) return [];
  const faqSectionRoots = [...root.querySelectorAll('section, article, div')].filter((node) => {
    const firstHeading = node.querySelector('h2,h3,h4');
    return firstHeading && headingMatchesFaq(normalizeHeading(firstHeading.textContent));
  });
  const candidates = [
    ...root.querySelectorAll('section[id*="faq"] h4'),
    ...root.querySelectorAll('section[id*="faq"] h3'),
    ...root.querySelectorAll('section[id*="faq"] strong'),
    ...root.querySelectorAll('section[id*="faq"] summary'),
    ...root.querySelectorAll('.bor-faq-card h4'),
    ...root.querySelectorAll('.faq-box strong'),
    ...root.querySelectorAll('.faq-card h4'),
    ...root.querySelectorAll('.faq-card strong'),
    ...faqSectionRoots.flatMap((node) => [
      ...node.querySelectorAll('h3'),
      ...node.querySelectorAll('h4'),
      ...node.querySelectorAll('strong'),
      ...node.querySelectorAll('summary'),
    ]),
  ];

  const unique = new Set();
  candidates.forEach((node) => {
    const text = normalizeText(node.textContent).replace(/\?$/, '');
    if (text && !headingMatchesFaq(normalizeHeading(text))) {
      unique.add(text);
    }
  });

  return [...unique];
}

function scoreA1Purpose({ hasIntentHeading, wordCount, routeTokenHits }) {
  if (hasIntentHeading && wordCount >= 100 && routeTokenHits >= 1) return 10;
  if (hasIntentHeading && wordCount >= 80) return 7;
  if (wordCount >= 60) return 4;
  return 0;
}

function scoreA2Interpretation(matchHits) {
  if (matchHits >= 4) return 10;
  if (matchHits >= 2) return 7;
  if (matchHits >= 1) return 3;
  return 0;
}

function scoreA3WorkedExample({ hasWorkedExample, numericMentions }) {
  if (hasWorkedExample && numericMentions >= 3) return 10;
  if (hasWorkedExample) return 6;
  return 0;
}

function scoreA4Assumptions({ hasImportantNotesHeading, assumptionHits }) {
  if (hasImportantNotesHeading && assumptionHits >= 2) return 10;
  if (hasImportantNotesHeading || assumptionHits >= 1) return 6;
  return 0;
}

function scoreB1Faq({ faqCount, faqBoilerplate }) {
  if (faqCount >= 8 && !faqBoilerplate) return 10;
  if (faqCount >= 5) return 7;
  if (faqCount > 0) return 4;
  return 0;
}

function scoreB2Tips(tipHits) {
  if (tipHits >= 4) return 10;
  if (tipHits >= 2) return 6;
  if (tipHits >= 1) return 2;
  return 0;
}

function scoreB3Edge(edgeHits) {
  if (edgeHits >= 2) return 5;
  if (edgeHits >= 1) return 3;
  return 0;
}

function scoreC1Uniqueness(maxSimilarity) {
  if (maxSimilarity <= 0.45) return 10;
  if (maxSimilarity <= 0.6) return 6;
  if (maxSimilarity <= 0.8) return 2;
  return 0;
}

function scoreC2Specificity(routeTokenHits) {
  if (routeTokenHits >= 2) return 5;
  if (routeTokenHits >= 1) return 3;
  return 0;
}

function scoreD1Tone(hypeHits) {
  if (hypeHits === 0) return 5;
  if (hypeHits === 1) return 3;
  return 0;
}

function scoreD2Transparency(transparencyHits) {
  if (transparencyHits >= 2) return 5;
  if (transparencyHits >= 1) return 3;
  return 0;
}

function scoreE1Readability({ headingCount, avgParagraphWords }) {
  if (headingCount >= 4 && avgParagraphWords <= 90) return 5;
  if (headingCount >= 2) return 3;
  return 0;
}

function scoreE2Sufficiency(wordCount) {
  if (wordCount >= 300 && wordCount <= 1800) return 5;
  if ((wordCount >= 250 && wordCount < 300) || wordCount > 1800) return 3;
  return 0;
}

export function gradeForScore(score) {
  if (score >= 85) return 'Strong';
  if (score >= 70) return 'Acceptable';
  if (score >= 50) return 'Weak';
  return 'High Risk Thin';
}

export function resolveQualityStatus({ mode, threshold, score, hardFlagsCount }) {
  if (mode === 'hard') {
    return score < threshold || hardFlagsCount > 0 ? 'fail' : 'pass';
  }
  return score < threshold || hardFlagsCount > 0 ? 'warn' : 'pass';
}

export function analyzeHtmlDocument({ html, route, filePath }) {
  const dom = new JSDOM(html, { url: 'https://calchowmuch.com/' });
  const { document } = dom.window;
  const body = document.querySelector('body');
  const archetype = String(body?.getAttribute('data-route-archetype') || '').trim();
  const applicable = APPLICABLE_ARCHETYPES.has(archetype);
  const explanationRoot = pickExplanationRoot(document);
  const explanationText = normalizeText(explanationRoot?.textContent || '');
  const wordCount = countWords(explanationText);

  const headingTexts = explanationRoot
    ? [...explanationRoot.querySelectorAll('h2,h3,h4')].map((node) => normalizeText(node.textContent))
    : [];
  const normalizedHeadings = headingTexts.map((entry) => normalizeHeading(entry));
  const headingCount = headingTexts.length;
  const headingOrder = validateRequiredBlockOrder(headingTexts);
  const hasIntentHeading = normalizedHeadings.some((heading) => headingMatchesIntent(heading));
  const hasImportantNotesHeading = normalizedHeadings.some((heading) => headingMatchesImportant(heading));
  const importantNotesContract = analyzeImportantNotesContract(explanationRoot);

  const paragraphNodes = explanationRoot ? [...explanationRoot.querySelectorAll('p,li')] : [];
  const paragraphWordCounts = paragraphNodes
    .map((node) => countWords(node.textContent))
    .filter((count) => count > 0);
  const avgParagraphWords = paragraphWordCounts.length
    ? paragraphWordCounts.reduce((sum, count) => sum + count, 0) / paragraphWordCounts.length
    : 0;

  const faqQuestions = collectFaqQuestions(explanationRoot);
  const faqCount = faqQuestions.length;
  const faqQuestionWordCounts = faqQuestions.map((question) => countWords(question));
  const faqAverageWords = faqQuestionWordCounts.length
    ? faqQuestionWordCounts.reduce((sum, count) => sum + count, 0) / faqQuestionWordCounts.length
    : 0;
  const faqUniqueTokens = new Set(
    faqQuestions
      .join(' ')
      .toLowerCase()
      .replace(/[^a-z0-9\\s]/g, ' ')
      .split(/\\s+/)
      .filter((token) => token && token.length >= 3 && !STOP_WORDS.has(token))
  );

  const routeTokens = getRouteTokens(route || publicPathToRoute(filePath));
  const routeTokenHits = routeTokens.filter((token) => explanationText.toLowerCase().includes(token)).length;
  const faqSpecificCount = faqQuestions.filter((question) => {
    const normalized = question.toLowerCase();
    return routeTokens.some((token) => normalized.includes(token));
  }).length;
  const faqBoilerplate =
    faqCount >= 6 &&
    faqSpecificCount / Math.max(faqCount, 1) < 0.25 &&
    faqAverageWords < 5 &&
    faqUniqueTokens.size < faqCount * 2;

  const interpretationHits = matchCount(explanationText, [
    /what this result means/i,
    /result means/i,
    /monthly payment/i,
    /total interest/i,
    /months saved/i,
    /payoff/i,
    /trade\s*-?off/i,
    /compare/i,
    /scenario/i,
    /interpret/i,
  ]);

  const hasWorkedExample =
    /worked example/i.test(explanationText) ||
    /example scenario/i.test(explanationText) ||
    normalizedHeadings.some((heading) => heading.includes('example'));
  const numericMentions = (explanationText.match(/\b\d+(?:[.,]\d+)?\b/g) || []).length;

  const assumptionHits = matchCount(explanationText, [
    /assumption/i,
    /estimate/i,
    /accuracy/i,
    /not financial advice/i,
    /educational purposes/i,
    /disclaimer/i,
    /constant interest/i,
  ]);

  const tipHits = matchCount(explanationText, [
    /compare/i,
    /consider/i,
    /strategy/i,
    /should/i,
    /overpayment/i,
    /reduce/i,
    /save/i,
    /stress-test/i,
  ]);

  const edgeHits = matchCount(explanationText, [
    /zero/i,
    /extreme/i,
    /minimum/i,
    /maximum/i,
    /miss(?:ed)? payments?/i,
    /variable rate/i,
    /early repayment/i,
    /lump sum/i,
  ]);

  const hypeHits = matchCount(explanationText, [
    /guaranteed/i,
    /best ever/i,
    /dominate/i,
    /instant riches/i,
    /life changing/i,
  ]);

  const transparencyHits = matchCount(explanationText, [
    /estimate/i,
    /assumption/i,
    /not financial advice/i,
    /educational purposes/i,
    /for informational purposes/i,
    /accuracy/i,
  ]);

  return {
    route: normalizeRoutePath(route || publicPathToRoute(filePath)),
    filePath,
    archetype,
    applicable,
    explanationText,
    wordCount,
    headingTexts,
    headingCount,
    headingOrder,
    hasIntentHeading,
    hasImportantNotesHeading,
    avgParagraphWords,
    faqCount,
    faqQuestions,
    faqAverageWords,
    faqBoilerplate,
    routeTokenHits,
    interpretationHits,
    hasWorkedExample,
    numericMentions,
    assumptionHits,
    tipHits,
    edgeHits,
    hypeHits,
    transparencyHits,
    importantNotesContract,
    tokenSet: tokenizeForSimilarity(explanationText),
  };
}

export function scoreAnalyzedPage(analyzed, maxSimilarity) {
  const a1 = scoreA1Purpose(analyzed);
  const a2 = scoreA2Interpretation(analyzed.interpretationHits);
  const a3 = scoreA3WorkedExample(analyzed);
  const a4 = scoreA4Assumptions(analyzed);

  const b1 = scoreB1Faq(analyzed);
  const b2 = scoreB2Tips(analyzed.tipHits);
  const b3 = scoreB3Edge(analyzed.edgeHits);

  const c1 = scoreC1Uniqueness(maxSimilarity);
  const c2 = scoreC2Specificity(analyzed.routeTokenHits);

  const d1 = scoreD1Tone(analyzed.hypeHits);
  const d2 = scoreD2Transparency(analyzed.transparencyHits);

  const e1 = scoreE1Readability(analyzed);
  const e2 = scoreE2Sufficiency(analyzed.wordCount);

  const coreValue = a1 + a2 + a3 + a4;
  const depth = b1 + b2 + b3;
  const uniqueness = c1 + c2;
  const trust = d1 + d2;
  const structure = e1 + e2;
  const score = coreValue + depth + uniqueness + trust + structure;

  const flags = [];
  const hardFlags = [];
  if (!analyzed.headingOrder.isValid) {
    const orderMessage =
      'Required explanation block order is not `How to Guide -> FAQ -> Important Notes` with `Important Notes` as the last section.';
    flags.push(orderMessage);
    hardFlags.push(orderMessage);
  }
  if (b1 <= 7) {
    flags.push('FAQ quality can be improved with more calculator-specific questions.');
  }
  if (b3 < 5) {
    flags.push('Edge-case coverage appears partial.');
  }
  if (maxSimilarity > 0.6) {
    flags.push(`Content overlap risk detected (max similarity ${(maxSimilarity * 100).toFixed(1)}%).`);
  }

  const notes = analyzed.importantNotesContract;
  if (!notes.hasHeading) {
    const message = 'Important Notes heading is missing.';
    flags.push(message);
    hardFlags.push(message);
  } else {
    if (!notes.hasRequiredKeys) {
      const message = `Important Notes missing required keys: ${notes.missingFixedKeys.join(', ')}.`;
      flags.push(message);
      hardFlags.push(message);
    }
    if (!notes.hasDisclaimerKey) {
      const message = 'Important Notes is missing a calculator-relevant disclaimer key.';
      flags.push(message);
      hardFlags.push(message);
    }
    if (!notes.hasPrivacyExactText) {
      const message =
        'Important Notes privacy line must exactly match: `All calculations run locally in your browser - no data is stored.`';
      flags.push(message);
      hardFlags.push(message);
    }
    if (!notes.hasLastUpdatedMonthYear) {
      const message = 'Important Notes last-updated line must use `Last updated: <Month YYYY>` format.';
      flags.push(message);
      hardFlags.push(message);
    }
  }

  if (a2 === 0) hardFlags.push('No result interpretation guidance detected.');
  if (a3 === 0) hardFlags.push('No worked example detected.');
  if (analyzed.wordCount < 150) hardFlags.push('Explanation content below 150 words.');
  if (maxSimilarity > 0.8) hardFlags.push('Content similarity above 80%.');
  if (analyzed.faqBoilerplate) hardFlags.push('FAQ appears boilerplate/generic for this route.');
  if (analyzed.wordCount < 220 && analyzed.headingCount < 3) {
    hardFlags.push('Page appears tool-only with minimal explanatory context.');
  }

  return {
    score,
    grade: gradeForScore(score),
    sectionScores: {
      coreValue,
      depth,
      uniqueness,
      trust,
      structure,
    },
    flags,
    hardFlags,
  };
}

function buildCorpusIndex() {
  const files = walkIndexHtmlFiles(PUBLIC_DIR);
  const index = new Map();

  files.forEach((filePath) => {
    const route = publicPathToRoute(filePath);
    const html = fs.readFileSync(filePath, 'utf8');
    const analyzed = analyzeHtmlDocument({ html, route, filePath });
    if (!analyzed.applicable || analyzed.tokenSet.size === 0) {
      return;
    }
    index.set(route, analyzed.tokenSet);
  });

  return index;
}

function computeMaxSimilarity(route, tokenSet, corpusIndex) {
  if (!tokenSet.size) return 0;
  let maxSimilarity = 0;

  corpusIndex.forEach((comparisonSet, comparisonRoute) => {
    if (comparisonRoute === route) return;
    const similarity = jaccardSimilarity(tokenSet, comparisonSet);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
    }
  });

  return maxSimilarity;
}

function resolveOutputPath({ scope, env, route }) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');

  if (scope === 'calc') {
    const clusterId = String(env.CLUSTER || '').trim();
    const calcId = String(env.CALC || '').trim();
    if (!clusterId || !calcId) {
      fail('CLUSTER and CALC are required to write scoped calc artifact.');
    }
    return path.join(OUTPUT_ROOT, 'scoped', clusterId, `${calcId}.json`);
  }

  if (scope === 'cluster') {
    const clusterId = String(env.CLUSTER || '').trim();
    return path.join(OUTPUT_ROOT, 'cluster', clusterId || 'unknown', `${stamp}.json`);
  }

  if (scope === 'route') {
    const normalizedRoute = normalizeRoutePath(route) || '/unknown/';
    const safeRoute = normalizedRoute.replace(/^\/|\/$/g, '').replace(/\//g, '__') || '__root__';
    return path.join(OUTPUT_ROOT, 'route', safeRoute, `${stamp}.json`);
  }

  return path.join(OUTPUT_ROOT, 'full', `${stamp}.json`);
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function summarize(results) {
  const summary = {
    totalRoutes: results.length,
    evaluatedRoutes: 0,
    pass: 0,
    warn: 0,
    fail: 0,
    notApplicable: 0,
    avgScore: null,
  };

  let scoreTotal = 0;

  results.forEach((result) => {
    if (result.status === 'not_applicable') {
      summary.notApplicable += 1;
      return;
    }

    summary.evaluatedRoutes += 1;
    if (typeof result.score === 'number') {
      scoreTotal += result.score;
    }

    if (result.status === 'pass') summary.pass += 1;
    if (result.status === 'warn') summary.warn += 1;
    if (result.status === 'fail') summary.fail += 1;
  });

  if (summary.evaluatedRoutes > 0) {
    summary.avgScore = Number((scoreTotal / summary.evaluatedRoutes).toFixed(2));
  }

  summary.overallStatus = summary.fail > 0 ? 'fail' : summary.warn > 0 ? 'warn' : 'pass';
  return summary;
}

function evaluateScope({ files, mode, threshold, env }) {
  const corpusIndex = buildCorpusIndex();

  const results = files.map((filePath) => {
    const route = publicPathToRoute(filePath);
    const html = fs.readFileSync(filePath, 'utf8');
    const analyzed = analyzeHtmlDocument({ html, route, filePath });

    if (!analyzed.applicable) {
      return {
        route: analyzed.route,
        filePath: path.relative(ROOT, filePath),
        archetype: analyzed.archetype,
        mode,
        threshold,
        status: 'not_applicable',
        score: null,
        grade: null,
        sectionScores: null,
        flags: ['Thin-content scoring applies only to calc_exp and exp_only routes.'],
        hardFlags: [],
        maxSimilarity: null,
        wordCount: analyzed.wordCount,
      };
    }

    const maxSimilarity = computeMaxSimilarity(analyzed.route, analyzed.tokenSet, corpusIndex);
    const scoring = scoreAnalyzedPage(analyzed, maxSimilarity);
    const status = resolveQualityStatus({
      mode,
      threshold,
      score: scoring.score,
      hardFlagsCount: scoring.hardFlags.length,
    });

    return {
      route: analyzed.route,
      filePath: path.relative(ROOT, filePath),
      archetype: analyzed.archetype,
      mode,
      threshold,
      status,
      score: scoring.score,
      grade: scoring.grade,
      sectionScores: scoring.sectionScores,
      flags: scoring.flags,
      hardFlags: scoring.hardFlags,
      maxSimilarity: Number((maxSimilarity * 100).toFixed(2)),
      wordCount: analyzed.wordCount,
      headingOrder: analyzed.headingOrder,
      importantNotesContract: analyzed.importantNotesContract,
      faqCount: analyzed.faqCount,
    };
  });

  const summary = summarize(results);
  return {
    scope: {
      scope: env.SCOPE_OVERRIDE || null,
      requestedScope: null,
      cluster: env.CLUSTER || null,
      calc: env.CALC || null,
      route: normalizeRoutePath(env.TARGET_ROUTE || '') || null,
    },
    mode,
    threshold,
    generatedAt: new Date().toISOString(),
    results,
    summary,
  };
}

function attachScopeMetadata(payload, cli) {
  payload.scope.scope = cli.scope;
  payload.scope.requestedScope = cli.scope;
  if (cli.scope === 'route') {
    payload.scope.route = cli.route;
  }
  return payload;
}

function main() {
  const cli = parseCliArgs(process.argv.slice(2), process.env);
  const files = resolveScopeFiles({
    scope: cli.scope,
    route: cli.route,
    env: process.env,
  });

  const payload = attachScopeMetadata(
    evaluateScope({
      files,
      mode: cli.mode,
      threshold: cli.threshold,
      env: process.env,
    }),
    cli
  );

  const outputPath = resolveOutputPath({
    scope: cli.scope,
    env: process.env,
    route: cli.route,
  });
  ensureDirForFile(outputPath);
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(`Thin-content quality artifact: ${path.relative(ROOT, outputPath)}`);
  console.log(
    `Thin-content summary: evaluated=${payload.summary.evaluatedRoutes}, pass=${payload.summary.pass}, warn=${payload.summary.warn}, fail=${payload.summary.fail}, notApplicable=${payload.summary.notApplicable}`
  );

  if (cli.dryRun) {
    return;
  }

  if (cli.mode === 'hard' && payload.summary.fail > 0) {
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  try {
    main();
  } catch (error) {
    console.error(error.message || String(error));
    process.exit(1);
  }
}
