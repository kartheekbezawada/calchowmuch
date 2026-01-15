import { zScore } from "/assets/js/core/stats.js";
import { formatNumber } from "/assets/js/core/format.js";
import { toNumber } from "/assets/js/core/validate.js";

const xInput = document.querySelector("#zscore-x");
const meanInput = document.querySelector("#zscore-mean");
const stddevInput = document.querySelector("#zscore-stddev");
const calculateButton = document.querySelector("#zscore-calculate");
const resultDiv = document.querySelector("#zscore-result");
const detailDiv = document.querySelector("#zscore-detail");

function calculate() {
  resultDiv.textContent = "";
  detailDiv.textContent = "";

  const x = toNumber(xInput.value, null);
  const mean = toNumber(meanInput.value, null);
  const stddev = toNumber(stddevInput.value, null);

  // Validation
  if (x === null || !Number.isFinite(x)) {
    resultDiv.textContent = "Please enter a valid value (x).";
    return;
  }

  if (mean === null || !Number.isFinite(mean)) {
    resultDiv.textContent = "Please enter a valid mean (μ).";
    return;
  }

  if (stddev === null || !Number.isFinite(stddev)) {
    resultDiv.textContent = "Please enter a valid standard deviation (σ).";
    return;
  }

  if (stddev <= 0) {
    resultDiv.textContent = "Standard deviation must be greater than 0.";
    return;
  }

  const z = zScore(x, mean, stddev);

  if (z === null) {
    resultDiv.textContent = "Calculation error. Please check your inputs.";
    return;
  }

  const opts = { maximumFractionDigits: 4 };

  // Interpretation
  let interpretation;
  if (z === 0) {
    interpretation = "The value equals the mean.";
  } else if (z > 0) {
    interpretation = `The value is ${formatNumber(Math.abs(z), opts)} standard deviations above the mean.`;
  } else {
    interpretation = `The value is ${formatNumber(Math.abs(z), opts)} standard deviations below the mean.`;
  }

  resultDiv.innerHTML = `<strong>Z-score:</strong> ${formatNumber(z, opts)}`;

  detailDiv.innerHTML = `
    <p><strong>Formula:</strong> z = (x - μ) / σ</p>
    <p><strong>Calculation:</strong> z = (${formatNumber(x, opts)} - ${formatNumber(mean, opts)}) / ${formatNumber(stddev, opts)}</p>
    <p><strong>Interpretation:</strong> ${interpretation}</p>
  `;
}

calculateButton.addEventListener("click", calculate);

// Calculate on load with default values
calculate();
