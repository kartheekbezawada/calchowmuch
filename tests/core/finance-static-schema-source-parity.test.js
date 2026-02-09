import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';

const REPO_ROOT = process.cwd();
const FINANCE_PUBLIC_DIR = path.join(REPO_ROOT, 'public', 'finance');
const FINANCE_MODULES_DIR = path.join(REPO_ROOT, 'public', 'calculators', 'finance');

function normalizeText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^Q:\s*/i, '')
    .replace(/^A:\s*/i, '');
}

function flattenSchemaNodes(parsedJsonLd) {
  if (Array.isArray(parsedJsonLd)) {
    return parsedJsonLd.flatMap((item) => flattenSchemaNodes(item));
  }
  if (!parsedJsonLd || typeof parsedJsonLd !== 'object') {
    return [];
  }
  if (Array.isArray(parsedJsonLd['@graph'])) {
    return parsedJsonLd['@graph'].filter((node) => node && typeof node === 'object');
  }
  return [parsedJsonLd];
}

function parseHeadJsonLdNodes(document) {
  const scripts = Array.from(document.head.querySelectorAll('script[type="application/ld+json"]'));
  const nodes = [];
  scripts.forEach((script) => {
    const raw = script.textContent || '';
    if (!raw.trim()) {
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      nodes.push(...flattenSchemaNodes(parsed));
    } catch {
      // Keep this suite strict and source-level: invalid JSON-LD is treated as missing.
    }
  });
  return nodes;
}

function schemaNodesOfType(nodes, type) {
  return nodes.filter((node) => node?.['@type'] === type);
}

function extractVisibleFaqPairs(document) {
  const faqBoxes = Array.from(document.querySelectorAll('.faq-box'));
  return faqBoxes
    .map((box) => {
      const questionNode = box.querySelector('strong');
      const answerNode = box.querySelector('.faq-answer');
      if (!questionNode || !answerNode) {
        return null;
      }
      return {
        question: normalizeText(questionNode.textContent),
        answer: normalizeText(answerNode.textContent),
      };
    })
    .filter(Boolean);
}

function extractFaqPairsFromSchema(faqNode) {
  const entities = Array.isArray(faqNode?.mainEntity) ? faqNode.mainEntity : [];
  return entities
    .map((entity) => {
      const acceptedAnswer = entity?.acceptedAnswer;
      return {
        question: normalizeText(entity?.name),
        answer: normalizeText(acceptedAnswer?.text),
      };
    })
    .filter((pair) => pair.question && pair.answer);
}

function hasSchemaTypeInModule(moduleSource, type) {
  const escaped = type.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`['"]@type['"]\\s*:\\s*['"]${escaped}['"]`, 'm').test(moduleSource);
}

function moduleContainsFaqSchema(moduleSource) {
  return hasSchemaTypeInModule(moduleSource, 'FAQPage') && /mainEntity/.test(moduleSource);
}

function getFinanceSlugs() {
  if (!fs.existsSync(FINANCE_PUBLIC_DIR)) {
    return [];
  }
  return fs
    .readdirSync(FINANCE_PUBLIC_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => fs.existsSync(path.join(FINANCE_PUBLIC_DIR, slug, 'index.html')))
    .sort();
}

describe('Finance static schema source parity guard (SEO-FAQ-SCHEMA-002)', () => {
  it('enforces static head schema + robots + JS FAQ parity + visible FAQ parity for /finance/*', () => {
    const slugs = getFinanceSlugs();
    expect(slugs.length).toBeGreaterThan(0);

    slugs.forEach((slug) => {
      const htmlPath = path.join(FINANCE_PUBLIC_DIR, slug, 'index.html');
      const modulePath = path.join(FINANCE_MODULES_DIR, slug, 'module.js');

      expect(fs.existsSync(htmlPath), `${slug}: missing HTML file`).toBe(true);
      expect(fs.existsSync(modulePath), `${slug}: missing module.js file`).toBe(true);

      const html = fs.readFileSync(htmlPath, 'utf8');
      const moduleSource = fs.readFileSync(modulePath, 'utf8');
      const dom = new JSDOM(html, {
        url: `https://calchowmuch.com/finance/${slug}/`,
      });
      const { document } = dom.window;

      const robotsMeta = document.head.querySelector('meta[name="robots"]');
      expect(robotsMeta, `${slug}: missing static robots meta in <head>`).not.toBeNull();
      expect(
        normalizeText(robotsMeta?.getAttribute('content')),
        `${slug}: robots meta must be index,follow`
      ).toBe('index,follow');

      const jsonLdNodes = parseHeadJsonLdNodes(document);

      ['WebPage', 'SoftwareApplication'].forEach((requiredType) => {
        const requiredInJs = hasSchemaTypeInModule(moduleSource, requiredType);
        if (requiredInJs) {
          expect(
            schemaNodesOfType(jsonLdNodes, requiredType).length,
            `${slug}: missing static ${requiredType} JSON-LD in <head>`
          ).toBeGreaterThan(0);
        }
      });

      const breadcrumbInJs = hasSchemaTypeInModule(moduleSource, 'BreadcrumbList');
      if (breadcrumbInJs) {
        expect(
          schemaNodesOfType(jsonLdNodes, 'BreadcrumbList').length,
          `${slug}: missing static BreadcrumbList JSON-LD in <head>`
        ).toBeGreaterThan(0);
      }

      const visibleFaqPairs = extractVisibleFaqPairs(document);
      const staticFaqNodes = schemaNodesOfType(jsonLdNodes, 'FAQPage');
      const faqExistsInJs = moduleContainsFaqSchema(moduleSource);

      if (faqExistsInJs) {
        expect(
          staticFaqNodes.length,
          `${slug}: FAQPage exists in JS but missing in static HTML <head>`
        ).toBeGreaterThan(0);
      }

      if (visibleFaqPairs.length > 0) {
        expect(
          staticFaqNodes.length,
          `${slug}: visible FAQs exist, static FAQPage must exist exactly once in <head>`
        ).toBe(1);

        const schemaFaqPairs = extractFaqPairsFromSchema(staticFaqNodes[0]);
        expect(
          schemaFaqPairs,
          `${slug}: visible FAQ Q/A must match static FAQPage mainEntity`
        ).toEqual(visibleFaqPairs);
      }
    });
  });
});
