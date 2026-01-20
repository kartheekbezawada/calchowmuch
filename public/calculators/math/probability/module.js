import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { toNumber, hasMaxDigits } from '/assets/js/core/validate.js';
import {
  bayesProbability,
  binomialProbability,
  conditionalProbability,
  normalApproxBinomialProbability,
  probabilityAndIndependent,
  probabilityFromOutcomes,
  probabilityOrIndependent,
} from '/assets/js/core/stats.js';

const modeGroup = document.querySelector('[data-button-group="prob-mode"]');
const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'or',
  onChange: () => {
    updateVisibility();
    calculate();
  },
});
const orTypeGroup = document.querySelector('[data-button-group="prob-or-type"]');
const orTypeButtons = setupButtonGroup(orTypeGroup, {
  defaultValue: 'independent',
  onChange: () => {
    updateVisibility();
    calculate();
  },
});
const probFavorableInput = document.querySelector('#prob-favorable');
const probTotalInput = document.querySelector('#prob-total');
const probAInput = document.querySelector('#prob-a');
const probBInput = document.querySelector('#prob-b');
const probJointInput = document.querySelector('#prob-joint');
const probBGivenAInput = document.querySelector('#prob-bgivena');
const probNInput = document.querySelector('#prob-n');
const probKInput = document.querySelector('#prob-k');
const probPInput = document.querySelector('#prob-p');
const favorableRow = document.querySelector('#prob-favorable-row');
const totalRow = document.querySelector('#prob-total-row');
const probARow = document.querySelector('#prob-a-row');
const probBRow = document.querySelector('#prob-b-row');
const probJointRow = document.querySelector('#prob-joint-row');
const probBGivenARow = document.querySelector('#prob-bgivena-row');
const orTypeRow = document.querySelector('#prob-or-type-row');
const probNRow = document.querySelector('#prob-n-row');
const probKRow = document.querySelector('#prob-k-row');
const probPRow = document.querySelector('#prob-p-row');
const calculateButton = document.querySelector('#prob-calculate');
const resultDiv = document.querySelector('#prob-result');
const detailDiv = document.querySelector('#prob-detail');

function updateVisibility() {
  const mode = modeButtons?.getValue() ?? 'and';
  favorableRow.style.display = mode === 'single' ? '' : 'none';
  totalRow.style.display = mode === 'single' ? '' : 'none';
  probARow.style.display = ['and', 'or', 'conditional', 'bayes'].includes(mode) ? '' : 'none';
  probBRow.style.display = ['and', 'or', 'conditional', 'bayes'].includes(mode) ? '' : 'none';
  orTypeRow.style.display = mode === 'or' ? '' : 'none';
  probJointRow.style.display = (mode === 'or' && (orTypeButtons?.getValue() ?? 'independent') === 'inclusive') || mode === 'conditional' ? '' : 'none';
  probBGivenARow.style.display = mode === 'bayes' ? '' : 'none';
  probNRow.style.display = mode === 'distribution' ? '' : 'none';
  probKRow.style.display = mode === 'distribution' ? '' : 'none';
  probPRow.style.display = mode === 'distribution' ? '' : 'none';
}

function parsePercentInput(input, label) {
  const value = toNumber(input.value, 0);
  if (value < 0 || value > 100) {
    return { error: `${label} must be between 0% and 100%.` };
  }
  return { value: value / 100 };
}

