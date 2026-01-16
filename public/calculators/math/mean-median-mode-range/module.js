import { mean, median, mode, min, max, range, parseDataset } from '/assets/js/core/stats.js';
import { formatNumber } from '/assets/js/core/format.js';

const datasetInput = document.querySelector('#mmmr-dataset');
const calculateButton = document.querySelector('#mmmr-calculate');
const resultDiv = document.querySelector('#mmmr-result');
const detailDiv = document.querySelector('#mmmr-detail');

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

  const { data, errors } = parseDataset(datasetInput.value);

  if (errors.length > 0) {
    resultDiv.textContent = `Invalid values: ${errors.join(', ')}. Please enter valid numbers only.`;
    return;
  }

  if (data.length === 0) {
    resultDiv.textContent = 'Please enter at least one number.';
    return;
  }

  const opts = { maximumFractionDigits: 4 };
  const n = data.length;
  const dataMean = mean(data);
  const dataMedian = median(data);
  const dataMode = mode(data);
  const dataMin = min(data);
  const dataMax = max(data);
  const dataRange = range(data);

  // Format mode
  let modeStr;
  if (dataMode === null) {
    modeStr = 'no mode';
  } else {
    modeStr = dataMode.map((m) => formatNumber(m, opts)).join(', ');
  }

  resultDiv.innerHTML = `<strong>Results</strong> (n = ${n})`;

  detailDiv.innerHTML = `
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-label">Mean</span>
        <span class="stat-value">${formatNumber(dataMean, opts)}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Median</span>
        <span class="stat-value">${formatNumber(dataMedian, opts)}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Mode</span>
        <span class="stat-value">${modeStr}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Min</span>
        <span class="stat-value">${formatNumber(dataMin, opts)}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Max</span>
        <span class="stat-value">${formatNumber(dataMax, opts)}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Range</span>
        <span class="stat-value">${formatNumber(dataRange, opts)}</span>
      </div>
    </div>
  `;
}

calculateButton.addEventListener('click', calculate);

// Calculate on load with default values
calculate();
