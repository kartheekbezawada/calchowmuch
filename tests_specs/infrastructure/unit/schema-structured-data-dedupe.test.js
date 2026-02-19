import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  normalizeScopeMode,
  processHtmlDocument,
  resolveScopeFiles,
} from '../../../scripts/schema-structured-data-dedupe.mjs';

const SAMPLE_FILE_PATH = path.join(
  process.cwd(),
  'public',
  'finance-calculators',
  'present-value-calculator',
  'index.html'
);

describe('schema-structured-data-dedupe parser and dedupe', () => {
  it('dedupes duplicate FAQPage across multiple JSON-LD blocks', () => {
    const html = `<!doctype html><html><head>
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Q1"}]},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","name":"Home"}]}]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Q2"}]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Tool","applicationCategory":"FinanceApplication"}</script>
</head><body></body></html>`;

    const result = processHtmlDocument({
      html,
      filePath: SAMPLE_FILE_PATH,
    });

    expect(result.preCounts.FAQPage).toBe(2);
    expect(result.postCounts.FAQPage).toBe(1);
    expect(result.postCounts.BreadcrumbList).toBe(1);
    expect(result.postCounts.SoftwareApplication).toBe(1);
    expect(result.changed).toBe(true);
    expect(result.status).toBe('OK');
    expect((result.updatedHtml.match(/"@type":"FAQPage"/g) || []).length).toBe(1);
  });

  it('handles @type arrays and preserves non-duplicate target types', () => {
    const html = `<!doctype html><html><head>
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":["FAQPage","WebPage"],"mainEntity":[{"@type":"Question","name":"Q1"}]}]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":["FAQPage","BreadcrumbList"],"itemListElement":[{"@type":"ListItem","name":"Home"}]}]}</script>
</head><body></body></html>`;

    const firstPass = processHtmlDocument({
      html,
      filePath: SAMPLE_FILE_PATH,
    });

    expect(firstPass.preCounts.FAQPage).toBe(2);
    expect(firstPass.postCounts.FAQPage).toBe(1);
    expect(firstPass.postCounts.BreadcrumbList).toBe(1);
    expect(firstPass.status).toBe('OK');
    expect(firstPass.changed).toBe(true);

    const secondPass = processHtmlDocument({
      html: firstPass.updatedHtml,
      filePath: SAMPLE_FILE_PATH,
    });

    expect(secondPass.changed).toBe(false);
    expect(secondPass.postCounts.FAQPage).toBe(1);
    expect(secondPass.postCounts.BreadcrumbList).toBe(1);
    expect(secondPass.status).toBe('OK');
  });

  it('flags parse errors as hard failures', () => {
    const html = `<!doctype html><html><head>
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"FAQPage"}]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[INVALID]}</script>
</head><body></body></html>`;

    const result = processHtmlDocument({
      html,
      filePath: SAMPLE_FILE_PATH,
    });

    expect(result.parseErrorCount).toBe(1);
    expect(result.status).toBe('PARSE_ERROR');
    expect(result.action).toBe('PARSE_ERROR');
  });
});

describe('schema-structured-data-dedupe scope behavior', () => {
  it('normalizes supported scope aliases', () => {
    expect(normalizeScopeMode('full-repo')).toBe('full');
    expect(normalizeScopeMode('cluster')).toBe('cluster');
    expect(normalizeScopeMode('single-calculator')).toBe('calc');
    expect(normalizeScopeMode('route')).toBe('route');
  });

  it('resolves route scope to a single generated page', () => {
    const files = resolveScopeFiles({
      scope: 'route',
      route: '/finance-calculators/present-value-calculator/',
      env: {},
    });

    expect(files).toHaveLength(1);
    expect(files[0].replace(/\\/g, '/')).toMatch(/public\/finance-calculators\/present-value-calculator\/index\.html$/);
  });

  it('fails cluster scope when CLUSTER is missing', () => {
    expect(() =>
      resolveScopeFiles({
        scope: 'cluster',
        env: {},
      })
    ).toThrow(/CLUSTER is required/);
  });

  it('fails calc scope when CALC is missing', () => {
    expect(() =>
      resolveScopeFiles({
        scope: 'calc',
        env: { CLUSTER: 'percentage' },
      })
    ).toThrow(/CALC is required/);
  });
});
