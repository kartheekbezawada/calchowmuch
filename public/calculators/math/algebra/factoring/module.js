import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits } from '/assets/js/core/validate.js';
import {
  evaluatePolynomial,
  extractGcf,
  factorByGrouping,
  factorDifferenceOfSquares,
  factorQuadratic,
  factorSumDifferenceCubes,
  formatLinearFactor,
  formatPolynomial,
  formatPowerFactor,
  formatQuadraticFactor,
  parsePolynomial,
} from '/assets/js/core/algebra.js';

const polyInput = document.querySelector('#factor-poly');
const calculateButton = document.querySelector('#factor-calculate');
const resultDiv = document.querySelector('#factor-result');
const detailDiv = document.querySelector('#factor-detail');
const graphContainer = document.querySelector('#factor-graph-container');
const graphCanvas = document.querySelector('#factor-graph');
const methodGcf = document.querySelector('#method-gcf');
const methodQuadratic = document.querySelector('#method-quadratic');
const methodDifference = document.querySelector('#method-difference');
const methodSumDifference = document.querySelector('#method-sum-difference');
const methodGrouping = document.querySelector('#method-grouping');

function validatePolynomialInput(input) {
  const tokens = input.match(/-?\d*\.?\d+/g) || [];
  const invalidToken = tokens.find((token) => !hasMaxDigits(token, 12));
  return invalidToken ? 'Numeric values are limited to 12 digits.' : null;
}

function getGraphBounds(coeffs, range = 10) {
  let minY = Infinity;
  let maxY = -Infinity;
  for (let x = -range; x <= range; x += 0.5) {
    const y = evaluatePolynomial(coeffs, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  if (!Number.isFinite(minY) || !Number.isFinite(maxY)) {
    minY = -10;
    maxY = 10;
  }
  if (minY === maxY) {
    minY -= 5;
    maxY += 5;
  }
  const padding = (maxY - minY) * 0.1;
  return { minY: minY - padding, maxY: maxY + padding, range };
}

function drawPolynomialGraph(coeffs) {
  const ctx = graphCanvas.getContext('2d');
  const width = graphCanvas.width;
  const height = graphCanvas.height;
  const bounds = getGraphBounds(coeffs);
  const xMin = -bounds.range;
  const xMax = bounds.range;
  const yMin = bounds.minY;
  const yMax = bounds.maxY;
  const xScale = width / (xMax - xMin);
  const yScale = height / (yMax - yMin);

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x += 1) {
    const canvasX = (x - xMin) * xScale;
    ctx.beginPath();
    ctx.moveTo(canvasX, 0);
    ctx.lineTo(canvasX, height);
    ctx.stroke();
  }
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += 1) {
    const canvasY = height - (y - yMin) * yScale;
    ctx.beginPath();
    ctx.moveTo(0, canvasY);
    ctx.lineTo(width, canvasY);
    ctx.stroke();
  }

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  const xAxisY = height - (0 - yMin) * yScale;
  if (xAxisY >= 0 && xAxisY <= height) {
    ctx.beginPath();
    ctx.moveTo(0, xAxisY);
    ctx.lineTo(width, xAxisY);
    ctx.stroke();
  }
  const yAxisX = (0 - xMin) * xScale;
  if (yAxisX >= 0 && yAxisX <= width) {
    ctx.beginPath();
    ctx.moveTo(yAxisX, 0);
    ctx.lineTo(yAxisX, height);
    ctx.stroke();
  }

  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 3;
  ctx.beginPath();
  let started = false;
  for (let canvasX = 0; canvasX <= width; canvasX += 1) {
    const x = xMin + (canvasX / width) * (xMax - xMin);
    const y = evaluatePolynomial(coeffs, x);
    const canvasY = height - (y - yMin) * yScale;
    if (!started) {
      ctx.moveTo(canvasX, canvasY);
      started = true;
    } else {
      ctx.lineTo(canvasX, canvasY);
    }
  }
  ctx.stroke();

  graphContainer.style.display = 'block';
}

function formatGcfLabel(gcf) {
  const coeff = gcf.gcfCoeff === 1 ? '' : formatNumber(gcf.gcfCoeff);
  if (gcf.gcfPower === 0) {
    return coeff || '1';
  }
  const power = gcf.gcfPower === 1 ? 'x' : `x^${gcf.gcfPower}`;
  return `${coeff}${power}`;
}

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';
  graphContainer.style.display = 'none';

  const inputText = polyInput.value || '';
  const validationError = validatePolynomialInput(inputText);
  if (validationError) {
    resultDiv.textContent = validationError;
    return;
  }

  const parsed = parsePolynomial(inputText);
  if (parsed.errors.length) {
    resultDiv.textContent = `Invalid terms: ${parsed.errors.join(', ')}`;
    return;
  }

  let workingCoeffs = parsed.coeffs;
  const factors = [];
  const steps = [];

  if (methodGcf.checked) {
    const gcf = extractGcf(workingCoeffs);
    if (gcf) {
      factors.push(formatGcfLabel(gcf));
      steps.push(`Extract GCF: ${formatGcfLabel(gcf)} × (${formatPolynomial(gcf.remaining)})`);
      workingCoeffs = gcf.remaining;
    }
  }

  let factored = null;

  if (!factored && methodQuadratic.checked) {
    const quad = factorQuadratic(workingCoeffs);
    if (quad) {
      factored = {
        label: 'Quadratic factoring',
        factors: quad.factors.map((factor) => formatLinearFactor(factor)),
      };
    }
  }

  if (!factored && methodDifference.checked) {
    const diff = factorDifferenceOfSquares(workingCoeffs);
    if (diff) {
      factored = {
        label: 'Difference of squares',
        factors: diff.factors.map((factor) => formatPowerFactor(factor)),
      };
    }
  }

  if (!factored && methodSumDifference.checked) {
    const cubes = factorSumDifferenceCubes(workingCoeffs);
    if (cubes) {
      const linear = formatLinearFactor(cubes.factors[0]);
      const quadratic = formatQuadraticFactor(cubes.factors[1]);
      factored = {
        label: 'Sum/Difference of cubes',
        factors: [linear, quadratic],
      };
    }
  }

  if (!factored && methodGrouping.checked) {
    const grouping = factorByGrouping(workingCoeffs);
    if (grouping) {
      const quadratic = formatQuadraticFactor(grouping.factors[0]);
      const linear = formatLinearFactor(grouping.factors[1]);
      factored = {
        label: 'Factoring by grouping',
        factors: [quadratic, linear],
      };
    }
  }

  if (factored) {
    factors.push(...factored.factors);
    steps.push(`${factored.label}: ${factored.factors.join(' ')}`);
    resultDiv.innerHTML = `<strong>Factored Form:</strong> ${factors.join(' ')}`;
  } else {
    resultDiv.innerHTML = `<strong>Factored Form:</strong> ${factors.length ? `${factors.join(' ')} (${formatPolynomial(workingCoeffs)})` : formatPolynomial(workingCoeffs)}`;
    steps.push('No additional factoring found with selected methods.');
  }

  detailDiv.innerHTML = `
    <p><strong>Original Polynomial:</strong> ${formatPolynomial(parsed.coeffs)}</p>
    <p><strong>Steps:</strong></p>
    <ul>${steps.map((step) => `<li>${step}</li>`).join('')}</ul>
  `;

  drawPolynomialGraph(parsed.coeffs);
}

calculateButton.addEventListener('click', calculate);

calculate();
