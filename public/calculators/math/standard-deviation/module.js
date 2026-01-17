import { mean, variance, standardDeviation, parseDataset } from '/assets/js/core/stats.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';

const datasetInput = document.querySelector('#std-dataset');
const modeGroup = document.querySelector('[data-button-group="std-mode"]');
const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'sample',
  onChange: () => {
    calculate();
  },
});
const calculateButton = document.querySelector('#std-calculate');
const resultDiv = document.querySelector('#std-result');
const detailDiv = document.querySelector('#std-detail');

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

  const { data, errors } = parseDataset(datasetInput.value);
  const isSample = (modeButtons?.getValue() ?? 'sample') === 'sample';
  const modeLabel = isSample ? 'Sample' : 'Population';

  if (errors.length > 0) {
    resultDiv.textContent = `Invalid values: ${errors.join(', ')}. Please enter valid numbers only.`;
    return;
  }

  if (data.length === 0) {
    resultDiv.textContent = 'Please enter at least one number.';
    return;
  }

  if (isSample && data.length < 2) {
    resultDiv.textContent =
      'Sample mode requires at least 2 values. Use Population mode for a single value.';
    return;
  }

  const n = data.length;
  const dataMean = mean(data);
  const dataVariance = variance(data, isSample);
  const dataStdDev = standardDeviation(data, isSample);

  const opts = { maximumFractionDigits: 4 };

  resultDiv.innerHTML = `<strong>${modeLabel} Standard Deviation:</strong> ${formatNumber(dataStdDev, opts)}`;

  detailDiv.innerHTML = `
    <div class="stats-grid">
      <span><strong>Count (n):</strong> ${n}</span>
      <span><strong>Mean:</strong> ${formatNumber(dataMean, opts)}</span>
      <span><strong>Variance:</strong> ${formatNumber(dataVariance, opts)}</span>
    </div>
  `;
}

calculateButton.addEventListener('click', calculate);

// Calculate on load with default values
calculate();
