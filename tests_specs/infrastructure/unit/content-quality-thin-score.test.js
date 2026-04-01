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

  it('extracts migrated math explanations from math-cluster-flow containers', () => {
    const html = `<!doctype html>
      <html>
        <body data-page="calculator" data-route-archetype="calc_exp">
          <div class="calculator-page-single math-cluster-flow">
            <div id="calc-factoring">
              <h2>Calculator shell</h2>
              <p>Interactive controls live here.</p>
            </div>

            <section class="factor-exp-section">
              <h2>Factoring Calculator Practical Guide</h2>
              <p>
                Use this factoring calculator to check polynomial factors, compare methods, and
                review the matched algebra pattern before moving on to the next problem.
              </p>
            </section>

            <section class="factor-exp-section">
              <h3>How to Guide</h3>
              <ol>
                <li>Enter the polynomial.</li>
                <li>Run the factoring tool.</li>
                <li>Read the factored form and method notes.</li>
              </ol>
            </section>

            <section class="factor-exp-section">
              <h3>Worked Example</h3>
              <p>
                Example: x^2 + 5x + 6 factors to (x + 2)(x + 3), which confirms the selected
                factoring path.
              </p>
            </section>

            <section class="factor-exp-section">
              <h3>FAQ</h3>
              <div class="factor-faq-grid">
                <div class="faq-card"><h4>What methods are included?</h4><p>GCF and trinomials.</p></div>
                <div class="faq-card"><h4>Can this verify by expansion?</h4><p>Yes, manually after review.</p></div>
                <div class="faq-card"><h4>What if no factor is found?</h4><p>The current simplified form is shown.</p></div>
                <div class="faq-card"><h4>Can I disable methods?</h4><p>Yes, from advanced options.</p></div>
                <div class="faq-card"><h4>Does it support decimals?</h4><p>Yes, when parsing succeeds.</p></div>
              </div>
            </section>

            <section class="factor-exp-section">
              <h3>Important Notes</h3>
              <ul>
                <li><strong>Last updated:</strong> March 2026.</li>
                <li><strong>Accuracy:</strong> Results are based on the entered polynomial and supported factoring rules.</li>
                <li><strong>Math disclaimer:</strong> For learning and checking only; not a formal proof.</li>
                <li><strong>Assumptions:</strong> Input must be a valid polynomial in supported syntax.</li>
                <li><strong>Privacy:</strong> All calculations run locally in your browser - no data is stored.</li>
              </ul>
            </section>
          </div>
        </body>
      </html>`;

    const analyzed = analyzeHtmlDocument({
      html,
      route: '/math/algebra/factoring/',
      filePath: '/tmp/math-factoring.html',
    });
    const scored = scoreAnalyzedPage(analyzed, 0.25);

    expect(analyzed.wordCount).toBeGreaterThan(80);
    expect(analyzed.faqCount).toBe(5);
    expect(analyzed.headingOrder.isValid).toBe(true);
    expect(scored.hardFlags).not.toContain('Explanation content below 150 words.');
    expect(scored.hardFlags).not.toContainEqual(expect.stringContaining('Important Notes heading is missing'));
  });

  it('counts FAQ questions when a FAQ section uses h3 cards', () => {
    const html = `<!doctype html>
      <html>
        <body data-page="calculator" data-route-archetype="calc_exp">
          <section class="explanation-pane">
            <div id="weekly-pay-explanation">
              <section>
                <h3>Weekly Pay Practical Guide</h3>
                <p>Estimate weekly pay from hours and hourly rate, then review gross output and scheduling assumptions.</p>
              </section>
              <section>
                <h3>How to Guide</h3>
                <p>Enter hourly rate and weekly hours, then review the answer card.</p>
              </section>
              <section>
                <h3>Frequently Asked Questions</h3>
                <article><h3>How do you calculate weekly pay?</h3><p>Multiply hours by rate.</p></article>
                <article><h3>Can overtime be included?</h3><p>Yes, with split inputs.</p></article>
                <article><h3>Can this annualize pay?</h3><p>Yes, by multiplying the weekly result by weeks per year.</p></article>
                <article><h3>Does this include taxes?</h3><p>No, it estimates gross pay.</p></article>
                <article><h3>Does it work for part-time schedules?</h3><p>Yes.</p></article>
              </section>
              <section>
                <h3>Important Notes</h3>
                <ul>
                  <li><strong>Last updated:</strong> April 2026.</li>
                  <li><strong>Accuracy:</strong> Results depend on the hourly rate and hours you enter.</li>
                  <li><strong>Payroll disclaimer:</strong> Planning only; verify payroll details separately.</li>
                  <li><strong>Assumptions:</strong> Weekly hours represent one gross workweek.</li>
                  <li><strong>Privacy:</strong> All calculations run locally in your browser - no data is stored.</li>
                </ul>
              </section>
            </div>
          </section>
        </body>
      </html>`;

    const analyzed = analyzeHtmlDocument({
      html,
      route: '/salary-calculators/weekly-pay-calculator/',
      filePath: '/tmp/weekly-pay.html',
    });

    expect(analyzed.faqCount).toBe(5);
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
