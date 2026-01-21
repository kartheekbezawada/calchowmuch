/**
 * Derivative Calculator Module
 * Provides symbolic differentiation capabilities
 */

import { expressionParser } from '../../../assets/js/core/expression-parser.js';

// Simple expression parser and differentiator
class SymbolicDifferentiator {
  constructor(variable = 'x') {
    this.variable = variable;
    this.steps = [];
  }

  // Parse simple polynomial expressions
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

  // Differentiate using power rule
  differentiatePowerRule(coef, exponent) {
    if (exponent === 0) return { coef: 0, exponent: 0 };
    return {
      coef: coef * exponent,
      exponent: exponent - 1
    };
  }

  // Main differentiation function for polynomial
  differentiatePolynomial(expr) {
    this.steps = [];
    this.steps.push(`Original function: f(x) = ${expr}`);

    const terms = this.parsePolynomial(expr);
    const derivatives = [];

    this.steps.push('\nApplying power rule to each term:');

    for (const term of terms) {
      if (term.variable !== this.variable && term.variable !== '') continue;

      const original = this.formatTerm(term);
      const deriv = this.differentiatePowerRule(term.coef, term.exponent);

      if (deriv.coef !== 0) {
        derivatives.push(deriv);
        const derivStr = this.formatDerivative(term, deriv);
        this.steps.push(`  d/dx(${original}) = ${derivStr}`);
      } else {
        this.steps.push(`  d/dx(${original}) = 0 (constant rule)`);
      }
    }

    return derivatives;
  }

  // Format a term for display
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

  // Format derivative step
  formatDerivative(original, deriv) {
    if (deriv.exponent === 0) {
      return deriv.coef.toString();
    }

    let str = deriv.coef !== 1 ? deriv.coef.toString() : '';
    str += this.variable;
    if (deriv.exponent !== 1) {
      str += '^' + deriv.exponent;
    }

    return str;
  }

  // Format full derivative expression
  formatExpression(terms) {
    if (terms.length === 0) return '0';

    let expr = '';
    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      const termStr = this.formatTerm(term);

      if (i === 0) {
        expr += term.coef < 0 ? '-' : '';
        expr += termStr;
      } else {
        expr += term.coef < 0 ? ' - ' : ' + ';
        expr += termStr;
      }
    }

    return expr;
  }

  // Enhanced differentiation supporting more functions
  differentiate(expr, order = 1) {
    let currentExpr = expr;
    let allSteps = [];

    for (let i = 0; i < order; i++) {
      const derivatives = this.differentiatePolynomial(currentExpr);
      allSteps.push(...this.steps);

      if (i < order - 1) {
        currentExpr = this.formatExpression(derivatives);
        allSteps.push(`\n--- Computing derivative ${i + 2} ---`);
      } else {
        const result = this.formatExpression(derivatives);
        allSteps.push(`\nFinal derivative: f${"'".repeat(order)}(x) = ${result}`);
        return {
          derivative: result,
          steps: allSteps,
          terms: derivatives
        };
      }
    }
  }

  // Evaluate derivative at a point
  evaluateAt(terms, point) {
    let sum = 0;
    for (const term of terms) {
      sum += term.coef * Math.pow(point, term.exponent);
    }
    return sum;
  }
}

// Graph plotting function
function plotDerivativeGraph(funcExpr, derivExpr, evalPoint) {
  const canvas = document.getElementById('deriv-graph');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Set up coordinate system
  const xMin = -5, xMax = 5;
  const yMin = -10, yMax = 10;

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

  // Helper to convert function string to evaluable using safe parser
  const safeEval = (expr, x) => {
    try {
      return expressionParser.evaluate(expr, x, 'x');
    } catch (e) {
      return 0;
    }
  };

  // Plot original function
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

  // Plot derivative
  if (derivExpr) {
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let px = 0; px < width; px++) {
      const x = xMin + px / xScale;
      const y = safeEval(derivExpr, x);
      const py = yOrigin - y * yScale;

      if (px === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
  }

  // Mark evaluation point if specified
  if (evalPoint !== null && evalPoint !== undefined && !isNaN(evalPoint)) {
    const px = (evalPoint - xMin) * xScale;
    const y = safeEval(funcExpr, evalPoint);
    const py = yOrigin - y * yScale;

    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Update graph info
  const graphInfo = document.getElementById('deriv-graph-info');
  if (graphInfo) {
    graphInfo.innerHTML = `
      <div style="margin-top: 10px;">
        <span style="color: #3498db;">■ Original function f(x)</span><br>
        <span style="color: #e74c3c;">■ Derivative f'(x)</span>
        ${evalPoint !== null && !isNaN(evalPoint) ? `<br><span style="color: #2ecc71;">● Evaluation point (x=${evalPoint})</span>` : ''}
      </div>
    `;
  }
}

// Initialize calculator
export function initDerivativeCalculator() {
  const calculateBtn = document.getElementById('deriv-calculate');
  const resultDiv = document.getElementById('deriv-result');
  const stepsDiv = document.getElementById('deriv-steps');

  if (!calculateBtn) return;

  calculateBtn.addEventListener('click', () => {
    const funcInput = document.getElementById('deriv-function').value.trim();
    const variableInput = document.getElementById('deriv-variable').value.trim() || 'x';
    const orderInput = parseInt(document.getElementById('deriv-order').value) || 1;
    const evalPointInput = document.getElementById('deriv-eval-point').value.trim();

    if (!funcInput) {
      resultDiv.innerHTML = '<p class="error">Please enter a function.</p>';
      stepsDiv.innerHTML = '';
      return;
    }

    try {
      const differentiator = new SymbolicDifferentiator(variableInput);
      const result = differentiator.differentiate(funcInput, orderInput);

      resultDiv.innerHTML = `
        <h4>Result:</h4>
        <div class="result-box">
          <strong>f${"'".repeat(orderInput)}(${variableInput}) = ${result.derivative}</strong>
        </div>
      `;

      // If evaluation point provided
      if (evalPointInput) {
        const evalPoint = parseFloat(evalPointInput);
        const value = differentiator.evaluateAt(result.terms, evalPoint);
        resultDiv.innerHTML += `
          <div class="result-box" style="margin-top: 10px;">
            <strong>At ${variableInput} = ${evalPoint}:</strong><br>
            f${"'".repeat(orderInput)}(${evalPoint}) = ${value.toFixed(6)}
          </div>
        `;

        plotDerivativeGraph(funcInput, result.derivative, evalPoint);
      } else {
        plotDerivativeGraph(funcInput, result.derivative, null);
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
