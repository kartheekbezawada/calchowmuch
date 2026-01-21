/**
 * Integral Calculator Module
 * Provides symbolic and numerical integration capabilities
 */

import { expressionParser } from '../../../assets/js/core/expression-parser.js';

// Simple integration engine
class SymbolicIntegrator {
  constructor(variable = 'x') {
    this.variable = variable;
    this.steps = [];
  }

  // Parse polynomial expression
  parsePolynomial(expr) {
    expr = expr.replace(/\s/g, '');
    const terms = [];
    const regex = /([+-]?\d*\.?\d*)\*?([a-z])?\^?(\d*\.?\d*)/g;
    let match;

    while ((match = regex.exec(expr)) !== null) {
      const coef = match[1] ? (match[1] === '+' || match[1] === '' ? 1 : match[1] === '-' ? -1 : parseFloat(match[1])) : 1;
      const variable = match[2] || '';
      const exponent = match[3] ? parseFloat(match[3]) : (variable ? 1 : 0);

      if (coef !== 0) {
        terms.push({ coef, variable, exponent });
      }
    }

    return terms;
  }

  // Integrate using power rule
  integratePowerRule(coef, exponent) {
    if (exponent === -1) {
      return { type: 'ln', coef };
    }

    return {
      type: 'polynomial',
      coef: coef / (exponent + 1),
      exponent: exponent + 1
    };
  }

  // Integrate polynomial
  integratePolynomial(expr) {
    this.steps = [];
    this.steps.push(`Original function: f(x) = ${expr}`);

    const terms = this.parsePolynomial(expr);
    const integrals = [];

    this.steps.push('\nApplying power rule to each term:');

    for (const term of terms) {
      if (term.variable !== this.variable && term.variable !== '') continue;

      const original = this.formatTerm(term);
      const integral = this.integratePowerRule(term.coef, term.exponent);

      if (integral.type === 'ln') {
        integrals.push(integral);
        this.steps.push(`  ∫${original} dx = ${integral.coef}·ln|${this.variable}|`);
      } else {
        integrals.push(integral);
        const integralStr = this.formatIntegral(integral);
        this.steps.push(`  ∫${original} dx = ${integralStr}`);
      }
    }

    return integrals;
  }

  // Format term for display
  formatTerm(term) {
    let str = '';

    if (term.coef === 0) return '0';

    if (Math.abs(term.coef) !== 1 || term.exponent === 0) {
      str += Math.abs(term.coef);
    }

    if (term.variable && term.exponent !== 0) {
      str += term.variable;
      if (term.exponent !== 1) {
        str += '^' + term.exponent;
      }
    }

    return str || '1';
  }

  // Format integrated term
  formatIntegral(integral) {
    if (integral.type === 'ln') {
      return `${integral.coef}·ln|${this.variable}|`;
    }

    let str = '';

    if (integral.coef !== 1) {
      str += integral.coef.toFixed(4).replace(/\.?0+$/, '');
    }

    if (integral.exponent !== 0) {
      str += this.variable;
      if (integral.exponent !== 1) {
        str += '^' + integral.exponent;
      }
    }

    return str || integral.coef.toString();
  }

  // Format full integral expression
  formatExpression(terms) {
    if (terms.length === 0) return '0';

    let expr = '';
    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      const termStr = this.formatIntegral(term);

      if (i === 0) {
        expr += term.coef < 0 ? '-' : '';
        expr += termStr;
      } else {
        expr += term.coef < 0 ? ' - ' : ' + ';
        expr += termStr;
      }
    }

    return expr + ' + C';
  }

  // Main integration function
  integrate(expr) {
    const integrals = this.integratePolynomial(expr);
    const result = this.formatExpression(integrals);

    this.steps.push(`\nFinal result: ∫f(x)dx = ${result}`);

    return {
      integral: result,
      steps: this.steps,
      terms: integrals
    };
  }

  // Evaluate definite integral
  evaluateDefinite(terms, a, b) {
    const evalAt = (x) => {
      let sum = 0;
      for (const term of terms) {
        if (term.type === 'ln') {
          sum += term.coef * Math.log(Math.abs(x));
        } else {
          sum += term.coef * Math.pow(x, term.exponent);
        }
      }
      return sum;
    };

    const Fb = evalAt(b);
    const Fa = evalAt(a);

    return Fb - Fa;
  }
}

