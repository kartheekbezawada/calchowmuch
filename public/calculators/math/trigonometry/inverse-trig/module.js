import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import {
  degToRad,
  formatAnglePair,
  getInverseTrigSolutions,
  radToDeg,
} from '/assets/js/core/trigonometry.js';

const valueInput = document.querySelector('#inv-value');
const functionSelect = document.querySelector('#inv-function');
const unitGroup = document.querySelector('[data-button-group="inv-output-unit"]');
const unitButtons = setupButtonGroup(unitGroup, { defaultValue: 'deg' });
const startInput = document.querySelector('#inv-interval-start');
const endInput = document.querySelector('#inv-interval-end');
const calcButton = document.querySelector('#inv-calc');
const resultDiv = document.querySelector('#inv-result');
const detailDiv = document.querySelector('#inv-detail');
const snapshotFunction = document.querySelector('[data-inv-snap="function"]');
const snapshotUnit = document.querySelector('[data-inv-snap="unit"]');
const snapshotPrincipal = document.querySelector('[data-inv-snap="principal"]');
const snapshotCount = document.querySelector('[data-inv-snap="count"]');

function toRadians(value) {
  const unit = unitButtons?.getValue() ?? 'deg';
  return unit === 'deg' ? degToRad(value) : value;
}

function formatSolution(value) {
  return formatAnglePair(radToDeg(value), { normalize: false });
}

function updateSnapshots(result) {
  if (snapshotFunction) {
    snapshotFunction.textContent = functionSelect.value;
  }
  if (snapshotUnit) {
    snapshotUnit.textContent = (unitButtons?.getValue() ?? 'deg') === 'deg' ? 'Degrees' : 'Radians';
  }
  if (snapshotPrincipal) {
    snapshotPrincipal.textContent = result ? formatSolution(result.principal) : '-';
  }
  if (snapshotCount) {
    snapshotCount.textContent = result ? String(result.solutions.length) : '-';
  }
}

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';
  updateSnapshots(null);

  const inputs = [valueInput, startInput, endInput];
  if (inputs.find((input) => !hasMaxDigits(input.value, 12))) {
    resultDiv.textContent = 'Inputs are limited to 12 digits.';
    return;
  }

  const rawValue = toNumber(valueInput.value, 0);
  const func = functionSelect.value;
  const start = toNumber(startInput.value, -360);
  const end = toNumber(endInput.value, 360);

  if (start === end) {
    resultDiv.textContent = 'Interval start and end must differ.';
    return;
  }

  const startRad = toRadians(Math.min(start, end));
  const endRad = toRadians(Math.max(start, end));

  const result = getInverseTrigSolutions(func, rawValue, startRad, endRad);
  if (result.error) {
    resultDiv.textContent = result.error;
    return;
  }

  updateSnapshots(result);
  const principalDegrees = radToDeg(result.principal);
  const domainLabel =
    func === 'arctan' ? 'Any real input is allowed.' : 'Input must stay between -1 and 1.';

  const resultHtml = `
    <article class="inv-value-card">
      <h4>Principal Value</h4>
      <div class="inv-value-grid">
        <div class="inv-value-cell">
          <span>Function</span>
          <p>${func}(x) = ${formatNumber(rawValue, { maximumFractionDigits: 6 })}</p>
        </div>
        <div class="inv-value-cell">
          <span>Principal angle</span>
          <p>${formatAnglePair(principalDegrees, { normalize: false })}</p>
        </div>
        <div class="inv-value-cell">
          <span>Interval</span>
          <p>${formatNumber(Math.min(start, end), { maximumFractionDigits: 6 })} to ${formatNumber(Math.max(start, end), { maximumFractionDigits: 6 })}</p>
        </div>
        <div class="inv-value-cell">
          <span>Domain note</span>
          <p>${domainLabel}</p>
        </div>
      </div>
    </article>
  `;

  const solutionItems = result.solutions
    .map((value) => `<li>${formatSolution(value)}</li>`)
    .join('');

  const detailHtml = `
    <article class="inv-method-card">
      <h4>Solutions in Interval</h4>
      <ul class="inv-solution-list">${solutionItems || '<li>No solutions in the interval.</li>'}</ul>
      <p class="inv-method-note">
        Principal ranges: arcsin returns -90 to 90 degrees, arccos returns 0 to 180 degrees, and
        arctan returns a centered angle range that repeats every 180 degrees.
      </p>
    </article>
  `;

  resultDiv.innerHTML = resultHtml;
  detailDiv.innerHTML = detailHtml;
}

calcButton.addEventListener('click', calculate);
[valueInput, startInput, endInput, functionSelect].forEach((input) => {
  input.addEventListener('input', calculate);
});
unitGroup?.addEventListener('click', calculate);

calculate();
