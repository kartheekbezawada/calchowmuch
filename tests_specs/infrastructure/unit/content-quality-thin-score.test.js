import { describe, expect, it } from 'vitest';
import {
  analyzeHtmlDocument,
  gradeForScore,
  normalizeScopeMode,
  resolveQualityStatus,
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
      'Frequently Asked Questions',
      'Important Notes',
    ]);

    expect(result.isValid).toBe(true);
    expect(result.howToIndex).toBeLessThan(result.faqIndex);
    expect(result.faqIndex).toBeLessThan(result.importantNotesIndex);
  });

  it('rejects when Important Notes appears before FAQ', () => {
    const result = validateRequiredBlockOrder(['How To Guide', 'Important Notes', 'Frequently Asked Questions']);
    expect(result.isValid).toBe(false);
  });
});

describe('content-quality-thin-score Important Notes contract', () => {
  it('passes required Important Notes keys and format checks', () => {
    const html = `<!doctype html>
      <html>
        <body data-route-archetype="calc_exp">
          <section class="explanation-pane">
            <div id="test-explanation">
              <h3>How to Guide</h3>
              <p>Use this calculator to estimate payoff timeline and total interest.</p>
              <h3>Frequently Asked Questions</h3>
              <div class="faq-box"><strong>Q: What does this calculator estimate?</strong></div>
              <h3>Important Notes</h3>
              <ul>
                <li><strong>Last updated:</strong> March 2026.</li>
                <li><strong>Accuracy:</strong> This calculator provides estimated results based on the inputs provided.</li>
                <li><strong>Financial disclaimer:</strong> For educational purposes only; not financial advice.</li>
                <li><strong>Assumptions:</strong> Assumes fixed APR and on-time payments.</li>
                <li><strong>Privacy:</strong> All calculations run locally in your browser - no data is stored.</li>
              </ul>
            </div>
          </section>
        </body>
      </html>`;

    const analyzed = analyzeHtmlDocument({
      html,
      route: '/credit-card-calculators/credit-card-payment-calculator/',
      filePath: '/tmp/test.html',
    });
    const scored = scoreAnalyzedPage(analyzed, 0.25);

    expect(analyzed.importantNotesContract.hasRequiredKeys).toBe(true);
    expect(analyzed.importantNotesContract.hasDisclaimerKey).toBe(true);
    expect(analyzed.importantNotesContract.hasPrivacyExactText).toBe(true);
    expect(analyzed.importantNotesContract.hasLastUpdatedMonthYear).toBe(true);
    expect(scored.hardFlags).not.toContainEqual(expect.stringContaining('Important Notes missing required keys'));
  });

  it('flags Important Notes contract violations', () => {
    const html = `<!doctype html>
      <html>
        <body data-route-archetype="calc_exp">
          <section class="explanation-pane">
            <div id="test-explanation">
              <h3>How to Guide</h3>
              <p>Enter values and review outputs.</p>
              <h3>Frequently Asked Questions</h3>
              <p>FAQ text</p>
              <h3>Important Notes</h3>
              <ul>
                <li><strong>Last updated:</strong> 2026-03.</li>
                <li><strong>Assumptions:</strong> Fixed inputs.</li>
                <li><strong>Privacy:</strong> Data stays local in browser.</li>
              </ul>
            </div>
          </section>
        </body>
      </html>`;

    const analyzed = analyzeHtmlDocument({
      html,
      route: '/credit-card-calculators/credit-card-payment-calculator/',
      filePath: '/tmp/test.html',
    });
    const scored = scoreAnalyzedPage(analyzed, 0.25);

    expect(scored.hardFlags).toContainEqual(expect.stringContaining('missing required keys'));
    expect(scored.hardFlags).toContainEqual(expect.stringContaining('disclaimer key'));
    expect(scored.hardFlags).toContainEqual(expect.stringContaining('privacy line must exactly match'));
    expect(scored.hardFlags).toContainEqual(expect.stringContaining('Last updated: <Month YYYY>'));
  });
});

describe('content-quality-thin-score mode status behavior', () => {
  it('returns warn in soft mode for hard flags', () => {
    const status = resolveQualityStatus({
      mode: 'soft',
      threshold: 70,
      score: 82,
      hardFlagsCount: 1,
    });
    expect(status).toBe('warn');
  });

  it('returns fail in hard mode for hard flags', () => {
    const status = resolveQualityStatus({
      mode: 'hard',
      threshold: 70,
      score: 82,
      hardFlagsCount: 1,
    });
    expect(status).toBe('fail');
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
