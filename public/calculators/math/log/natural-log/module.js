import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { calculateNaturalLog, drawLogCurve } from '/assets/js/core/logarithm.js';

const valueInput = document.querySelector('#ln-value');
const decimalsSelect = document.querySelector('#ln-decimals');
const resultDiv = document.querySelector('#ln-result');
const detailDiv = document.querySelector('#ln-detail');
const calculateBtn = document.querySelector('#ln-calculate');
const graphCanvas = document.querySelector('#ln-graph');
const graphNote = document.querySelector('#ln-graph-note');
const snapshotValue = document.querySelector('[data-ln-snap="value"]');
const snapshotResult = document.querySelector('[data-ln-snap="result"]');
const snapshotDecimals = document.querySelector('[data-ln-snap="decimals"]');
const snapshotSign = document.querySelector('[data-ln-snap="sign"]');

function updateSnapshots({ value = '-', result = '-', decimals = null, sign = '-' } = {}) {
  if (snapshotValue) {
    snapshotValue.textContent = String(value);
  }
  if (snapshotResult) {
    snapshotResult.textContent = String(result);
  }
  if (snapshotDecimals) {
    snapshotDecimals.textContent = String(decimals ?? decimalsSelect?.value ?? '4');
  }
  if (snapshotSign) {
    snapshotSign.textContent = String(sign);
  }
}

function showMessage(message) {
  resultDiv.textContent = message;
  detailDiv.textContent = '';
  updateSnapshots({ sign: 'Invalid input' });
  if (graphNote) {
    graphNote.textContent = 'Graph updates after you enter a valid positive x value.';
  }
  if (graphCanvas) {
    drawLogCurve(graphCanvas, Math.E, 1);
  }
}

function updateResults() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';
  updateSnapshots();

  if (!hasMaxDigits(valueInput.value, 12)) {
    showMessage('Inputs are limited to 12 digits.');
    return;
  }

  const x = toNumber(valueInput.value, 0);
  if (x === null || x <= 0) {
    showMessage('Enter a positive number greater than zero.');
    return;
  }

  const result = calculateNaturalLog(x);
  if (result === null) {
    showMessage('Unable to compute ln(x) for the given value.');
    return;
  }

  const decimals = Number(decimalsSelect.value) || 4;
  const formattedLn = formatNumber(result, { maximumFractionDigits: decimals });
  const formattedInput = formatNumber(x, { maximumFractionDigits: 6 });
  const expCheck = formatNumber(Math.exp(result), { maximumFractionDigits: 6 });
  const signLabel = result > 0 ? 'Positive' : result < 0 ? 'Negative' : 'Zero';

  resultDiv.innerHTML = `
    <article class="ln-summary-card">
      <h4>Natural Log Result</h4>
      <div class="ln-summary-grid">
        <div class="ln-stat">
          <span>Input</span>
          <strong>x = ${formattedInput}</strong>
        </div>
        <div class="ln-stat">
          <span>ln(x)</span>
          <strong>${formattedLn}</strong>
        </div>
        <div class="ln-stat">
          <span>Sign</span>
          <strong>${signLabel}</strong>
        </div>
        <div class="ln-stat">
          <span>Anchor check</span>
          <strong>${x === 1 ? 'ln(1) = 0' : x > 1 ? 'x > 1 so ln(x) is positive' : '0 < x < 1 so ln(x) is negative'}</strong>
        </div>
      </div>
    </article>
  `;

  detailDiv.innerHTML = `
    <article class="ln-detail-panel">
      <h4>Exponential Check</h4>
      <p><strong>ln(${formattedInput}) = ${formattedLn}</strong></p>
      <p><strong>e^${formattedLn} = ${expCheck}</strong></p>
      <p>The natural log answers which power of <strong>e</strong> gives your input value.</p>
    </article>
  `;

  updateSnapshots({
    value: formattedInput,
    result: formattedLn,
    decimals,
    sign: signLabel,
  });

  if (graphCanvas) {
    drawLogCurve(graphCanvas, Math.E, x);
  }
  if (graphNote) {
    graphNote.textContent = `Curve highlight is at x = ${formattedInput}, where ln(x) = ${formattedLn}.`;
  }
}

calculateBtn?.addEventListener('click', updateResults);
decimalsSelect?.addEventListener('change', updateResults);
valueInput?.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    updateResults();
  }
});

updateResults();