// Plot integral graph with shaded area
function plotIntegralGraph(funcExpr, mode, lowerBound, upperBound) {
  const canvas = document.getElementById('int-graph');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Set up coordinate system
  const xMin = mode === 'definite' ? Math.min(-5, lowerBound - 1) : -5;
  const xMax = mode === 'definite' ? Math.max(5, upperBound + 1) : 5;
  const yMin = -10;
  const yMax = 10;

  const xScale = width / (xMax - xMin);
  const yScale = height / (yMax - yMin);
  const xOrigin = -xMin * xScale;
  const yOrigin = yMax * yScale;

  // Draw axes
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, yOrigin);
  ctx.lineTo(width, yOrigin);
  ctx.moveTo(xOrigin, 0);
  ctx.lineTo(xOrigin, height);
  ctx.stroke();

  // Helper to evaluate function using safe parser
  const safeEval = (expr, x) => {
    try {
      return expressionParser.evaluate(expr, x, 'x');
    } catch (e) {
      return 0;
    }
  };

  // Shade area under curve for definite integral
  if (mode === 'definite' && lowerBound !== null && upperBound !== null) {
    ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
    ctx.beginPath();

    const startPx = (lowerBound - xMin) * xScale;
    const endPx = (upperBound - xMin) * xScale;

    ctx.moveTo(startPx, yOrigin);

    for (let px = startPx; px <= endPx; px++) {
      const x = xMin + px / xScale;
      const y = safeEval(funcExpr, x);
      const py = yOrigin - y * yScale;
      ctx.lineTo(px, py);
    }

    ctx.lineTo(endPx, yOrigin);
    ctx.closePath();
    ctx.fill();
  }

  // Plot function
  ctx.strokeStyle = '#3498db';
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let px = 0; px < width; px++) {
    const x = xMin + px / xScale;
    const y = safeEval(funcExpr, x);
    const py = yOrigin - y * yScale;

    if (px === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  // Mark bounds for definite integral
  if (mode === 'definite' && lowerBound !== null && upperBound !== null) {
    const markBound = (bound, color) => {
      const px = (bound - xMin) * xScale;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    markBound(lowerBound, '#2ecc71');
    markBound(upperBound, '#e74c3c');
  }

  // Update graph info
  const graphInfo = document.getElementById('int-graph-info');
  if (graphInfo) {
    graphInfo.innerHTML = `
      <div style="margin-top: 10px;">
        <span style="color: #3498db;">■ Function f(x)</span>
        ${mode === 'definite' ? `<br><span style="color: rgba(52, 152, 219, 0.5);">▉ Shaded area represents ∫[${lowerBound} to ${upperBound}]f(x)dx</span>
        <br><span style="color: #2ecc71;">| Lower bound (a=${lowerBound})</span>
        <br><span style="color: #e74c3c;">| Upper bound (b=${upperBound})</span>` : ''}
      </div>
    `;
  }
}

// Initialize calculator
export function initIntegralCalculator() {
  const calculateBtn = document.getElementById('int-calculate');
  const resultDiv = document.getElementById('int-result');
  const stepsDiv = document.getElementById('int-steps');
  const modeButtons = document.querySelectorAll('.mode-button');
  const definiteBounds = document.getElementById('definite-bounds');

  let currentMode = 'indefinite';

  if (!calculateBtn) return;

  // Mode switching
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;

      if (currentMode === 'definite') {
        definiteBounds.style.display = 'block';
      } else {
        definiteBounds.style.display = 'none';
      }
    });
  });

  calculateBtn.addEventListener('click', () => {
    const funcInput = document.getElementById('int-function').value.trim();
    const variableInput = document.getElementById('int-variable').value.trim() || 'x';

    if (!funcInput) {
      resultDiv.innerHTML = '<p class="error">Please enter a function.</p>';
      stepsDiv.innerHTML = '';
      return;
    }

    try {
      const integrator = new SymbolicIntegrator(variableInput);
      const result = integrator.integrate(funcInput);

      if (currentMode === 'indefinite') {
        resultDiv.innerHTML = `
          <h4>Result:</h4>
          <div class="result-box">
            <strong>∫f(${variableInput})d${variableInput} = ${result.integral}</strong>
          </div>
        `;

        plotIntegralGraph(funcInput, 'indefinite', null, null);

      } else {
        // Definite integral
        const lowerBound = parseFloat(document.getElementById('int-lower').value);
        const upperBound = parseFloat(document.getElementById('int-upper').value);

        const value = integrator.evaluateDefinite(result.terms, lowerBound, upperBound);

        resultDiv.innerHTML = `
          <h4>Result:</h4>
          <div class="result-box">
            <strong>∫[${lowerBound} to ${upperBound}]f(${variableInput})d${variableInput} = ${value.toFixed(6)}</strong>
          </div>
          <div class="result-box" style="margin-top: 10px;">
            <strong>Antiderivative:</strong> F(${variableInput}) = ${result.integral}
          </div>
        `;

        plotIntegralGraph(funcInput, 'definite', lowerBound, upperBound);
      }

      // Show steps
      stepsDiv.innerHTML = `
        <h4>Step-by-Step Solution:</h4>
        <div class="steps-box">
          <pre>${result.steps.join('\n')}</pre>
        </div>
      `;

    } catch (error) {
      resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
      stepsDiv.innerHTML = '';
    }
  });

  // Trigger initial calculation
  calculateBtn.click();
}
