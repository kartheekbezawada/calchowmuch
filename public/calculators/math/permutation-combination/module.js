import { factorial, permutation, combination } from '/assets/js/core/stats.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { toNumber, hasMaxDigits } from '/assets/js/core/validate.js';

const modeGroup = document.querySelector('[data-button-group="pc-mode"]');
const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'permutation',
  onChange: () => {
    updateVisibility();
  },
});
const nInput = document.querySelector('#pc-n');
const rInput = document.querySelector('#pc-r');
const rRow = document.querySelector('#pc-r-row');
const calculateButton = document.querySelector('#pc-calculate');
const resultDiv = document.querySelector('#pc-result');
const detailDiv = document.querySelector('#pc-detail');

function updateVisibility() {
  const mode = modeButtons?.getValue() ?? 'permutation';
  rRow.style.display = mode === 'factorial' ? 'none' : '';
}

function toScientificNotation(value) {
  const raw = value.toString();
  if (raw.length <= 15) {
    return null;
  }
  const exponent = raw.length - 1;
  const lead = raw.slice(0, 1);
  const decimals = raw.slice(1, 5).replace(/0+$/, '');
  return `${lead}${decimals ? `.${decimals}` : ''}e+${exponent}`;
}

function factorialSteps(n) {
  if (n === 0 || n === 1) {
    return '1';
  }
  const terms = [];
  for (let i = n; i >= 1; i--) {
    terms.push(i);
  }
  return terms.join(' × ');
}

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

  const mode = modeButtons?.getValue() ?? 'permutation';
  const n = toNumber(nInput.value, 0);
  const r = toNumber(rInput.value, 0);

  const lengthInputs = mode === 'factorial' ? [nInput] : [nInput, rInput];
  const invalidLength = lengthInputs.find((input) => !hasMaxDigits(input.value, 12));
  if (invalidLength) {
    resultDiv.textContent = 'Inputs are limited to 12 digits.';
    return;
  }

  // Validation - check for integer inputs
  if (!Number.isInteger(n)) {
    resultDiv.textContent = 'n must be an integer.';
    return;
  }

  if (mode !== 'factorial' && !Number.isInteger(r)) {
    resultDiv.textContent = 'r must be an integer.';
    return;
  }

  if (n < 0) {
    resultDiv.textContent = 'n must be a non-negative integer.';
    return;
  }

  if (mode !== 'factorial' && r < 0) {
    resultDiv.textContent = 'r must be a non-negative integer.';
    return;
  }

  if (mode !== 'factorial' && r > n) {
    resultDiv.textContent = 'r cannot be greater than n.';
    return;
  }

  if (n > 170) {
    resultDiv.textContent = 'n must be 170 or less to avoid overflow.';
    return;
  }

  let result;
  let formula;
  let label;
  let detailLines = '';

  if (mode === 'permutation') {
    result = permutation(n, r);
    label = `${n}P${r}`;
    formula = `n! / (n-r)! = ${n}! / ${n - r}!`;
    if (n <= 15) {
      detailLines = `<p><strong>Steps:</strong> ${factorialSteps(n)} / ${factorialSteps(n - r)}</p>`;
    }
  } else if (mode === 'combination') {
    result = combination(n, r);
    label = `${n}C${r}`;
    formula = `n! / (r! × (n-r)!) = ${n}! / (${r}! × ${n - r}!)`;
    if (n <= 15) {
      detailLines = `<p><strong>Steps:</strong> ${factorialSteps(n)} / (${factorialSteps(r)} × ${factorialSteps(n - r)})</p>`;
    }
  } else {
    result = factorial(n);
    label = `${n}!`;
    formula = `n! = ${n} × (n-1) × ... × 1`;
    if (n <= 15) {
      detailLines = `<p><strong>Steps:</strong> ${factorialSteps(n)}</p>`;
    }
  }

  if (result === null) {
    resultDiv.textContent = 'Calculation error. Please check your inputs.';
    return;
  }

  // Convert BigInt to string (no commas per requirements)
  const resultStr = result.toString();
  const scientific = toScientificNotation(result);

  const modeLabel = mode === 'permutation'
    ? 'Permutation'
    : mode === 'combination'
      ? 'Combination'
      : 'Factorial';
  resultDiv.innerHTML = `<strong>${modeLabel} ${label}:</strong> ${resultStr}${scientific ? ` (${scientific})` : ''}`;

  detailDiv.innerHTML = `
    <p><strong>Formula:</strong> ${formula}</p>
    <p><strong>n:</strong> ${n} (total items)</p>
    ${mode === 'factorial' ? '' : `<p><strong>r:</strong> ${r} (items to ${mode === 'permutation' ? 'arrange' : 'choose'})</p>`}
    ${detailLines}
    <p><strong>Example use:</strong> ${mode === 'permutation'
    ? 'arranging rankings'
    : mode === 'combination'
      ? 'selecting a committee'
      : 'counting ordered arrangements of all items'}</p>
  `;
}

calculateButton.addEventListener('click', calculate);

// Calculate on load with default values
updateVisibility();
calculate();
