import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  calculateLogBase,
  calculateLogChangeOfBase,
  drawLogCurve,
} from '/assets/js/core/logarithm.js';

const valueInput = document.querySelector('#log-value');
const baseSelect = document.querySelector('#log-base');
const customRow = document.querySelector('#log-custom-row');
const customBaseInput = document.querySelector('#log-custom-base');
const calculateBtn = document.querySelector('#log-calculate');
const resultDiv = document.querySelector('#log-result');
const detailDiv = document.querySelector('#log-detail');
const changeDiv = document.querySelector('#log-change');
const graphCanvas = document.querySelector('#log-graph');

const commonLogMetadata = {
  title: 'Common & Custom Log Calculator | Calculate How Much',
  description:
    'Compute logarithms for base 10, base 2, e, or any custom base and inspect change-of-base conversions.',
  canonical: 'https://calchowmuch.com/calculators/math/log/common-log/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Common log calculator',
    description: 'Switch between log bases, compute log_b(x), and see change-of-base results.',
    step: [
      { '@type': 'HowToStep', text: 'Pick the argument value and base.' },
      { '@type': 'HowToStep', text: 'Toggle a custom base if needed and calculate log_b(x).' },
      { '@type': 'HowToStep', text: 'Read the decimal result and change-of-base relationship.' },
    ],
  },
};

setPageMetadata(commonLogMetadata);

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

function toggleCustomRow() {
  customRow.hidden = baseSelect.value !== 'custom';
}

function updateGraph(base, argument) {
  if (graphCanvas) {
    drawLogCurve(graphCanvas, base, argument);
  }
}

function showMessage(message) {
  resultDiv.textContent = message;
  detailDiv.textContent = '';
  changeDiv.textContent = '';
}

function updateResults() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';
  changeDiv.textContent = '';

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

  resultDiv.innerHTML = `<strong>log_${formatNumber(base, { maximumFractionDigits: 4 })}(${formatNumber(
    value,
    { maximumFractionDigits: 6 }
  )}) = ${formatNumber(result, { maximumFractionDigits: 6 })}</strong>`;

  detailDiv.innerHTML = `Change of base (to base 10): log_${formatNumber(base, {
    maximumFractionDigits: 4,
  })}(${formatNumber(value, { maximumFractionDigits: 6 })}) = ${formatNumber(result, { maximumFractionDigits: 6 })}`;

  const change = calculateLogChangeOfBase(value, base, 10);
  if (change) {
    changeDiv.innerHTML = `Change-of-base: log_${formatNumber(base, {
      maximumFractionDigits: 4,
    })}(${formatNumber(value, { maximumFractionDigits: 6 })}) = ${formatNumber(change.fromValue, {
      maximumFractionDigits: 6,
    })}, log_10(${formatNumber(value, { maximumFractionDigits: 6 })}) = ${formatNumber(change.toValue, {
      maximumFractionDigits: 6,
    })}.`;
  }

  updateGraph(base, value);
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
