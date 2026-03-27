import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { calculateLogBase, calculateLogChangeOfBase, drawLogCurve } from '/assets/js/core/logarithm.js';

const valueInput = document.querySelector('#log-value');
const baseSelect = document.querySelector('#log-base');
const customRow = document.querySelector('#log-custom-row');
const customBaseInput = document.querySelector('#log-custom-base');
const calculateBtn = document.querySelector('#log-calculate');
const resultDiv = document.querySelector('#log-result');
const detailDiv = document.querySelector('#log-detail');
const changeDiv = document.querySelector('#log-change');
const graphCanvas = document.querySelector('#log-graph');
const graphNote = document.querySelector('#log-graph-note');
const snapshotValue = document.querySelector('[data-log-snap="value"]');
const snapshotBase = document.querySelector('[data-log-snap="base"]');
const snapshotResult = document.querySelector('[data-log-snap="result"]');
const snapshotStatus = document.querySelector('[data-log-snap="status"]');

function getSelectedBase() {
  const value = baseSelect.value;
  if (value === 'custom') {
    return Number(customBaseInput.value);
  }
  if (value === 'Math.E') {
    return Math.E;
  }
  return Number(value);
}

function getBaseLabel(base) {
  if (!Number.isFinite(base)) {
    return '-';
  }
  if (Math.abs(base - Math.E) < 1e-10) {
    return 'e';
  }
  return formatNumber(base, { maximumFractionDigits: 4 });
}

function updateSnapshots({ value = '-', base = '-', result = '-', status = '-' } = {}) {
  if (snapshotValue) {
    snapshotValue.textContent = String(value);
  }
  if (snapshotBase) {
    snapshotBase.textContent = String(base);
  }
  if (snapshotResult) {
    snapshotResult.textContent = String(result);
  }
  if (snapshotStatus) {
    snapshotStatus.textContent = String(status);
  }
}

function toggleCustomRow() {
  customRow.hidden = baseSelect.value !== 'custom';
}

function showMessage(message) {
  resultDiv.textContent = message;
  detailDiv.textContent = '';
  changeDiv.textContent = '';
  updateSnapshots({ status: 'Invalid input' });
  if (graphCanvas) {
    drawLogCurve(graphCanvas, 10, 1);
  }
  if (graphNote) {
    graphNote.textContent = 'Graph updates after you enter a valid positive argument and base.';
  }
}

function updateResults() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';
  changeDiv.textContent = '';
  updateSnapshots();

  if (!hasMaxDigits(valueInput.value, 12)) {
    showMessage('Argument values are limited to 12 digits.');
    return;
  }

  const value = toNumber(valueInput.value, 0);
  const base = getSelectedBase();

  if (!value || value <= 0) {
    showMessage('Enter a positive argument.');
    return;
  }

  if (!base || base <= 0 || base === 1) {
    showMessage('Base must be positive and not equal to 1.');
    return;
  }

  const result = calculateLogBase(value, base);
  if (result === null) {
    showMessage('Unable to compute logarithm with the current inputs.');
    return;
  }

  const formattedValue = formatNumber(value, { maximumFractionDigits: 6 });
  const formattedBase = getBaseLabel(base);
  const formattedResult = formatNumber(result, { maximumFractionDigits: 6 });

  resultDiv.innerHTML = `
    <article class="clog-summary-card">
      <h4>Selected Log Result</h4>
      <div class="clog-summary-grid">
        <div class="clog-stat">
          <span>Argument</span>
          <strong>x = ${formattedValue}</strong>
        </div>
        <div class="clog-stat">
          <span>Base</span>
          <strong>${formattedBase}</strong>
        </div>
        <div class="clog-stat">
          <span>log_b(x)</span>
          <strong>${formattedResult}</strong>
        </div>
        <div class="clog-stat">
          <span>Meaning</span>
          <strong>${formattedBase}^${formattedResult} = ${formattedValue}</strong>
        </div>
      </div>
    </article>
  `;

  detailDiv.innerHTML = `
    <article class="clog-detail-panel">
      <h4>Selected Base Interpretation</h4>
      <p><strong>log_${formattedBase}(${formattedValue}) = ${formattedResult}</strong></p>
      <p>The logarithm tells you which power of <strong>${formattedBase}</strong> produces <strong>${formattedValue}</strong>.</p>
    </article>
  `;

  const change = calculateLogChangeOfBase(value, base, 10);
  if (change) {
    changeDiv.innerHTML = `
      <article class="clog-detail-panel">
        <h4>Change-of-Base Check</h4>
        <p><strong>log_${formattedBase}(${formattedValue}) = ln(${formattedValue}) / ln(${formattedBase}) = ${formatNumber(change.fromValue, { maximumFractionDigits: 6 })}</strong></p>
        <p><strong>log_10(${formattedValue}) = ${formatNumber(change.toValue, { maximumFractionDigits: 6 })}</strong></p>
      </article>
    `;
  }

  updateSnapshots({
    value: formattedValue,
    base: formattedBase,
    result: formattedResult,
    status: 'Solved',
  });

  if (graphCanvas) {
    drawLogCurve(graphCanvas, base, value);
  }
  if (graphNote) {
    graphNote.textContent = `Curve highlight is at x = ${formattedValue} for base ${formattedBase}.`;
  }
}

baseSelect?.addEventListener('change', () => {
  toggleCustomRow();
  updateResults();
});

customBaseInput?.addEventListener('change', updateResults);
calculateBtn?.addEventListener('click', updateResults);
valueInput?.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    updateResults();
  }
});

toggleCustomRow();
updateResults();