function ensureDigits(inputs) {
  const invalidLength = inputs.find((input) => !hasMaxDigits(input.value, 12));
  if (invalidLength) {
    return 'Inputs are limited to 12 digits.';
  }
  return null;
}

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

  const mode = modeButtons?.getValue() ?? 'or';
  let result;
  let formula = '';
  let description = '';
  const opts = { maximumFractionDigits: 4 };

  if (mode === 'single') {
    const digitError = ensureDigits([probFavorableInput, probTotalInput]);
    if (digitError) {
      resultDiv.textContent = digitError;
      return;
    }
    const favorable = toNumber(probFavorableInput.value, 0);
    const total = toNumber(probTotalInput.value, 0);
    if (!Number.isInteger(favorable) || !Number.isInteger(total)) {
      resultDiv.textContent = 'Outcomes must be whole numbers.';
      return;
    }
    result = probabilityFromOutcomes(favorable, total);
    if (result === null) {
      resultDiv.textContent = 'Favorable outcomes must be between 0 and total outcomes.';
      return;
    }
    formula = 'P(E) = favorable / total';
    description = 'The probability of the event based on outcomes.';
  } else if (mode === 'and') {
    const digitError = ensureDigits([probAInput, probBInput]);
    if (digitError) {
      resultDiv.textContent = digitError;
      return;
    }
    const pAResult = parsePercentInput(probAInput, 'P(A)');
    if (pAResult.error) {
      resultDiv.textContent = pAResult.error;
      return;
    }
    const pBResult = parsePercentInput(probBInput, 'P(B)');
    if (pBResult.error) {
      resultDiv.textContent = pBResult.error;
      return;
    }
    result = probabilityAndIndependent(pAResult.value, pBResult.value);
    formula = 'P(A and B) = P(A) × P(B)';
    description = 'The probability of both independent events occurring.';
  } else if (mode === 'or') {
    const digitError = ensureDigits([probAInput, probBInput, probJointInput]);
    if (digitError) {
      resultDiv.textContent = digitError;
      return;
    }
    const pAResult = parsePercentInput(probAInput, 'P(A)');
    if (pAResult.error) {
      resultDiv.textContent = pAResult.error;
      return;
    }
    const pBResult = parsePercentInput(probBInput, 'P(B)');
    if (pBResult.error) {
      resultDiv.textContent = pBResult.error;
      return;
    }
    const orType = orTypeButtons?.getValue() ?? 'independent';
    if (orType === 'inclusive') {
      const jointResult = parsePercentInput(probJointInput, 'P(A and B)');
      if (jointResult.error) {
        resultDiv.textContent = jointResult.error;
        return;
      }
      if (jointResult.value > pAResult.value || jointResult.value > pBResult.value) {
        resultDiv.textContent = 'P(A and B) cannot exceed P(A) or P(B).';
        return;
      }
      result = pAResult.value + pBResult.value - jointResult.value;
      formula = 'P(A or B) = P(A) + P(B) - P(A and B)';
      description = 'Combined probability accounting for overlap.';
    } else {
      result = probabilityOrIndependent(pAResult.value, pBResult.value);
      formula = 'P(A or B) = P(A) + P(B) - P(A) × P(B)';
      description = 'Combined probability for independent events.';
    }
  } else if (mode === 'conditional') {
    const digitError = ensureDigits([probAInput, probBInput, probJointInput]);
    if (digitError) {
      resultDiv.textContent = digitError;
      return;
    }
    const pAResult = parsePercentInput(probAInput, 'P(A)');
    if (pAResult.error) {
      resultDiv.textContent = pAResult.error;
      return;
    }
    const pBResult = parsePercentInput(probBInput, 'P(B)');
    if (pBResult.error) {
      resultDiv.textContent = pBResult.error;
      return;
    }
    const jointResult = parsePercentInput(probJointInput, 'P(A and B)');
    if (jointResult.error) {
      resultDiv.textContent = jointResult.error;
      return;
    }
    if (jointResult.value > pAResult.value || jointResult.value > pBResult.value) {
      resultDiv.textContent = 'P(A and B) cannot exceed P(A) or P(B).';
      return;
    }
    const pAGivenB = conditionalProbability(jointResult.value, pBResult.value);
    const pBGivenA = conditionalProbability(jointResult.value, pAResult.value);
    if (pAGivenB === null || pBGivenA === null) {
      resultDiv.textContent = 'Conditional probability inputs are invalid.';
      return;
    }
    resultDiv.innerHTML = `
      <strong>P(A|B):</strong> ${formatNumber(pAGivenB, opts)} (${formatPercent(pAGivenB * 100, { maximumFractionDigits: 2 })})<br />
      <strong>P(B|A):</strong> ${formatNumber(pBGivenA, opts)} (${formatPercent(pBGivenA * 100, { maximumFractionDigits: 2 })})
    `;
    detailDiv.innerHTML = `
      <p><strong>Formula:</strong> P(A|B) = P(A and B) / P(B)</p>
      <p><strong>Formula:</strong> P(B|A) = P(A and B) / P(A)</p>
      <p><strong>Explanation:</strong> Conditional probabilities based on overlap.</p>
    `;
    return;
  } else if (mode === 'bayes') {
    const digitError = ensureDigits([probAInput, probBInput, probBGivenAInput]);
    if (digitError) {
      resultDiv.textContent = digitError;
      return;
    }
    const pAResult = parsePercentInput(probAInput, 'P(A)');
    if (pAResult.error) {
      resultDiv.textContent = pAResult.error;
      return;
    }
    const pBResult = parsePercentInput(probBInput, 'P(B)');
    if (pBResult.error) {
      resultDiv.textContent = pBResult.error;
      return;
    }
    const pBGivenAResult = parsePercentInput(probBGivenAInput, 'P(B|A)');
    if (pBGivenAResult.error) {
      resultDiv.textContent = pBGivenAResult.error;
      return;
    }
    result = bayesProbability(pAResult.value, pBGivenAResult.value, pBResult.value);
    if (result === null) {
      resultDiv.textContent = 'Bayes inputs are invalid.';
      return;
    }
    formula = 'P(A|B) = P(B|A) × P(A) / P(B)';
    description = 'Bayes theorem updates probability based on evidence.';
  } else if (mode === 'distribution') {
    const digitError = ensureDigits([probNInput, probKInput, probPInput]);
    if (digitError) {
      resultDiv.textContent = digitError;
      return;
    }
    const n = toNumber(probNInput.value, 0);
    const k = toNumber(probKInput.value, 0);
    if (!Number.isInteger(n) || !Number.isInteger(k)) {
      resultDiv.textContent = 'n and k must be whole numbers.';
      return;
    }
    if (n < 1) {
      resultDiv.textContent = 'n must be at least 1.';
      return;
    }
    if (k < 0 || k > n) {
      resultDiv.textContent = 'k must be between 0 and n.';
      return;
    }
    const pResult = parsePercentInput(probPInput, 'p');
    if (pResult.error) {
      resultDiv.textContent = pResult.error;
      return;
    }
    result = binomialProbability(n, k, pResult.value);
    if (result === null) {
      resultDiv.textContent = 'Binomial inputs are invalid.';
      return;
    }
    const expected = n * pResult.value;
    const normalApprox = normalApproxBinomialProbability(n, k, pResult.value);
    resultDiv.innerHTML = `
      <strong>P(X = ${k}):</strong> ${formatNumber(result, opts)} (${formatPercent(result * 100, { maximumFractionDigits: 2 })})<br />
      <strong>Expected value:</strong> ${formatNumber(expected, opts)}
      ${normalApprox === null ? '' : `<br /><strong>Normal approx:</strong> ${formatNumber(normalApprox, opts)} (${formatPercent(normalApprox * 100, { maximumFractionDigits: 2 })})`}
    `;
    detailDiv.innerHTML = `
      <p><strong>Formula:</strong> P(X = k) = C(n, k) × p^k × (1-p)^(n-k)</p>
      <p><strong>Explanation:</strong> Binomial probability with normal approximation for large n.</p>
    `;
    return;
  }

  if (!Number.isFinite(result)) {
    resultDiv.textContent = 'Result is invalid. Check your inputs.';
    return;
  }

  resultDiv.innerHTML = `<strong>Result:</strong> ${formatNumber(result, opts)} (${formatPercent(result * 100, { maximumFractionDigits: 2 })})`;

  detailDiv.innerHTML = `
    <p><strong>Formula:</strong> ${formula}</p>
    <p><strong>Explanation:</strong> ${description}</p>
  `;
}

calculateButton.addEventListener('click', calculate);

// Initialize
updateVisibility();
calculate();
