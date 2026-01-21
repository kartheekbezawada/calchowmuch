/**
 * Series Convergence Calculator Module
 * Tests series for convergence using various convergence tests
 */

import { expressionParser } from '../../../assets/js/core/expression-parser.js';

// Series convergence analyzer
class SeriesAnalyzer {
  constructor(termExpr, startIndex = 1) {
    this.termExpr = termExpr;
    this.startIndex = startIndex;
    this.steps = [];
  }

  // Evaluate term expression at given n using safe parser
  evaluateTerm(n) {
    try {
      let expr = this.termExpr;

      // Handle factorial notation
      if (expr.includes('!')) {
        expr = expr.replace(/(\d+|n)\s*!/g, (match, num) => {
          const val = num === 'n' ? n : parseInt(num);
          return this.factorial(val);
        });
      }

      return expressionParser.evaluate(expr, n, 'n');
    } catch (e) {
      throw new Error(`Cannot evaluate term at n=${n}: ${e.message}`);
    }
  }

  // Factorial function
  factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  // Ratio Test
  ratioTest() {
    this.steps = [];
    this.steps.push('=== RATIO TEST ===');
    this.steps.push(`For series Σa_n where a_n = ${this.termExpr}`);
    this.steps.push('\nCompute L = lim(n→∞) |a_(n+1) / a_n|');

    // Calculate ratio for large values of n
    const testValues = [10, 50, 100, 500, 1000];
    const ratios = [];

    this.steps.push('\nCalculating ratios for increasing n:');

    for (const n of testValues) {
      try {
        const a_n = Math.abs(this.evaluateTerm(n));
        const a_n1 = Math.abs(this.evaluateTerm(n + 1));

        if (a_n === 0) continue;

        const ratio = a_n1 / a_n;
        ratios.push(ratio);

        this.steps.push(`  n = ${n}: |a_${n+1}| / |a_${n}| = ${ratio.toFixed(6)}`);
      } catch (e) {
        continue;
      }
    }

    if (ratios.length === 0) {
      return {
        conclusion: 'inconclusive',
        limit: null,
        explanation: 'Unable to compute ratios'
      };
    }

    // Estimate limit
    const L = ratios[ratios.length - 1];
    this.steps.push(`\nEstimated limit L ≈ ${L.toFixed(6)}`);

    let conclusion, explanation;

    if (L < 0.95) {
      conclusion = 'converges';
      explanation = `Since L ≈ ${L.toFixed(4)} < 1, the series CONVERGES by the ratio test.`;
    } else if (L > 1.05) {
      conclusion = 'diverges';
      explanation = `Since L ≈ ${L.toFixed(4)} > 1, the series DIVERGES by the ratio test.`;
    } else {
      conclusion = 'inconclusive';
      explanation = `Since L ≈ ${L.toFixed(4)} ≈ 1, the ratio test is INCONCLUSIVE.`;
    }

    this.steps.push('\n' + explanation);

    return { conclusion, limit: L, explanation, steps: this.steps };
  }

  // Root Test (nth root test)
  rootTest() {
    this.steps = [];
    this.steps.push('=== ROOT TEST ===');
    this.steps.push(`For series Σa_n where a_n = ${this.termExpr}`);
    this.steps.push('\nCompute L = lim(n→∞) ⁿ√|a_n|');

    const testValues = [10, 50, 100, 500, 1000];
    const roots = [];

    this.steps.push('\nCalculating nth roots for increasing n:');

    for (const n of testValues) {
      try {
        const a_n = Math.abs(this.evaluateTerm(n));

        if (a_n === 0) continue;

        const root = Math.pow(a_n, 1/n);
        roots.push(root);

        this.steps.push(`  n = ${n}: ⁿ√|a_${n}| = ${root.toFixed(6)}`);
      } catch (e) {
        continue;
      }
    }

    if (roots.length === 0) {
      return {
        conclusion: 'inconclusive',
        limit: null,
        explanation: 'Unable to compute roots'
      };
    }

    // Estimate limit
    const L = roots[roots.length - 1];
    this.steps.push(`\nEstimated limit L ≈ ${L.toFixed(6)}`);

    let conclusion, explanation;

    if (L < 0.95) {
      conclusion = 'converges';
      explanation = `Since L ≈ ${L.toFixed(4)} < 1, the series CONVERGES by the root test.`;
    } else if (L > 1.05) {
      conclusion = 'diverges';
      explanation = `Since L ≈ ${L.toFixed(4)} > 1, the series DIVERGES by the root test.`;
    } else {
      conclusion = 'inconclusive';
      explanation = `Since L ≈ ${L.toFixed(4)} ≈ 1, the root test is INCONCLUSIVE.`;
    }

    this.steps.push('\n' + explanation);

    return { conclusion, limit: L, explanation, steps: this.steps };
  }

