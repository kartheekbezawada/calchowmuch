import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import { solveSimpleExponential } from '/assets/js/core/logarithm.js';

const baseInput = document.querySelector('#exp-base');
const targetInput = document.querySelector('#exp-target');
const multiplierInput = document.querySelector('#exp-mult');
const shiftInput = document.querySelector('#exp-shift');
const resultDiv = document.querySelector('#exp-result');
const detailDiv = document.querySelector('#exp-detail');
const calculateBtn = document.querySelector('#exp-calculate');

const expMetadata = {
  title: 'Exponential Equation Solver | Calculate How Much',
  description:
    'Solve equations of the form base^(m·x + c) = target using logarithms and inspect the intersection on the exponential curve.',
  canonical: 'https://calchowmuch.com/calculators/math/log/exponential-equations/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Exponential equation solver',
    description: 'Find x when a base raised to a linearly shifted power equals a target, using natural logarithms.',
    step: [
      { '@type': 'HowToStep', text: 'Enter the base, target value, multiplier, and shift.' },
      { '@type': 'HowToStep', text: 'Compute the logarithmic solution for x.' },
      { '@type': 'HowToStep', text: 'Check the exponential graph to see where the curve crosses the target height.' },
    ],
  },
};

setPageMetadata(expMetadata);

function showMessage(message) {
  resultDiv.textContent = message;
  detailDiv.textContent = '';
}

function updateResults() {
  if (!hasMaxDigits(baseInput.value, 12) || !hasMaxDigits(targetInput.value, 12) || !hasMaxDigits(multiplierInput.value, 12) || !hasMaxDigits(shiftInput.value, 12)) {
    showMessage('Inputs are limited to 12 digits.');
    return;
  }

  const base = toNumber(baseInput.value, 2);
  const target = toNumber(targetInput.value, 16);
  const multiplier = toNumber(multiplierInput.value, 1);
  const shift = toNumber(shiftInput.value, 0);

  if (base <= 0 || base === 1 || multiplier === 0 || target <= 0) {
    showMessage('Base must be >0 and ≠1, multiplier ≠ 0, and target must be positive.');
    return;
  }

  const solution = solveSimpleExponential({ base, target, multiplier, shift });
  if (solution === null) {
    showMessage('Unable to compute a solution with those inputs.');
    return;
  }

  resultDiv.innerHTML = `<strong>x = ${formatNumber(solution, { maximumFractionDigits: 6 })}</strong>`;
  const equationText = `${formatNumber(base)}^(${formatNumber(multiplier)}x + ${formatNumber(shift)}) = ${formatNumber(target)}`;
  detailDiv.innerHTML = `Equation: ${equationText}; x = (log_${formatNumber(base)}(${formatNumber(target)}) - ${formatNumber(
    shift,
    { maximumFractionDigits: 4 }
  )}) / ${formatNumber(multiplier, { maximumFractionDigits: 4 })}`;
}

for (const input of [baseInput, targetInput, multiplierInput, shiftInput]) {
  input?.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      updateResults();
    }
  });
}

calculateBtn?.addEventListener('click', updateResults);
updateResults();
