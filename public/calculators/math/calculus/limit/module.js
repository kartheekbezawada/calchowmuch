/**
 * Limit Calculator Module
 * Calculates limits numerically and symbolically
 */

import { expressionParser } from '../../../assets/js/core/expression-parser.js';

class LimitCalculator {
  constructor(variable = 'x') {
    this.variable = variable;
    this.steps = [];
  }

  // Evaluate function at a point using safe parser
  evaluateFunction(expr, value) {
    try {
      return expressionParser.evaluate(expr, value, 'x');
    } catch (e) {
      return NaN;
    }
  }

  // Calculate limit numerically
  calculateLimit(expr, a, direction = 'both', epsilon = 0.0001) {
    this.steps = [];

    // Parse 'a' - handle infinity
    let approachValue;
    let isInfinity = false;

    if (
      typeof a === 'string' &&
      (a.toLowerCase() === 'inf' || a.toLowerCase() === 'infinity' || a === '∞')
    ) {
      isInfinity = true;
      approachValue = Infinity;
    } else if (
      typeof a === 'string' &&
      (a.toLowerCase() === '-inf' || a.toLowerCase() === '-infinity' || a === '-∞')
    ) {
      isInfinity = true;
      approachValue = -Infinity;
    } else {
      approachValue = parseFloat(a);
    }

    this.steps.push(`Calculating lim[${this.variable}→${a}] f(${this.variable})`);
    this.steps.push(`Function: f(${this.variable}) = ${expr}\n`);

    // For infinity limits
    if (isInfinity) {
      return this.calculateInfinityLimit(expr, approachValue, direction);
    }

    // Check direct substitution
    const directValue = this.evaluateFunction(expr, approachValue);

    if (isFinite(directValue)) {
      this.steps.push('Direct substitution:');
      this.steps.push(`f(${approachValue}) = ${directValue.toFixed(6)}`);
      this.steps.push('\nFunction is continuous at this point.');
      this.steps.push(`Limit = ${directValue.toFixed(6)}`);

      return {
        value: directValue,
        exists: true,
        continuous: true,
        leftLimit: directValue,
        rightLimit: directValue,
        form: 'direct',
      };
    }

    this.steps.push('Direct substitution yields indeterminate form.');
    this.steps.push('Using numerical approximation...\n');

    // Numerical approach
    let leftLimit, rightLimit;

    if (direction === 'both' || direction === 'left') {
      leftLimit = this.numericalLimit(expr, approachValue, 'left', epsilon);
      this.steps.push(`Left-hand limit (x→${approachValue}⁻): ${leftLimit.toFixed(6)}`);
    }

    if (direction === 'both' || direction === 'right') {
      rightLimit = this.numericalLimit(expr, approachValue, 'right', epsilon);
      this.steps.push(`Right-hand limit (x→${approachValue}⁺): ${rightLimit.toFixed(6)}`);
    }

    // Determine if limit exists
    let limitExists, limitValue;

    if (direction === 'both') {
      const tolerance = 0.001;
      limitExists = Math.abs(leftLimit - rightLimit) < tolerance;

      if (limitExists) {
        limitValue = (leftLimit + rightLimit) / 2;
        this.steps.push(`\nBoth one-sided limits agree.`);
        this.steps.push(`Two-sided limit = ${limitValue.toFixed(6)}`);
      } else {
        this.steps.push(`\nLeft and right limits differ.`);
        this.steps.push(`Two-sided limit does not exist.`);
      }
    } else if (direction === 'left') {
      limitExists = isFinite(leftLimit);
      limitValue = leftLimit;
    } else {
      limitExists = isFinite(rightLimit);
      limitValue = rightLimit;
    }

    return {
      value: limitValue,
      exists: limitExists,
      continuous: false,
      leftLimit,
      rightLimit,
      form: isNaN(directValue) ? 'indeterminate' : 'undefined',
    };
  }

