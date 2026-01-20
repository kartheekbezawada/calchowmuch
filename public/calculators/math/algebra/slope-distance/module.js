import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { calculateSlopeDistance } from '/assets/js/core/algebra.js';

const x1Input = document.querySelector('#x1');
const y1Input = document.querySelector('#y1');
const x2Input = document.querySelector('#x2');
const y2Input = document.querySelector('#y2');
const calculateButton = document.querySelector('#calculate-slope');
const resultDiv = document.querySelector('#slope-result');
const detailDiv = document.querySelector('#slope-detail');
const graphContainer = document.querySelector('#slope-graph-container');
const graphCanvas = document.querySelector('#slope-graph');

function validateInputs(inputs) {
  const invalidLength = inputs.find((input) => !hasMaxDigits(input.value, 12));
  if (invalidLength) {
    return 'Inputs are limited to 12 digits.';
  }
  return null;
}

function drawLineGraph(x1, y1, x2, y2, slope) {
  const ctx = graphCanvas.getContext('2d');
  const width = graphCanvas.width;
  const height = graphCanvas.height;
  ctx.clearRect(0, 0, width, height);

  const minX = Math.min(x1, x2) - 2;
  const maxX = Math.max(x1, x2) + 2;
  const minY = Math.min(y1, y2) - 2;
  const maxY = Math.max(y1, y2) + 2;
  const xScale = width / (maxX - minX);
  const yScale = height / (maxY - minY);

  function toCanvas(x, y) {
    return {
      x: (x - minX) * xScale,
      y: height - (y - minY) * yScale,
    };
  }

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  for (let x = Math.ceil(minX); x <= Math.floor(maxX); x += 1) {
    const canvasX = (x - minX) * xScale;
    ctx.beginPath();
    ctx.moveTo(canvasX, 0);
    ctx.lineTo(canvasX, height);
    ctx.stroke();
  }
  for (let y = Math.ceil(minY); y <= Math.floor(maxY); y += 1) {
    const canvasY = height - (y - minY) * yScale;
    ctx.beginPath();
    ctx.moveTo(0, canvasY);
    ctx.lineTo(width, canvasY);
    ctx.stroke();
  }

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  const xAxisY = height - (0 - minY) * yScale;
  if (xAxisY >= 0 && xAxisY <= height) {
    ctx.beginPath();
    ctx.moveTo(0, xAxisY);
    ctx.lineTo(width, xAxisY);
    ctx.stroke();
  }
  const yAxisX = (0 - minX) * xScale;
  if (yAxisX >= 0 && yAxisX <= width) {
    ctx.beginPath();
    ctx.moveTo(yAxisX, 0);
    ctx.lineTo(yAxisX, height);
    ctx.stroke();
  }

  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (slope === null) {
    const x = x1;
    const pos1 = toCanvas(x, minY);
    const pos2 = toCanvas(x, maxY);
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(pos2.x, pos2.y);
  } else {
    const pos1 = toCanvas(minX, y1 + slope * (minX - x1));
    const pos2 = toCanvas(maxX, y1 + slope * (maxX - x1));
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(pos2.x, pos2.y);
  }
  ctx.stroke();

  ctx.fillStyle = '#16a34a';
  const p1 = toCanvas(x1, y1);
  const p2 = toCanvas(x2, y2);
  ctx.beginPath();
  ctx.arc(p1.x, p1.y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(p2.x, p2.y, 5, 0, 2 * Math.PI);
  ctx.fill();

  graphContainer.style.display = 'block';
}

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';
  graphContainer.style.display = 'none';

  const inputs = [x1Input, y1Input, x2Input, y2Input];
  const lengthError = validateInputs(inputs);
  if (lengthError) {
    resultDiv.textContent = lengthError;
    return;
  }

  const x1 = toNumber(x1Input.value, 0);
  const y1 = toNumber(y1Input.value, 0);
  const x2 = toNumber(x2Input.value, 0);
  const y2 = toNumber(y2Input.value, 0);

  const props = calculateSlopeDistance(x1, y1, x2, y2);
  const slopeText = props.slope === null
    ? 'Undefined (vertical line)'
    : formatNumber(props.slope, { maximumFractionDigits: 6 });

  const distanceText = formatNumber(props.distance, { maximumFractionDigits: 6 });
  const midpointText = `(${formatNumber(props.midpoint.x, { maximumFractionDigits: 6 })}, ${formatNumber(props.midpoint.y, { maximumFractionDigits: 6 })})`;

  let slopeInterceptText = 'Not available (vertical line)';
  let pointSlopeText = 'x = ' + formatNumber(x1, { maximumFractionDigits: 6 });
  let standardText = 'x = ' + formatNumber(x1, { maximumFractionDigits: 6 });

  if (props.slope !== null) {
    const b = props.slopeIntercept.b;
    slopeInterceptText = `y = ${formatNumber(props.slope, { maximumFractionDigits: 6 })}x + ${formatNumber(b, { maximumFractionDigits: 6 })}`;
    pointSlopeText = `y - ${formatNumber(y1, { maximumFractionDigits: 6 })} = ${formatNumber(props.slope, { maximumFractionDigits: 6 })}(x - ${formatNumber(x1, { maximumFractionDigits: 6 })})`;
    const A = props.slope;
    const C = -b;
    standardText = `${formatNumber(A, { maximumFractionDigits: 6 })}x - y = ${formatNumber(C, { maximumFractionDigits: 6 })}`;
  }

  let parallelText = pointSlopeText;
  let perpendicularText = '';
  if (props.slope === null) {
    parallelText = `x = ${formatNumber(x1, { maximumFractionDigits: 6 })}`;
    perpendicularText = `y = ${formatNumber(y1, { maximumFractionDigits: 6 })}`;
  } else if (props.slope === 0) {
    parallelText = `y = ${formatNumber(y1, { maximumFractionDigits: 6 })}`;
    perpendicularText = `x = ${formatNumber(x1, { maximumFractionDigits: 6 })}`;
  } else {
    const perpSlope = -1 / props.slope;
    perpendicularText = `y - ${formatNumber(y1, { maximumFractionDigits: 6 })} = ${formatNumber(perpSlope, { maximumFractionDigits: 6 })}(x - ${formatNumber(x1, { maximumFractionDigits: 6 })})`;
  }

  resultDiv.innerHTML = `
    <strong>Slope:</strong> ${slopeText}<br />
    <strong>Distance:</strong> ${distanceText}<br />
    <strong>Midpoint:</strong> ${midpointText}
  `;

  detailDiv.innerHTML = `
    <div class="line-equations">
      <h4>Line Equations</h4>
      <div class="equation-form"><strong>Slope-Intercept:</strong> ${slopeInterceptText}</div>
      <div class="equation-form"><strong>Point-Slope:</strong> ${pointSlopeText}</div>
      <div class="equation-form"><strong>Standard Form:</strong> ${standardText}</div>
    </div>
    <div class="line-equations">
      <h4>Parallel & Perpendicular</h4>
      <div class="equation-form"><strong>Parallel (through Point 1):</strong> ${parallelText}</div>
      <div class="equation-form"><strong>Perpendicular (through Point 1):</strong> ${perpendicularText}</div>
    </div>
  `;

  drawLineGraph(x1, y1, x2, y2, props.slope);
}

calculateButton.addEventListener('click', calculate);

calculate();
