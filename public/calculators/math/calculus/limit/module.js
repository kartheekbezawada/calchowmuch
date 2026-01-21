/**
 * Limit Calculator Module
 * Calculates limits numerically and symbolically
 */

class LimitCalculator {
  constructor(variable = 'x') {
    this.variable = variable;
    this.steps = [];
  }

  // Evaluate function at a point
  evaluateFunction(expr, value) {
    try {
      // Replace variable with value
      let evalExpr = expr.replace(/\^/g, '**');
      evalExpr = evalExpr.replace(/x/g, `(${value})`);

      // Handle common functions
      evalExpr = evalExpr.replace(/sin/g, 'Math.sin');
      evalExpr = evalExpr.replace(/cos/g, 'Math.cos');
      evalExpr = evalExpr.replace(/tan/g, 'Math.tan');
      evalExpr = evalExpr.replace(/ln/g, 'Math.log');
      evalExpr = evalExpr.replace(/log/g, 'Math.log10');
      evalExpr = evalExpr.replace(/sqrt/g, 'Math.sqrt');
      evalExpr = evalExpr.replace(/abs/g, 'Math.abs');

      return eval(evalExpr);
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

    if (typeof a === 'string' && (a.toLowerCase() === 'inf' || a.toLowerCase() === 'infinity' || a === '∞')) {
      isInfinity = true;
      approachValue = Infinity;
    } else if (typeof a === 'string' && (a.toLowerCase() === '-inf' || a.toLowerCase() === '-infinity' || a === '-∞')) {
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
        form: 'direct'
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
      form: isNaN(directValue) ? 'indeterminate' : 'undefined'
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
    const values = [100, 1000, 10000, 100000].map(v => v * sign);
    const results = values.map(v => this.evaluateFunction(expr, v));

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
      form: 'infinity'
    };
  }
}

// Plot limit graph
function plotLimitGraph(funcExpr, approachValue, leftLimit, rightLimit) {
  const canvas = document.getElementById('limit-graph');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Set up coordinate system
  const a = parseFloat(approachValue) || 0;
  const xMin = Math.max(-10, a - 5);
  const xMax = Math.min(10, a + 5);
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

  // Draw vertical line at x = a
  const aPx = (a - xMin) * xScale;
  ctx.strokeStyle = '#95a5a6';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(aPx, 0);
  ctx.lineTo(aPx, height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Helper to evaluate function
  const safeEval = (expr, x) => {
    try {
      expr = expr.replace(/\^/g, '**');
      expr = expr.replace(/x/g, `(${x})`);
      expr = expr.replace(/sin/g, 'Math.sin');
      expr = expr.replace(/cos/g, 'Math.cos');
      return eval(expr);
    } catch (e) {
      return NaN;
    }
  };

  // Plot function (skip discontinuity)
  ctx.strokeStyle = '#3498db';
  ctx.lineWidth = 2;
  ctx.beginPath();

  let started = false;

  for (let px = 0; px < width; px++) {
    const x = xMin + px / xScale;

    // Skip near discontinuity
    if (Math.abs(x - a) < 0.1) continue;

    const y = safeEval(funcExpr, x);
    const py = yOrigin - y * yScale;

    if (isFinite(y) && py >= 0 && py <= height) {
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    } else {
      started = false;
    }
  }
  ctx.stroke();

  // Mark limits with open circles
  if (isFinite(leftLimit)) {
    const ly = yOrigin - leftLimit * yScale;
    ctx.strokeStyle = '#2ecc71';
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(aPx - 5, ly, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  if (isFinite(rightLimit)) {
    const ry = yOrigin - rightLimit * yScale;
    ctx.strokeStyle = '#e74c3c';
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(aPx + 5, ry, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  // Update graph info
  const graphInfo = document.getElementById('limit-graph-info');
  if (graphInfo) {
    graphInfo.innerHTML = `
      <div style="margin-top: 10px;">
        <span style="color: #3498db;">■ Function f(x)</span><br>
        <span style="color: #95a5a6;">| x = ${a} (approach point)</span>
        ${isFinite(leftLimit) ? `<br><span style="color: #2ecc71;">○ Left limit = ${leftLimit.toFixed(4)}</span>` : ''}
        ${isFinite(rightLimit) ? `<br><span style="color: #e74c3c;">○ Right limit = ${rightLimit.toFixed(4)}</span>` : ''}
      </div>
    `;
  }
}

// Initialize calculator
export function initLimitCalculator() {
  const calculateBtn = document.getElementById('limit-calculate');
  const resultDiv = document.getElementById('limit-result');
  const stepsDiv = document.getElementById('limit-steps');
  const directionButtons = document.querySelectorAll('.direction-button');

  let currentDirection = 'both';

  if (!calculateBtn) return;

  // Direction switching
  directionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      directionButtons.forEach(b => b.classList.remove('active'));
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

        if (currentDirection === 'both' && isFinite(result.leftLimit) && isFinite(result.rightLimit)) {
          resultHTML += `
            <p class="info-text">Left limit: ${result.leftLimit.toFixed(6)}</p>
            <p class="info-text">Right limit: ${result.rightLimit.toFixed(6)}</p>
            <p class="info-text">⚠ One-sided limits differ</p>
          `;
        }
      }

      resultDiv.innerHTML = resultHTML;

      // Plot graph
      if (result.form !== 'infinity') {
        plotLimitGraph(funcInput, approachesInput, result.leftLimit, result.rightLimit);
      }

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