  // Numerical limit calculation
  numericalLimit(expr, a, direction, epsilon) {
    const steps = 10;
    let sum = 0;
    let count = 0;

    for (let i = 1; i <= steps; i++) {
      const h = epsilon / Math.pow(2, i);
      const x = direction === 'left' ? a - h : a + h;
      const value = this.evaluateFunction(expr, x);

      if (isFinite(value)) {
        sum += value;
        count++;
      }
    }

    return count > 0 ? sum / count : NaN;
  }

  // Calculate limit at infinity
  calculateInfinityLimit(expr, infinity, direction) {
    this.steps.push('Calculating limit at infinity using large values...\n');

    const sign = infinity > 0 ? 1 : -1;
    const values = [100, 1000, 10000, 100000].map((v) => v * sign);
    const results = values.map((v) => this.evaluateFunction(expr, v));

    this.steps.push('Sample values:');
    values.forEach((v, i) => {
      this.steps.push(`  f(${v}) = ${results[i].toFixed(6)}`);
    });

    // Check convergence
    const lastTwo = results.slice(-2);
    const convergenceCheck = Math.abs(lastTwo[1] - lastTwo[0]);

    let limitValue = lastTwo[1];

    if (convergenceCheck < 0.001) {
      this.steps.push(`\nFunction appears to converge to ${limitValue.toFixed(6)}`);
    } else if (!isFinite(limitValue)) {
      this.steps.push(`\nLimit is infinite or does not exist.`);
    } else {
      this.steps.push(`\nLimit ≈ ${limitValue.toFixed(6)}`);
    }

    return {
      value: limitValue,
      exists: isFinite(limitValue),
      continuous: false,
      form: 'infinity',
    };
  }
}

// Plot limit graph
// Initialize calculator
export function initLimitCalculator() {
  const calculateBtn = document.getElementById('limit-calculate');
  const resultDiv = document.getElementById('limit-result');
  const stepsDiv = document.getElementById('limit-steps');
  const directionButtons = document.querySelectorAll('.direction-button');

  let currentDirection = 'both';

  if (!calculateBtn) return;

  // Direction switching
  directionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      directionButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentDirection = btn.dataset.direction;
    });
  });

  calculateBtn.addEventListener('click', () => {
    const funcInput = document.getElementById('limit-function').value.trim();
    const variableInput = document.getElementById('limit-variable').value.trim() || 'x';
    const approachesInput = document.getElementById('limit-approaches').value.trim();

    if (!funcInput || !approachesInput) {
      resultDiv.innerHTML = '<p class="error">Please enter both function and approach value.</p>';
      stepsDiv.innerHTML = '';
      return;
    }

    try {
      const calculator = new LimitCalculator(variableInput);
      const result = calculator.calculateLimit(funcInput, approachesInput, currentDirection);

      let resultHTML = '<h4>Result:</h4>';

      if (result.exists) {
        resultHTML += `
          <div class="result-box success">
            <strong>lim[${variableInput}→${approachesInput}] f(${variableInput}) = ${result.value.toFixed(6)}</strong>
          </div>
        `;

        if (result.continuous) {
          resultHTML += `<p class="info-text">✓ Function is continuous at this point</p>`;
        }
      } else {
        resultHTML += `
          <div class="result-box error">
            <strong>Limit does not exist</strong>
          </div>
        `;

        if (
          currentDirection === 'both' &&
          isFinite(result.leftLimit) &&
          isFinite(result.rightLimit)
        ) {
          resultHTML += `
            <p class="info-text">Left limit: ${result.leftLimit.toFixed(6)}</p>
            <p class="info-text">Right limit: ${result.rightLimit.toFixed(6)}</p>
            <p class="info-text">⚠ One-sided limits differ</p>
          `;
        }
      }

      resultDiv.innerHTML = resultHTML;

      // Show steps
      stepsDiv.innerHTML = `
        <h4>Step-by-Step Analysis:</h4>
        <div class="steps-box">
          <pre>${calculator.steps.join('\n')}</pre>
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
