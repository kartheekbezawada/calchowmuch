import { setupButtonGroup } from '/assets/js/core/ui.js';
import { hasMaxDigits } from '/assets/js/core/validate.js';
import {
  addPolynomials,
  dividePolynomials,
  evaluatePolynomial,
  formatPolynomial,
  multiplyPolynomials,
  parsePolynomial,
  subtractPolynomials,
} from '/assets/js/core/algebra.js';

const operationGroup = setupButtonGroup(document.querySelector('[data-button-group="poly-operation"]'), {
  defaultValue: 'add',
});
const poly1Input = document.querySelector('#poly1');
const poly2Input = document.querySelector('#poly2');
const calculateButton = document.querySelector('#calculate-poly');
const resultDiv = document.querySelector('#poly-result');
const detailDiv = document.querySelector('#poly-detail');
const graphContainer = document.querySelector('#poly-graph-container');
const graphCanvas = document.querySelector('#poly-graph');

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

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';
  graphContainer.style.display = 'none';

  const op = operationGroup.getValue();
  const poly1Text = poly1Input.value || '';
  const poly2Text = poly2Input.value || '';

  const validationError = validatePolynomialInput(poly1Text) || validatePolynomialInput(poly2Text);
  if (validationError) {
    resultDiv.textContent = validationError;
    return;
  }

  const parsed1 = parsePolynomial(poly1Text);
  const parsed2 = parsePolynomial(poly2Text);

  if (parsed1.errors.length) {
    resultDiv.textContent = `Invalid terms in Polynomial 1: ${parsed1.errors.join(', ')}`;
    return;
  }
  if (parsed2.errors.length) {
    resultDiv.textContent = `Invalid terms in Polynomial 2: ${parsed2.errors.join(', ')}`;
    return;
  }

  const poly1 = parsed1.coeffs;
  const poly2 = parsed2.coeffs;

  let result;
  let summary = '';
  let steps = '';

  if (op === 'add') {
    result = addPolynomials(poly1, poly2);
    summary = `${formatPolynomial(poly1)} + ${formatPolynomial(poly2)}`;
    steps = 'Combine like terms by adding coefficients of matching powers.';
  } else if (op === 'subtract') {
    result = subtractPolynomials(poly1, poly2);
    summary = `${formatPolynomial(poly1)} - (${formatPolynomial(poly2)})`;
    steps = 'Subtract coefficients of matching powers.';
  } else if (op === 'multiply') {
    result = multiplyPolynomials(poly1, poly2);
    summary = `${formatPolynomial(poly1)} × ${formatPolynomial(poly2)}`;
    steps = 'Distribute each term and combine like terms.';
  } else {
    const division = dividePolynomials(poly1, poly2);
    if (!division) {
      resultDiv.textContent = 'Cannot divide by a zero polynomial.';
      return;
    }
    resultDiv.innerHTML = `
      <strong>Quotient:</strong> ${formatPolynomial(division.quotient)}<br />
      <strong>Remainder:</strong> ${formatPolynomial(division.remainder)}
    `;
    detailDiv.innerHTML = `
      <p><strong>Dividend:</strong> ${formatPolynomial(poly1)}</p>
      <p><strong>Divisor:</strong> ${formatPolynomial(poly2)}</p>
      <p><strong>Process:</strong> Polynomial long division.</p>
    `;
    return;
  }

  resultDiv.innerHTML = `<strong>Result:</strong> ${formatPolynomial(result)}`;
  detailDiv.innerHTML = `
    <p><strong>Operation:</strong> ${summary}</p>
    <p><strong>Steps:</strong> ${steps}</p>
    <p><strong>Result:</strong> ${formatPolynomial(result)}</p>
  `;

  drawPolynomialGraph(result);
}

calculateButton.addEventListener('click', calculate);

calculate();
