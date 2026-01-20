import { formatNumber } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { toNumber, clamp, hasMaxDigits } from '/assets/js/core/validate.js';
import {
  analyzeSequence,
  detectArithmeticSequence,
  detectGeometricSequence,
  generateSequenceTerms,
  nthTermArithmetic,
  nthTermGeometric,
  parseDataset,
  sumArithmetic,
  sumGeometric,
} from '/assets/js/core/stats.js';

const typeGroup = document.querySelector('[data-button-group="seq-type"]');
const typeButtons = setupButtonGroup(typeGroup, {
  defaultValue: 'auto',
  onChange: () => {
    calculate();
  },
});
const termsInput = document.querySelector('#seq-terms');
const nInput = document.querySelector('#seq-n');
const kInput = document.querySelector('#seq-k');
const calculateButton = document.querySelector('#seq-calculate');
const resultDiv = document.querySelector('#seq-result');
const detailDiv = document.querySelector('#seq-detail');

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

  const mode = typeButtons?.getValue() ?? 'auto';
  const n = Math.floor(toNumber(nInput.value, 1));
  const k = clamp(Math.floor(toNumber(kInput.value, 10)), 1, 50);

  kInput.value = k;

  const lengthInputs = [nInput, kInput];
  const invalidLength = lengthInputs.find((input) => !hasMaxDigits(input.value, 12));
  if (invalidLength) {
    resultDiv.textContent = 'Inputs are limited to 12 digits.';
    return;
  }

  if (n < 1) {
    resultDiv.textContent = 'Term index (n) must be at least 1.';
    return;
  }

  const { data: terms, errors } = parseDataset(termsInput.value);
  if (errors.length) {
    resultDiv.textContent = `Invalid terms: ${errors.join(', ')}`;
    return;
  }
  if (terms.length < 3) {
    resultDiv.textContent = 'Enter at least 3 sequence terms.';
    return;
  }
  if (terms.length > 50) {
    resultDiv.textContent = 'Sequence length must be 50 terms or fewer.';
    return;
  }

  let sequenceInfo;
  if (mode === 'auto') {
    sequenceInfo = analyzeSequence(terms);
  } else if (mode === 'arithmetic') {
    const difference = detectArithmeticSequence(terms);
    sequenceInfo = difference === null
      ? { type: 'neither' }
      : { type: 'arithmetic', firstTerm: terms[0], difference };
  } else {
    const ratio = detectGeometricSequence(terms);
    sequenceInfo = ratio === null
      ? { type: 'neither' }
      : { type: 'geometric', firstTerm: terms[0], ratio };
  }

  if (sequenceInfo.type === 'invalid' || sequenceInfo.type === 'neither') {
    resultDiv.textContent = 'Sequence is neither arithmetic nor geometric.';
    return;
  }

  const opts = { maximumFractionDigits: 4 };
  const sequenceType = sequenceInfo.type === 'constant'
    ? 'Constant'
    : sequenceInfo.type === 'geometric'
      ? 'Geometric'
      : 'Arithmetic';
  const a1 = sequenceInfo.firstTerm;
  const difference = sequenceInfo.difference ?? 0;
  const ratio = sequenceInfo.ratio ?? 1;
  const useGeometric = sequenceInfo.type === 'geometric';
  const nthTerm = useGeometric
    ? nthTermGeometric(a1, ratio, n)
    : nthTermArithmetic(a1, difference, n);
  const sum = useGeometric
    ? sumGeometric(a1, ratio, n)
    : sumArithmetic(a1, difference, n);

  if (!Number.isFinite(nthTerm) || !Number.isFinite(sum)) {
    resultDiv.textContent = 'Result is too large or invalid. Try smaller values.';
    return;
  }

  const paramValue = useGeometric ? ratio : difference;
  const preview = generateSequenceTerms(a1, paramValue, k, useGeometric ? 'geometric' : 'arithmetic');
  const previewStr = preview.map((term) => formatNumber(term, opts)).join(', ');

  resultDiv.innerHTML = `
    <strong>${sequenceType} Sequence:</strong>
    Term ${n} (a<sub>${n}</sub>) = ${formatNumber(nthTerm, opts)}
  `;

  const patternLabel = useGeometric ? 'Common ratio (r)' : 'Common difference (d)';
  const formula = useGeometric
    ? 'a_n = a1 × r^(n-1)'
    : 'a_n = a1 + (n-1) × d';

  detailDiv.innerHTML = `
    <p><strong>First term (a1):</strong> ${formatNumber(a1, opts)}</p>
    <p><strong>${patternLabel}:</strong> ${formatNumber(paramValue, opts)}</p>
    <p><strong>Formula:</strong> ${formula}</p>
    <p><strong>Sum of first ${n} terms:</strong> ${formatNumber(sum, opts)}</p>
    <p><strong>First ${k} terms:</strong></p>
    <p style="word-break: break-word;">${previewStr}</p>
  `;
}

calculateButton.addEventListener('click', calculate);

calculate();