  // Basic Comparison Test (with p-series)
  comparisonTest() {
    this.steps = [];
    this.steps.push('=== COMPARISON TEST ===');
    this.steps.push(`For series Σa_n where a_n = ${this.termExpr}`);

    // Try to detect if it's comparable to a p-series
    const testValues = [10, 50, 100, 500, 1000];

    this.steps.push('\nComputing terms to find comparison series:');

    const terms = [];
    for (const n of testValues.slice(0, 3)) {
      try {
        const term = this.evaluateTerm(n);
        terms.push({ n, term });
        this.steps.push(`  a_${n} = ${term.toExponential(4)}`);
      } catch (e) {
        continue;
      }
    }

    if (terms.length < 2) {
      return {
        conclusion: 'inconclusive',
        explanation: 'Unable to compute enough terms for comparison'
      };
    }

    // Try to estimate power p in 1/n^p
    const n1 = terms[0].n;
    const n2 = terms[1].n;
    const a1 = Math.abs(terms[0].term);
    const a2 = Math.abs(terms[1].term);

    if (a1 === 0 || a2 === 0) {
      return {
        conclusion: 'inconclusive',
        explanation: 'Terms are zero, cannot compare'
      };
    }

    // Estimate p from a_n ≈ 1/n^p
    // a1/a2 ≈ (n2/n1)^p
    const ratio = a1 / a2;
    const p = Math.log(ratio) / Math.log(n2 / n1);

    this.steps.push(`\nEstimating behavior: a_n behaves like 1/n^p where p ≈ ${p.toFixed(3)}`);
    this.steps.push(`Comparing with p-series: Σ1/n^${p.toFixed(3)}`);

    let conclusion, explanation;

    if (p > 1.05) {
      conclusion = 'converges';
      explanation = `Since p ≈ ${p.toFixed(3)} > 1, the comparison with p-series suggests the series CONVERGES.`;
    } else if (p < 0.95) {
      conclusion = 'diverges';
      explanation = `Since p ≈ ${p.toFixed(3)} < 1, the comparison with p-series suggests the series DIVERGES.`;
    } else {
      conclusion = 'inconclusive';
      explanation = `Since p ≈ ${p.toFixed(3)} ≈ 1 (near harmonic series), this test is INCONCLUSIVE.`;
    }

    this.steps.push('\n' + explanation);
    this.steps.push('\nNote: This is an estimated comparison. Use ratio or root test for definitive results.');

    return { conclusion, explanation, p, steps: this.steps };
  }

  // Auto-detect best test
  autoDetect() {
    this.steps = [];
    this.steps.push('=== AUTO-DETECT MODE ===');
    this.steps.push('Trying multiple tests to determine convergence...\n');

    // Try ratio test first (works well for most series)
    const ratioResult = this.ratioTest();

    if (ratioResult.conclusion !== 'inconclusive') {
      this.steps.push('\n--- CONCLUSION ---');
      this.steps.push('Ratio test provided a definitive result.');
      return {
        ...ratioResult,
        test: 'Ratio Test',
        steps: this.steps
      };
    }

    // Try root test
    this.steps.push('\n\nRatio test inconclusive, trying root test...\n');
    const rootResult = this.rootTest();

    if (rootResult.conclusion !== 'inconclusive') {
      this.steps.push('\n--- CONCLUSION ---');
      this.steps.push('Root test provided a definitive result.');
      return {
        ...rootResult,
        test: 'Root Test',
        steps: this.steps
      };
    }

    // Try comparison test
    this.steps.push('\n\nRoot test inconclusive, trying comparison test...\n');
    const compResult = this.comparisonTest();

    this.steps.push('\n--- CONCLUSION ---');
    this.steps.push('Used comparison with p-series for estimation.');

    return {
      ...compResult,
      test: 'Comparison Test (Estimated)',
      steps: this.steps
    };
  }
}

