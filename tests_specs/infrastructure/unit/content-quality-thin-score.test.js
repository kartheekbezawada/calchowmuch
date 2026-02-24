import { describe, expect, it } from 'vitest';
import {
  analyzeHtmlDocument,
  gradeForScore,
  normalizeScopeMode,
  resolveScopeFiles,
  scoreAnalyzedPage,
  validateRequiredBlockOrder,
} from '../../../scripts/content-quality-thin-score.mjs';

describe('content-quality-thin-score grading boundaries', () => {
  it('maps boundary scores to expected grades', () => {
    expect(gradeForScore(49)).toBe('High Risk Thin');
    expect(gradeForScore(50)).toBe('Weak');
    expect(gradeForScore(69)).toBe('Weak');
    expect(gradeForScore(70)).toBe('Acceptable');
    expect(gradeForScore(84)).toBe('Acceptable');
    expect(gradeForScore(85)).toBe('Strong');
  });

  it('normalizes supported scope aliases', () => {
    expect(normalizeScopeMode('full-repo')).toBe('full');
    expect(normalizeScopeMode('cluster')).toBe('cluster');
    expect(normalizeScopeMode('single-calculator')).toBe('calc');
    expect(normalizeScopeMode('route')).toBe('route');
  });
});

describe('content-quality-thin-score hard flags', () => {
  it('detects hard flags for thin/weak content', () => {
    const html = `<!doctype html>
      <html>
        <body data-route-archetype="calc_exp">
          <section class="explanation-pane">
            <div id="test-explanation">
              <h3>Loan Guide</h3>
              <p>Short tool text only.</p>
              <h3>How to Guide</h3>
              <ul><li>Fill values.</li><li>Click calculate.</li></ul>
              <h3>Important Notes</h3>
              <p>Estimate only.</p>
              <h3>Frequently Asked Questions</h3>
              <div class="bor-faq-card"><h4>What is this?</h4><p>A calculator.</p></div>
            </div>
          </section>
        </body>
      </html>`;

    const analyzed = analyzeHtmlDocument({
      html,
      route: '/loan-calculators/mortgage-calculator/',
      filePath: '/tmp/test.html',
    });

    const scored = scoreAnalyzedPage(analyzed, 0.86);

    expect(scored.hardFlags).toContain('No worked example detected.');
    expect(scored.hardFlags).toContain('Content similarity above 80%.');
    expect(scored.hardFlags).toContain('Explanation content below 150 words.');
  });
});

describe('content-quality-thin-score explanation order contract', () => {
  it('accepts output-first heading order before required SERP blocks', () => {
    const result = validateRequiredBlockOrder([
      'Lifetime Totals',
      'Amortization Table',
      'Mortgage Balance Graph',
      'Mortgage Complete Practical Guide',
      'How To Guide',
      'Important Notes',
      'Frequently Asked Questions',
    ]);

    expect(result.isValid).toBe(true);
    expect(result.howToIndex).toBeLessThan(result.importantNotesIndex);
    expect(result.importantNotesIndex).toBeLessThan(result.faqIndex);
  });

  it('rejects when FAQ appears before Important Notes', () => {
    const result = validateRequiredBlockOrder(['How To Guide', 'Frequently Asked Questions', 'Important Notes']);
    expect(result.isValid).toBe(false);
  });
});

describe('content-quality-thin-score scope resolution errors', () => {
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
        env: { CLUSTER: 'loans' },
      })
    ).toThrow(/CALC is required/);
  });
});
