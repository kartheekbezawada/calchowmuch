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

function validateInputs(inputs) {
  const invalidLength = inputs.find((input) => !hasMaxDigits(input.value, 12));
  if (invalidLength) {
    return 'Inputs are limited to 12 digits.';
  }
  return null;
}

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

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
}

calculateButton.addEventListener('click', calculate);

calculate();