// Plot partial sums to visualize convergence
function plotSeriesGraph(termExpr, startIndex, conclusion) {
  const canvas = document.getElementById('series-graph');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  try {
    const analyzer = new SeriesAnalyzer(termExpr, startIndex);

    // Calculate partial sums
    const maxTerms = 50;
    const partialSums = [];
    let sum = 0;

    for (let n = startIndex; n < startIndex + maxTerms; n++) {
      try {
        const term = analyzer.evaluateTerm(n);
        sum += term;
        partialSums.push({ n, sum, term });
      } catch (e) {
        break;
      }
    }

    if (partialSums.length === 0) return;

    // Find y-axis range
    const sumValues = partialSums.map(p => p.sum);
    const yMin = Math.min(...sumValues) - 1;
    const yMax = Math.max(...sumValues) + 1;
    const yRange = yMax - yMin;

    const xScale = width / maxTerms;
    const yScale = height / yRange;

    // Draw axes
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();

    // X-axis
    const yZero = height - (0 - yMin) * yScale;
    ctx.moveTo(0, yZero);
    ctx.lineTo(width, yZero);

    ctx.stroke();

    // Draw gridlines
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 10; i < maxTerms; i += 10) {
      const x = i * xScale;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Plot partial sums
    ctx.strokeStyle = conclusion === 'converges' ? '#2ecc71' : conclusion === 'diverges' ? '#e74c3c' : '#f39c12';
    ctx.lineWidth = 2;
    ctx.beginPath();

    partialSums.forEach((p, i) => {
      const x = (p.n - startIndex) * xScale;
      const y = height - (p.sum - yMin) * yScale;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#3498db';
    partialSums.forEach(p => {
      const x = (p.n - startIndex) * xScale;
      const y = height - (p.sum - yMin) * yScale;

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Update graph info
    const graphInfo = document.getElementById('series-graph-info');
    if (graphInfo) {
      const lastSum = partialSums[partialSums.length - 1].sum;
      const convergenceColor = conclusion === 'converges' ? '#2ecc71' : conclusion === 'diverges' ? '#e74c3c' : '#f39c12';

      graphInfo.innerHTML = `
        <div style="margin-top: 10px;">
          <span style="color: ${convergenceColor};">■ Partial Sums S_n = Σ(k=${startIndex} to n) a_k</span><br>
          <span style="color: #3498db;">● Individual terms</span><br>
          <span>First ${partialSums.length} terms computed</span><br>
          <span>S_${partialSums[partialSums.length - 1].n} ≈ ${lastSum.toFixed(6)}</span>
          ${conclusion === 'converges' ? '<br><span style="color: #2ecc71;">Series appears to converge to a limit</span>' : ''}
          ${conclusion === 'diverges' ? '<br><span style="color: #e74c3c;">Series appears to diverge</span>' : ''}
        </div>
      `;
    }

  } catch (error) {
    console.error('Error plotting series:', error);
  }
}

// Initialize calculator
export function initSeriesConvergenceCalculator() {
  const calculateBtn = document.getElementById('series-calculate');
  const resultDiv = document.getElementById('series-result');
  const stepsDiv = document.getElementById('series-steps');
  const testButtons = document.querySelectorAll('.test-button');

  let currentTest = 'auto';

  if (!calculateBtn) return;

  // Test button selection
  testButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      testButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTest = btn.dataset.test;
    });
  });

  calculateBtn.addEventListener('click', () => {
    const termInput = document.getElementById('series-term').value.trim();
    const startIndex = parseInt(document.getElementById('series-start').value) || 1;

    if (!termInput) {
      resultDiv.innerHTML = '<p class="error">Please enter a series term.</p>';
      stepsDiv.innerHTML = '';
      return;
    }

    try {
      const analyzer = new SeriesAnalyzer(termInput, startIndex);
      let result;

      // Apply selected test
      switch (currentTest) {
        case 'ratio':
          result = analyzer.ratioTest();
          result.test = 'Ratio Test';
          break;
        case 'root':
          result = analyzer.rootTest();
          result.test = 'Root Test';
          break;
        case 'comparison':
          result = analyzer.comparisonTest();
          result.test = 'Comparison Test';
          break;
        default:
          result = analyzer.autoDetect();
      }

      // Display result with appropriate styling
      const conclusionClass = result.conclusion === 'converges' ? 'converges' :
                             result.conclusion === 'diverges' ? 'diverges' : 'inconclusive';
      const conclusionText = result.conclusion.toUpperCase();

      resultDiv.innerHTML = `
        <h4>Result:</h4>
        <div class="result-box ${conclusionClass}">
          <strong>Test Used: ${result.test}</strong><br>
          <strong>Conclusion: The series ${conclusionText}</strong>
          ${result.limit !== null && result.limit !== undefined ? `<br>Limit L ≈ ${result.limit.toFixed(6)}` : ''}
        </div>
        <div class="result-box" style="margin-top: 10px;">
          ${result.explanation}
        </div>
      `;

      // Show steps
      if (result.steps) {
        stepsDiv.innerHTML = `
          <h4>Step-by-Step Analysis:</h4>
          <div class="steps-box">
            <pre>${result.steps.join('\n')}</pre>
          </div>
        `;
      }

      // Plot graph
      plotSeriesGraph(termInput, startIndex, result.conclusion);

    } catch (error) {
      resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
      stepsDiv.innerHTML = '';
    }
  });

  // Trigger initial calculation
  calculateBtn.click();
}
