import {
  sum,
  mean,
  median,
  mode,
  min,
  max,
  range,
  variance,
  standardDeviation,
  parseDataset,
} from "/assets/js/core/stats.js";
import { formatNumber } from "/assets/js/core/format.js";

const datasetInput = document.querySelector("#stats-dataset");
const calculateButton = document.querySelector("#stats-calculate");
const resultDiv = document.querySelector("#stats-result");
const detailDiv = document.querySelector("#stats-detail");

function calculate() {
  resultDiv.textContent = "";
  detailDiv.textContent = "";

  const { data, errors } = parseDataset(datasetInput.value);

  if (errors.length > 0) {
    resultDiv.textContent = `Invalid values: ${errors.join(", ")}. Please enter valid numbers only.`;
    return;
  }

  if (data.length === 0) {
    resultDiv.textContent = "Please enter at least one number.";
    return;
  }

  const opts = { maximumFractionDigits: 4 };
  const n = data.length;
  const dataSum = sum(data);
  const dataMean = mean(data);
  const dataMedian = median(data);
  const dataMode = mode(data);
  const dataMin = min(data);
  const dataMax = max(data);
  const dataRange = range(data);
  const popVariance = variance(data, false);
  const sampleVariance = n >= 2 ? variance(data, true) : null;
  const popStdDev = standardDeviation(data, false);
  const sampleStdDev = n >= 2 ? standardDeviation(data, true) : null;

  // Format mode
  let modeStr;
  if (dataMode === null) {
    modeStr = "no mode";
  } else {
    modeStr = dataMode.map(m => formatNumber(m, opts)).join(", ");
  }

  resultDiv.innerHTML = `<strong>Dataset Statistics</strong> (n = ${n})`;

  detailDiv.innerHTML = `
    <div class="stats-table">
      <div class="stats-section">
        <h4>Basic Statistics</h4>
        <div class="stats-row"><span>Count (n):</span><span>${n}</span></div>
        <div class="stats-row"><span>Sum:</span><span>${formatNumber(dataSum, opts)}</span></div>
        <div class="stats-row"><span>Mean:</span><span>${formatNumber(dataMean, opts)}</span></div>
        <div class="stats-row"><span>Median:</span><span>${formatNumber(dataMedian, opts)}</span></div>
        <div class="stats-row"><span>Mode:</span><span>${modeStr}</span></div>
      </div>
      <div class="stats-section">
        <h4>Range Statistics</h4>
        <div class="stats-row"><span>Minimum:</span><span>${formatNumber(dataMin, opts)}</span></div>
        <div class="stats-row"><span>Maximum:</span><span>${formatNumber(dataMax, opts)}</span></div>
        <div class="stats-row"><span>Range:</span><span>${formatNumber(dataRange, opts)}</span></div>
      </div>
      <div class="stats-section">
        <h4>Variance & Std Dev</h4>
        <div class="stats-row"><span>Population Variance:</span><span>${formatNumber(popVariance, opts)}</span></div>
        <div class="stats-row"><span>Sample Variance:</span><span>${sampleVariance !== null ? formatNumber(sampleVariance, opts) : "n/a (need n ≥ 2)"}</span></div>
        <div class="stats-row"><span>Population Std Dev:</span><span>${formatNumber(popStdDev, opts)}</span></div>
        <div class="stats-row"><span>Sample Std Dev:</span><span>${sampleStdDev !== null ? formatNumber(sampleStdDev, opts) : "n/a (need n ≥ 2)"}</span></div>
      </div>
    </div>
  `;
}

calculateButton.addEventListener("click", calculate);

// Calculate on load with default values
calculate();
