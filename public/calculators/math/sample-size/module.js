import { formatNumber } from "/assets/js/core/format.js";
import { toNumber } from "/assets/js/core/validate.js";

const confidenceSelect = document.querySelector("#ss-confidence");
const marginInput = document.querySelector("#ss-margin");
const proportionInput = document.querySelector("#ss-proportion");
const populationInput = document.querySelector("#ss-population");
const calculateButton = document.querySelector("#ss-calculate");
const resultDiv = document.querySelector("#ss-result");
const detailDiv = document.querySelector("#ss-detail");

function calculate() {
  resultDiv.textContent = "";
  detailDiv.textContent = "";

  const z = toNumber(confidenceSelect.value, 1.96);
  const marginPercent = toNumber(marginInput.value, 0);
  const proportionPercent = toNumber(proportionInput.value, 50);
  const populationStr = populationInput.value.trim();

  // Convert percentages to decimals
  const E = marginPercent / 100;
  const p = proportionPercent / 100;

  // Validation
  if (E <= 0) {
    resultDiv.textContent = "Margin of error must be greater than 0%.";
    return;
  }

  if (p < 0 || p > 1) {
    resultDiv.textContent = "Estimated proportion must be between 0% and 100%.";
    return;
  }

  // Base formula: n0 = (z² * p * (1-p)) / E²
  const n0 = (Math.pow(z, 2) * p * (1 - p)) / Math.pow(E, 2);

  let finalN = n0;
  let hasPopulation = false;
  let N = null;

  // Finite population correction if N is provided
  if (populationStr !== "") {
    N = toNumber(populationStr, 0);
    if (N < 1) {
      resultDiv.textContent = "Population size must be at least 1 if provided.";
      return;
    }
    hasPopulation = true;
    // n = n0 / (1 + (n0 - 1) / N)
    finalN = n0 / (1 + (n0 - 1) / N);
  }

  // Round up to whole number
  const sampleSize = Math.ceil(finalN);

  // Get confidence label
  const confidenceLabels = {
    "1.645": "90%",
    "1.96": "95%",
    "2.576": "99%",
  };
  const confidenceLabel = confidenceLabels[confidenceSelect.value] || "Custom";

  resultDiv.innerHTML = `<strong>Required Sample Size:</strong> ${formatNumber(sampleSize, { maximumFractionDigits: 0 })}`;

  let detailHTML = `
    <p><strong>Confidence Level:</strong> ${confidenceLabel} (z = ${z})</p>
    <p><strong>Margin of Error:</strong> ${marginPercent}%</p>
    <p><strong>Estimated Proportion:</strong> ${proportionPercent}%</p>
  `;

  if (hasPopulation) {
    detailHTML += `<p><strong>Population Size:</strong> ${formatNumber(N, { maximumFractionDigits: 0 })}</p>`;
    detailHTML += `<p><strong>Uncorrected n₀:</strong> ${formatNumber(n0, { maximumFractionDigits: 2 })}</p>`;
  }

  detailDiv.innerHTML = detailHTML;
}

calculateButton.addEventListener("click", calculate);

// Calculate on load with default values
calculate();
