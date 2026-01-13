import { percentageChange } from '/assets/js/core/math.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { toNumber } from '/assets/js/core/validate.js';

const startInput = document.querySelector('#percent-start');
const endInput = document.querySelector('#percent-end');
const result = document.querySelector('#percent-result');
const details = document.querySelector('#percent-details');
const button = document.querySelector('#percent-calc');

function renderResult() {
  const startValue = toNumber(startInput.value);
  const endValue = toNumber(endInput.value);
  const changeValue = endValue - startValue;
  const changePercent = percentageChange(startValue, endValue);

  if (changePercent === null) {
    result.textContent = 'Result: Enter a starting value above 0.';
    details.textContent = '';
    return;
  }

  const direction = changePercent >= 0 ? 'increase' : 'decrease';
  const sign = changePercent >= 0 ? '+' : '';

  result.textContent = `Result: ${sign}${formatPercent(changePercent, {
    maximumFractionDigits: 2,
  })}`;
  details.textContent = `That is a ${direction} of ${formatNumber(changeValue, {
    maximumFractionDigits: 2,
  })} from the starting value.`;
}

button.addEventListener('click', renderResult);
renderResult();
