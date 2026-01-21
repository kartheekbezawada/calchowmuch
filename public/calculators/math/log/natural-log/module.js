import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import { calculateNaturalLog, drawLogCurve } from '/assets/js/core/logarithm.js';

const valueInput = document.querySelector('#ln-value');
const decimalsSelect = document.querySelector('#ln-decimals');
const resultDiv = document.querySelector('#ln-result');
const detailDiv = document.querySelector('#ln-detail');
const calculateBtn = document.querySelector('#ln-calculate');
const graphCanvas = document.querySelector('#ln-graph');

const naturalLogMetadata = {
  title: 'Natural Log Calculator | Calculate How Much',
  description:
    'Compute natural logarithms with precision, understand the e^y = x relationship, and visualize the ln curve.',
  canonical: 'https://calchowmuch.com/calculators/math/log/natural-log/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Natural log calculator',
    description: 'Enter any positive number and see its natural logarithm with a chart and explanation.',
    step: [
      { '@type': 'HowToStep', text: 'Provide a positive value for x.' },
      { '@type': 'HowToStep', text: 'Adjust the precision and compute ln(x).' },
      { '@type': 'HowToStep', text: 'Review the symbolic and numeric result plus the graph.' },
    ],
  },
};

setPageMetadata(naturalLogMetadata);

function showMessage(message) {
  resultDiv.textContent = message;
  detailDiv.textContent = '';
}

function updateResults() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

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

  resultDiv.innerHTML = `<strong>ln(${formatNumber(x, { maximumFractionDigits: 6 })}) = ${formattedLn}</strong>`;
  detailDiv.innerHTML = `e^{${formattedLn}} = ${formatNumber(Math.exp(result), { maximumFractionDigits: 6 })}`;
  drawLogCurve(graphCanvas, Math.E, x);
}

calculateBtn?.addEventListener('click', updateResults);
valueInput?.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    updateResults();
  }
});

updateResults();
