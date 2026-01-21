/**
 * Critical Points Finder Module
 * Finds and classifies critical points using derivative tests
 */

// Simple symbolic differentiator for critical points
class CriticalPointsFinder {
  constructor(funcExpr, variable = 'x') {
    this.funcExpr = funcExpr;
    this.variable = variable;
    this.steps = [];
  }

  // Evaluate function at a point
  evaluateFunction(expr, x) {
    try {
      let evalExpr = expr.replace(/\^/g, '**');
      evalExpr = evalExpr.replace(/\*/g, '*');
      evalExpr = evalExpr.replace(/x/g, `(${x})`);

      // Handle common math functions
      evalExpr = evalExpr.replace(/sin\(/g, 'Math.sin(');
      evalExpr = evalExpr.replace(/cos\(/g, 'Math.cos(');
      evalExpr = evalExpr.replace(/tan\(/g, 'Math.tan(');
      evalExpr = evalExpr.replace(/sqrt\(/g, 'Math.sqrt(');
      evalExpr = evalExpr.replace(/ln\(/g, 'Math.log(');
      evalExpr = evalExpr.replace(/log\(/g, 'Math.log10(');
      evalExpr = evalExpr.replace(/exp\(/g, 'Math.exp(');
      evalExpr = evalExpr.replace(/abs\(/g, 'Math.abs(');

      return eval(evalExpr);
    } catch (e) {
      throw new Error(`Cannot evaluate expression at x=${x}: ${e.message}`);
    }
  }

  // Numerical derivative using central difference
  numericalDerivative(expr, x, h = 0.0001) {
    const fx_plus = this.evaluateFunction(expr, x + h);
    const fx_minus = this.evaluateFunction(expr, x - h);
    return (fx_plus - fx_minus) / (2 * h);
  }

  // Find approximate zeros of derivative using numerical methods
  findCriticalPoints(xMin, xMax, numSamples = 200) {
    this.steps.push('=== FINDING CRITICAL POINTS ===');
    this.steps.push(`Function: f(x) = ${this.funcExpr}`);
    this.steps.push('\nStep 1: Computing first derivative f\'(x)');

    const criticalPoints = [];
    const step = (xMax - xMin) / numSamples;

    // Sample the derivative across the range
    let prevDerivSign = null;
    let prevX = null;

    for (let i = 0; i <= numSamples; i++) {
      const x = xMin + i * step;

      try {
        const deriv = this.numericalDerivative(this.funcExpr, x);

        // Check for sign change (indicates zero crossing)
        if (prevDerivSign !== null) {
          const currentSign = Math.sign(deriv);

          // If derivative crosses zero or is very close to zero
          if (Math.abs(deriv) < 0.01 || (prevDerivSign !== 0 && currentSign !== 0 && prevDerivSign !== currentSign)) {
            // Refine the location using Newton's method
            const refinedX = this.refineZero(prevX, x);

            if (refinedX !== null) {
              // Check if this is a new critical point (not too close to existing ones)
              const isDuplicate = criticalPoints.some(cp => Math.abs(cp.x - refinedX) < 0.1);

              if (!isDuplicate) {
                const fx = this.evaluateFunction(this.funcExpr, refinedX);
                criticalPoints.push({ x: refinedX, y: fx });
              }
            }
          }
        }

        prevDerivSign = Math.sign(deriv);
        prevX = x;

      } catch (e) {
        continue;
      }
    }

    this.steps.push(`\nFound ${criticalPoints.length} critical point(s) where f'(x) ≈ 0:`);
    criticalPoints.forEach((cp, i) => {
      this.steps.push(`  Point ${i + 1}: x = ${cp.x.toFixed(4)}, f(x) = ${cp.y.toFixed(4)}`);
    });

    return criticalPoints;
  }

  // Refine zero location using bisection method
  refineZero(x1, x2, maxIterations = 20) {
    try {
      for (let i = 0; i < maxIterations; i++) {
        const xMid = (x1 + x2) / 2;
        const derivMid = this.numericalDerivative(this.funcExpr, xMid);

        if (Math.abs(derivMid) < 0.0001 || Math.abs(x2 - x1) < 0.0001) {
          return xMid;
        }

        const deriv1 = this.numericalDerivative(this.funcExpr, x1);

        if (Math.sign(deriv1) === Math.sign(derivMid)) {
          x1 = xMid;
        } else {
          x2 = xMid;
        }
      }

      return (x1 + x2) / 2;
    } catch (e) {
      return null;
    }
  }

  // Classify critical points using second derivative test
  classifyCriticalPoints(criticalPoints) {
    this.steps.push('\n=== CLASSIFYING CRITICAL POINTS ===');
    this.steps.push('Using Second Derivative Test:');

    const classified = [];

    for (const cp of criticalPoints) {
      try {
        // Compute second derivative numerically
        const h = 0.0001;
        const derivPlus = this.numericalDerivative(this.funcExpr, cp.x + h);
        const derivMinus = this.numericalDerivative(this.funcExpr, cp.x - h);
        const secondDeriv = (derivPlus - derivMinus) / (2 * h);

        let classification;
        let symbol;

        if (Math.abs(secondDeriv) < 0.01) {
          classification = 'Inconclusive (Second Derivative ≈ 0)';
          symbol = '?';

          // Try first derivative test
          const leftDeriv = this.numericalDerivative(this.funcExpr, cp.x - 0.1);
          const rightDeriv = this.numericalDerivative(this.funcExpr, cp.x + 0.1);

          if (leftDeriv > 0 && rightDeriv < 0) {
            classification = 'Local Maximum (First Derivative Test)';
            symbol = 'MAX';
          } else if (leftDeriv < 0 && rightDeriv > 0) {
            classification = 'Local Minimum (First Derivative Test)';
            symbol = 'MIN';
          }

        } else if (secondDeriv > 0) {
          classification = 'Local Minimum';
          symbol = 'MIN';
        } else {
          classification = 'Local Maximum';
          symbol = 'MAX';
        }

        this.steps.push(`\n  At x = ${cp.x.toFixed(4)}:`);
        this.steps.push(`    f(x) = ${cp.y.toFixed(4)}`);
        this.steps.push(`    f''(x) ≈ ${secondDeriv.toFixed(4)}`);
        this.steps.push(`    Classification: ${classification}`);

        classified.push({
          ...cp,
          secondDeriv,
          classification,
          symbol
        });

      } catch (e) {
        classified.push({
          ...cp,
          classification: 'Error',
          symbol: '?'
        });
      }
    }

    return classified;
  }

  // Find inflection points (where f''(x) = 0)
  findInflectionPoints(xMin, xMax, numSamples = 200) {
    this.steps.push('\n=== FINDING INFLECTION POINTS ===');
    this.steps.push('Looking for points where concavity changes (f\'\'(x) = 0)');

    const inflectionPoints = [];
    const step = (xMax - xMin) / numSamples;

    let prevSecondDerivSign = null;
    let prevX = null;

    for (let i = 0; i <= numSamples; i++) {
      const x = xMin + i * step;

      try {
        const h = 0.0001;
        const derivPlus = this.numericalDerivative(this.funcExpr, x + h);
        const derivMinus = this.numericalDerivative(this.funcExpr, x - h);
        const secondDeriv = (derivPlus - derivMinus) / (2 * h);

        // Check for sign change
        if (prevSecondDerivSign !== null) {
          const currentSign = Math.sign(secondDeriv);

          if (Math.abs(secondDeriv) < 0.01 || (prevSecondDerivSign !== 0 && currentSign !== 0 && prevSecondDerivSign !== currentSign)) {
            // Found potential inflection point
            const fx = this.evaluateFunction(this.funcExpr, x);

            // Check if not too close to existing points
            const isDuplicate = inflectionPoints.some(ip => Math.abs(ip.x - x) < 0.2);

            if (!isDuplicate) {
              inflectionPoints.push({ x, y: fx });
            }
          }
        }

        prevSecondDerivSign = Math.sign(secondDeriv);
        prevX = x;

      } catch (e) {
        continue;
      }
    }

    if (inflectionPoints.length > 0) {
      this.steps.push(`\nFound ${inflectionPoints.length} inflection point(s):`);
      inflectionPoints.forEach((ip, i) => {
        this.steps.push(`  Point ${i + 1}: x = ${ip.x.toFixed(4)}, f(x) = ${ip.y.toFixed(4)}`);
      });
    } else {
      this.steps.push('\nNo inflection points found in the given range.');
    }

    return inflectionPoints;
  }

  // Main analysis function
  analyze(xMin, xMax) {
    this.steps = [];

    // Find critical points
    const criticalPoints = this.findCriticalPoints(xMin, xMax);

    // Classify them
    const classified = this.classifyCriticalPoints(criticalPoints);

    // Find inflection points
    const inflectionPoints = this.findInflectionPoints(xMin, xMax);

    return {
      criticalPoints: classified,
      inflectionPoints,
      steps: this.steps
    };
  }
}

// Plot function with critical points marked
function plotCriticalPointsGraph(funcExpr, criticalPoints, inflectionPoints, xMin, xMax) {
  const canvas = document.getElementById('cp-graph');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Evaluate function to determine y-axis range
  const numPoints = 300;
  const xStep = (xMax - xMin) / numPoints;
  const yValues = [];

  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * xStep;
    try {
      const y = evaluateExpr(funcExpr, x);
      if (isFinite(y) && Math.abs(y) < 1000) {
        yValues.push(y);
      }
    } catch (e) {
      continue;
    }
  }

  if (yValues.length === 0) return;

  const yMin = Math.min(...yValues) - 1;
  const yMax = Math.max(...yValues) + 1;

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

  // Draw gridlines
  ctx.strokeStyle = '#f0f0f0';
  const xGridStep = (xMax - xMin) / 10;
  const yGridStep = (yMax - yMin) / 10;

  for (let i = 0; i <= 10; i++) {
    const x = xMin + i * xGridStep;
    const px = (x - xMin) * xScale;
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, height);
    ctx.stroke();

    const y = yMin + i * yGridStep;
    const py = yOrigin - y * yScale;
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(width, py);
    ctx.stroke();
  }

  // Plot function
  ctx.strokeStyle = '#3498db';
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  let firstPoint = true;

  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * xStep;
    try {
      const y = evaluateExpr(funcExpr, x);

      if (!isFinite(y) || Math.abs(y) > 1000) continue;

      const px = (x - xMin) * xScale;
      const py = yOrigin - y * yScale;

      if (firstPoint) {
        ctx.moveTo(px, py);
        firstPoint = false;
      } else {
        ctx.lineTo(px, py);
      }
    } catch (e) {
      continue;
    }
  }

  ctx.stroke();

  // Mark critical points
  criticalPoints.forEach(cp => {
    const px = (cp.x - xMin) * xScale;
    const py = yOrigin - cp.y * yScale;

    // Color based on classification
    let color;
    if (cp.symbol === 'MAX') {
      color = '#e74c3c'; // Red for maximum
    } else if (cp.symbol === 'MIN') {
      color = '#2ecc71'; // Green for minimum
    } else {
      color = '#f39c12'; // Orange for inconclusive
    }

    // Draw point
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(px, py, 7, 0, 2 * Math.PI);
    ctx.fill();

    // Draw border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw label
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 11px Arial';
    ctx.fillText(cp.symbol, px - 12, py - 12);
  });

  // Mark inflection points
  inflectionPoints.forEach(ip => {
    const px = (ip.x - xMin) * xScale;
    const py = yOrigin - ip.y * yScale;

    // Draw diamond shape
    ctx.fillStyle = '#9b59b6';
    ctx.beginPath();
    ctx.moveTo(px, py - 7);
    ctx.lineTo(px + 7, py);
    ctx.lineTo(px, py + 7);
    ctx.lineTo(px - 7, py);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw label
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('IP', px - 8, py - 12);
  });

  // Update graph info
  const graphInfo = document.getElementById('cp-graph-info');
  if (graphInfo) {
    graphInfo.innerHTML = `
      <div style="margin-top: 10px;">
        <span style="color: #3498db;">━ Function f(x)</span><br>
        <span style="color: #e74c3c;">● Local Maximum</span><br>
        <span style="color: #2ecc71;">● Local Minimum</span><br>
        <span style="color: #9b59b6;">◆ Inflection Point</span>
      </div>
    `;
  }
}

// Helper function to evaluate expression
function evaluateExpr(expr, x) {
  let evalExpr = expr.replace(/\^/g, '**');
  evalExpr = evalExpr.replace(/x/g, `(${x})`);
  evalExpr = evalExpr.replace(/sin\(/g, 'Math.sin(');
  evalExpr = evalExpr.replace(/cos\(/g, 'Math.cos(');
  evalExpr = evalExpr.replace(/tan\(/g, 'Math.tan(');
  evalExpr = evalExpr.replace(/sqrt\(/g, 'Math.sqrt(');
  evalExpr = evalExpr.replace(/ln\(/g, 'Math.log(');
  evalExpr = evalExpr.replace(/log\(/g, 'Math.log10(');
  evalExpr = evalExpr.replace(/exp\(/g, 'Math.exp(');
  evalExpr = evalExpr.replace(/abs\(/g, 'Math.abs(');

  return eval(evalExpr);
}

// Initialize calculator
export function initCriticalPointsCalculator() {
  const calculateBtn = document.getElementById('cp-calculate');
  const resultDiv = document.getElementById('cp-result');
  const stepsDiv = document.getElementById('cp-steps');

  if (!calculateBtn) return;

  calculateBtn.addEventListener('click', () => {
    const funcInput = document.getElementById('cp-function').value.trim();
    const variableInput = document.getElementById('cp-variable').value.trim() || 'x';
    const xMin = parseFloat(document.getElementById('cp-range-min').value);
    const xMax = parseFloat(document.getElementById('cp-range-max').value);

    if (!funcInput) {
      resultDiv.innerHTML = '<p class="error">Please enter a function.</p>';
      stepsDiv.innerHTML = '';
      return;
    }

    if (xMin >= xMax) {
      resultDiv.innerHTML = '<p class="error">Range min must be less than range max.</p>';
      stepsDiv.innerHTML = '';
      return;
    }

    try {
      const finder = new CriticalPointsFinder(funcInput, variableInput);
      const result = finder.analyze(xMin, xMax);

      // Display results
      let html = '<h4>Results:</h4>';

      // Critical Points
      if (result.criticalPoints.length > 0) {
        html += '<div class="result-box critical-points">';
        html += '<h5>Critical Points:</h5>';
        html += '<table class="points-table">';
        html += '<tr><th>x</th><th>f(x)</th><th>f\'\'(x)</th><th>Type</th></tr>';

        result.criticalPoints.forEach(cp => {
          const rowClass = cp.symbol === 'MAX' ? 'maximum' : cp.symbol === 'MIN' ? 'minimum' : 'inconclusive';
          html += `<tr class="${rowClass}">`;
          html += `<td>${cp.x.toFixed(4)}</td>`;
          html += `<td>${cp.y.toFixed(4)}</td>`;
          html += `<td>${cp.secondDeriv ? cp.secondDeriv.toFixed(4) : 'N/A'}</td>`;
          html += `<td><strong>${cp.classification}</strong></td>`;
          html += '</tr>';
        });

        html += '</table></div>';
      } else {
        html += '<div class="result-box">No critical points found in the given range.</div>';
      }

      // Inflection Points
      if (result.inflectionPoints.length > 0) {
        html += '<div class="result-box inflection-points">';
        html += '<h5>Inflection Points:</h5>';
        html += '<table class="points-table">';
        html += '<tr><th>x</th><th>f(x)</th></tr>';

        result.inflectionPoints.forEach(ip => {
          html += '<tr>';
          html += `<td>${ip.x.toFixed(4)}</td>`;
          html += `<td>${ip.y.toFixed(4)}</td>`;
          html += '</tr>';
        });

        html += '</table></div>';
      }

      resultDiv.innerHTML = html;

      // Show steps
      stepsDiv.innerHTML = `
        <h4>Step-by-Step Analysis:</h4>
        <div class="steps-box">
          <pre>${result.steps.join('\n')}</pre>
        </div>
      `;

      // Plot graph
      plotCriticalPointsGraph(funcInput, result.criticalPoints, result.inflectionPoints, xMin, xMax);

    } catch (error) {
      resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
      stepsDiv.innerHTML = '';
    }
  });

  // Trigger initial calculation
  calculateBtn.click();
}
